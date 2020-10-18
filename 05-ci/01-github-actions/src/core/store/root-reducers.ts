import { combineReducers } from 'redux';
import { membersReducer, MemberListState } from 'pods/member-list';

export interface State {
  memberList: MemberListState;
}

export const rootReducers = combineReducers<State>({
  memberList: membersReducer,
});
