namespace ANSI {

	let ANSI_COLORS = [
		[
			[ "0, 0, 0" ],
			[ "187, 0, 0" ],
			[ "0, 187, 0" ],
			[ "187, 187, 0" ],
			[ "0, 0, 187" ],
			[ "187, 0, 187" ],
			[ "0, 187, 187" ],
			[ "255,255,255" ]
		],
		[
			[ "85, 85, 85" ],
			[ "255, 85, 85" ],
			[ "0, 255, 0" ],
			[ "255, 255, 85" ],
			[ "85, 85, 255" ],
			[ "255, 85, 255" ],
			[ "85, 255, 255" ],
			[ "255, 255, 255" ]
		]
	];

	let PALETTE_COLORS;
	let fg;
	let bg;
	let bright;
	let bold: boolean;
	let underline: boolean;

	function setupPalette() {
		// Index 0..15 : System color
		let i, j;
		for (i = 0; i < 2; ++i) {
			for (j = 0; j < 8; ++j) {
				PALETTE_COLORS.push(ANSI_COLORS[i][j]['color']);
			}
		}

		// Index 16..231 : RGB 6x6x6
		// https://gist.github.com/jasonm23/2868981#file-xterm-256color-yaml
		let levels = [0, 95, 135, 175, 215, 255];
		let format = function (r, g, b) { return levels[r] + ', ' + levels[g] + ', ' + levels[b]; };
		let r, g, b;
		for (r = 0; r < 6; ++r) {
			for (g = 0; g < 6; ++g) {
				for (b = 0; b < 6; ++b) {
					PALETTE_COLORS.push(format.call(this, r, g, b));
				}
			}
		}

		// Index 232..255 : Grayscale
		let level = 8;
		format = function (level) { return level + ', ' + level + ', ' + level; };
		for (i = 0; i < 24; ++i, level += 10) {
			PALETTE_COLORS.push(format.call(this, level));
		}
	}

	function escapeForHtml(txt: string) {
		return txt.replace(/[&<>]/gm, function (str) {
			if (str === "&") return "&amp;";
			if (str === "<") return "&lt;";
			if (str === ">") return "&gt;";
		});
	}

	function linkify(txt: string) {
		return txt.replace(/(https?:\/\/[^\s]+)/gm, function (str) {
			return "<a href=\"" + str + "\">" + str + "</a>";
		});
	}

	export function ansi_to_html(txt) {
		return process(txt, true);
	};

	export function ansi_to_text(txt) {
		return process(txt, false);
	};

	function process(txt, markup) {
		let raw_text_chunks = txt.split(/\033\[/);
		let first_chunk = raw_text_chunks.shift(); // the first chunk is not the result of the split

		let color_chunks = raw_text_chunks.map((chunk) => {
			return process_chunk(chunk, markup);
		});

		color_chunks.unshift(first_chunk);

		return color_chunks.join('');
	};

	function process_chunk(text, markup) {
		// Each 'chunk' is the text after the CSI (ESC + '[') and before the next CSI/EOF.
		//
		// This regex matches four groups within a chunk.
		//
		// The first and third groups match code type.
		// We supported only SGR command. It has empty first group and 'm' in third.
		//
		// The second group matches all of the number+semicolon command sequences
		// before the 'm' (or other trailing) character.
		// These are the graphics or SGR commands.
		//
		// The last group is the text (including newlines) that is colored by
		// the other group's commands.
		let matches = text.match(/^([!\x3c-\x3f]*)([\d;]*)([\x20-\x2c]*[\x40-\x7e])([\s\S]*)/m);

		if (!matches) return text;

		let orig_txt = matches[4];
		let nums = matches[2].split(';');

		// We currently support only "SGR" (Select Graphic Rendition)
		// Simply ignore if not a SGR command.
		if (matches[1] !== '' || matches[3] !== 'm') {
			return orig_txt;
		}

		if (!markup) {
			return orig_txt;
		}

		while (nums.length > 0) {
			let num_str = nums.shift();
			let num = parseInt(num_str);

			if (isNaN(num) || num === 0) {
				fg = bg = null;
				bright = 0;
				bold = false;
				underline = false;
			} else if (num === 1) {
				bright = 1;
				bold = !bold;
			} else if (num === 4) {
				underline = !underline;
			} else if (num === 39) {
				fg = null;
			} else if (num === 49) {
				bg = null;
			} else if ((num >= 30) && (num < 38)) {
				fg = ANSI_COLORS[bright][(num % 10)];
			} else if ((num >= 90) && (num < 98)) {
				fg = ANSI_COLORS[1][(num % 10)]
			} else if ((num >= 40) && (num < 48)) {
				bg = ANSI_COLORS[0][(num % 10)];
			} else if ((num >= 100) && (num < 108)) {
				bg = ANSI_COLORS[1][(num % 10)];
			} else if (num === 38 || num === 48) { // extend color (38=fg, 48=bg)
				let is_foreground = (num === 38);
				if (nums.length >= 1) {
					let mode = nums.shift();
					if (mode === '5' && nums.length >= 1) { // palette color
						let palette_index = parseInt(nums.shift());
						if (palette_index >= 0 && palette_index <= 255) {
							if (!PALETTE_COLORS) {
								setupPalette();
							}
							if (is_foreground) {
								fg = PALETTE_COLORS[palette_index];
							} else {
								bg = PALETTE_COLORS[palette_index];
							}
						}
					} else if (mode === '2' && nums.length >= 3) { // true color
						let r = parseInt(nums.shift());
						let g = parseInt(nums.shift());
						let b = parseInt(nums.shift());
						if ((r >= 0 && r <= 255) && (g >= 0 && g <= 255) && (b >= 0 && b <= 255)) {
							let color = r + ', ' + g + ', ' + b;

							if (is_foreground) {
								fg = color;
							} else {
								bg = color;
							}
						}
					}
				}
			}
		}

		if ((fg === null) && (bg === null)) {
			return orig_txt;
		} else {
			let styles = [];
			let classes = [];
			let data = {};
			let render_data = function(data) {
				let fragments = [];
				let key;
				for (key in data) {
					if (data.hasOwnProperty(key)) {
						fragments.push('data-' + key + '="' + escapeForHtml(data[key]) + '"');
					}
				}
				return fragments.length > 0 ? ' ' + fragments.join(' ') : '';
			};

			if (fg) {
				styles.push("color:rgb(" + fg + ")");
			}

			if (bg) {
				styles.push("background-color:rgb(" + bg + ")");
			}

			if (bright) {
				styles.push("font-weight: bold");
			}

			if (underline) {
				styles.push("text-decoration: underline");
			}

			return '<span style="' + styles.join(';') + '"' + render_data(data) + '>' + orig_txt + '</span>';
		}
	};
}
