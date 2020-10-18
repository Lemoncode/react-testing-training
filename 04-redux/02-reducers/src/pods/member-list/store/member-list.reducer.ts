import { Reducer } from 'redux';
import { Member } from '../api';
import { MemberListAction } from './member-list.actions';
import { actionIds } from './member-list.action-ids';

export interface MemberListState {
  list: Member[];
  serverError: string | null;
}

const createInitialState = (): MemberListState => ({
  list: [],
  serverError: null,
});

type MembersReducer = Reducer<MemberListState, MemberListAction>;
export const membersReducer: MembersReducer = (
  state = createInitialState(),
  action
) => {
  switch (action.type) {
    case actionIds.FETCH_MEMBERS_SUCCESS:
      return handleFetchMembersSuccess(state, action.payload);
    case actionIds.FETCH_MEMBERS_ERROR:
      return handleFetchMembersError(state, action.payload);
    default:
      return state;
  }
};

const handleFetchMembersSuccess = (
  _state: MemberListState,
  members: Member[]
): MemberListState => ({
  list: members,
  serverError: null,
});

const handleFetchMembersError = (
  state: MemberListState,
  error: string
): MemberListState => ({
  ...state,
  serverError: error,
});
