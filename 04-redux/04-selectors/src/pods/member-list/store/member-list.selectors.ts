import { createSelector } from 'reselect';
import { State } from 'core/store';
import { mapMemberListModelToVM } from '../member-list.mappers';

export const getMemberListState = (state: State) => state.memberList;

export const getMemberList = createSelector(
  getMemberListState,
  ({ list }) => list
);

export const getMemberListVm = createSelector(getMemberList, (memberList) =>
  mapMemberListModelToVM(memberList)
);

export const getServerError = createSelector(
  getMemberListState,
  ({ serverError }) => serverError
);
