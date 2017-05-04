class TableSearch {

	constructor(private input: HTMLInputElement, private table: HTMLTableElement) {
		this.input.oninput = () => {
			this.search(this.input.value);
		};
	}

	public search(term: string) {
		let elements = this.table.getElementsByTagName("tr");

		for (let i = 0; i < elements.length; i++) {
			let element = elements[i];

			for (let j = 0; j < element.children.length; j++) {
				let child = element.children[j];

				let contains = child.innerHTML.toLowerCase().indexOf(term.toLowerCase()) >= 0;
				
				element.hidden = !contains;

				if (contains) {
					break;
				}
			}
		}
	}
}