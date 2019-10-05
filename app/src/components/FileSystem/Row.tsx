import * as React from 'react';
import { css } from 'react-emotion';

import StaticImage from '../Clients/StaticImage';

import Timeago from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import path from 'path';
import { FileEntry } from 'src/messages/directory';
import { requireFileIcon } from '../../icons-utils';
import AlignChildren from '../AlignChildren';

Timeago.addLocale(en);
const timeAgo = new Timeago('en-US');

const styles = {
  row: css`
    &:hover {
      cursor: pointer;
    }
  `,
};

interface Props {
  file: FileEntry;
  onClick: (
    file?: FileEntry,
    e?: React.MouseEvent<HTMLTableRowElement>
  ) => void;
}

const Row = ({ file, onClick }: Props) => {
  const fileSize = file.dir ? '' : file.size;
  const icon = requireFileIcon(file.path, file.dir);
  const basename = path.basename(file.path);

  const ref = React.useRef(null);
  React.useEffect(() => {
    const interval = setInterval(() => {
      ref.current.innerText = timeAgo.format(file.time * 1000);
    }, 15000);

    return () => clearInterval(interval);
  });

  return (
    <tr className={styles.row} onClick={e => onClick(file, e)}>
      <td>
        <AlignChildren>
          <StaticImage size="16px" src={icon} />
          <span title={file.path}>{basename}</span>
        </AlignChildren>
      </td>
      <td>{fileSize}</td>
      <td>
        <span ref={ref} title={new Date(file.time * 1000).toISOString()}>
          {timeAgo.format(file.time * 1000)}
        </span>
      </td>
    </tr>
  );
};

export default Row;
