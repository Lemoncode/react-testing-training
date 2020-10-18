import { BaseAction } from 'common/models';
import { Member } from '../api';
import { actionIds } from './member-list.action-ids';

export type FetchMembersRequestAction = BaseAction<
  typeof actionIds.FETCH_MEMBERS_REQUEST
>;
export const fetchMembersRequest = (): FetchMembersRequestAction => ({
  type: actionIds.FETCH_MEMBERS_REQUEST,
});

export type FetchMembersSuccessAction = BaseAction<
  typeof actionIds.FETCH_MEMBERS_SUCCESS,
  Member[]
>;

export const fetchMembersSuccess = (
  members: Member[]
): FetchMembersSuccessAction => ({
  type: actionIds.FETCH_MEMBERS_SUCCESS,
  payload: members,
});

export type FetchMembersErrorAction = BaseAction<
  typeof actionIds.FETCH_MEMBERS_ERROR,
  string
>;

export const fetchMembersError = (error: string): FetchMembersErrorAction => ({
  type: actionIds.FETCH_MEMBERS_ERROR,
  payload: error,
});

export type MemberListAction = FetchMembersRequestAction | FetchMembersSuccessAction | FetchMembersErrorAction;
