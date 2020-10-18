import Axios from 'axios';
import { Member } from './member-list.api-model';

const url = 'https://api.github.com/orgs/lemoncode/members';

export const fetchMembers = async (): Promise<Member[]> => {
  const { data } = await Axios.get<Member[]>(url);
  return data;
};
