import * as React from 'react';
import styled from 'react-emotion';

import StaticImage from '@components/Clients/StaticImage';
import { FileEntry } from '@shared/templates';

import AlignChildren from '@components/AlignChildren';
import { requireFileIcon } from '../../icons-utils';

const StyledRow = styled('tr')`
  &:hover {
    cursor: pointer;
  }
`;

interface Props {
  file: FileEntry;
  onClick: (file?: FileEntry) => void;
}

const Row = ({ file }: Props) => {
  const fileSize = file.directory ? '' : file.size;
  const icon = requireFileIcon(file.path, file.directory);

  return (
    <StyledRow>
      <td>
        <AlignChildren>
          <StaticImage size="16px" src={icon} />
          {file.path}
        </AlignChildren>
      </td>
      <td>{fileSize}</td>
      <td>{file.time}</td>
    </StyledRow>
  );
};

export default Row;
