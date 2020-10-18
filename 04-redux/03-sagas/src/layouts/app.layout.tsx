import React from 'react';
import * as classes from './app.styles';

interface ChildrenProps {
  className: string;
}

interface Props {
  children: (props: ChildrenProps) => React.ReactNode;
}

export const AppLayout: React.FunctionComponent<Props> = (props) => {
  const { children } = props;

  return <>{children({ className: classes.content })}</>;
};
