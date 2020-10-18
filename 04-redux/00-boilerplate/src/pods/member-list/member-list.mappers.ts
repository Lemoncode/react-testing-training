import * as model from './api/member-list.api-model';
import * as vm from './member-list.vm';

export const mapMemberListModelToVM = (members: model.Member[]): vm.Member[] =>
  Array.isArray(members) ? members.map(mapMemberModelToVM) : [];

const mapMemberModelToVM = (member: model.Member): vm.Member => ({
  id: member.id,
  name: member.login,
  avatarUrl: member.avatar_url,
});
