import React from 'react';
import { cx } from 'emotion';
import Typography from '@material-ui/core/Typography';
import { TableComponent } from './components';
import { Member } from './member-list.vm';
import * as classes from './member-list.styles';

interface Props {
  serverError: string | null;
  memberList: Member[];
  className?: string;
}

export const MemberListComponent: React.FunctionComponent<Props> = (props) => {
  const { memberList, serverError, className } = props;
  return (
    <div className={cx(classes.root, className)}>
      <Typography className={classes.title} variant="h2">
        Members
      </Typography>
      {serverError ? (
        <div>{serverError}</div>
      ) : (
        <TableComponent memberList={memberList} />
      )}
    </div>
  );
};
