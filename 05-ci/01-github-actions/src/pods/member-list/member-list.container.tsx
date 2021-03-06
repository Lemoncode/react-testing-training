import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { State } from 'core/store';
import { MemberListAction, fetchMembersRequest, getMemberListVm, getServerError } from './store';
import { Member } from './member-list.vm';
import { MemberListComponent } from './member-list.component';

interface Props {
  memberList: Member[];
  serverError: string | null;
  fetchMembers: () => void;
  className?: string;
}

const InnerMemberListContainer: React.FunctionComponent<Props> = React.memo((props) => {
  const { memberList, serverError, fetchMembers } = props;
  React.useEffect(fetchMembers, []);

  return <MemberListComponent memberList={memberList} serverError={serverError} />;
});

const mapStateToProps = (state: State) => ({
  memberList: getMemberListVm(state),
  serverError: getServerError(state),
});

const mapDispatchToProps = (dispatch: Dispatch<MemberListAction>) => ({
  fetchMembers: () => {
    dispatch(fetchMembersRequest());
  },
});

export const MemberListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InnerMemberListContainer);
