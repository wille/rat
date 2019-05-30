import * as React from 'react';
import styled from 'react-emotion';

import StaticImage from '../Clients/StaticImage';

import { FileEntry } from 'src/messages/directory';
import { requireFileIcon } from '../../icons-utils';
import AlignChildren from '../AlignChildren';

const StyledRow = styled('tr')`
  &:hover {
    cursor: pointer;
  }
`;

interface Props {
  file: FileEntry;
  onClick: (
    file?: FileEntry,
    e?: React.MouseEvent<HTMLTableRowElement>
  ) => void;
}

const fileDisplayName = (file: FileEntry) => file.path;

const Row = ({ file, onClick }: Props) => {
  const fileSize = file.dir ? '' : file.size;
  const icon = requireFileIcon(file.path, file.dir);

  return (
    <StyledRow onClick={e => onClick(file, e)}>
      <td>
        <AlignChildren>
          <StaticImage size="16px" src={icon} />
          {fileDisplayName(file)}
        </AlignChildren>
      </td>
      <td>{fileSize}</td>
      <td>{file.time}</td>
    </StyledRow>
  );
};

export default Row;
