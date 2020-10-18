import React from 'react';
import { AppLayout } from 'layouts';
import { MemberListContainer } from 'pods/member-list';

export const MemberListScene: React.FunctionComponent = () => {
  return (
    <AppLayout>
      {({ className }) => <MemberListContainer className={className} />}
    </AppLayout>
  );
};
