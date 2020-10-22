import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { AuthRouterComponent } from 'common-app/auth';
import { routes } from './routes';
import {
  LoginScene,
  SubmoduleListScene,
  ProjectListScene,
  EmployeeListScene,
  ProjectScene,
  EmployeeScene,
} from 'scenes';

export const RouterComponent: React.FunctionComponent = () => {
  return (
    <HashRouter>
      <Switch>
        <Route
          exact={true}
          path={[routes.root, routes.login]}
          component={LoginScene}
        />
        <AuthRouterComponent
          exact={true}
          path={routes.submoduleList}
          component={SubmoduleListScene}
        />
        <AuthRouterComponent
          exact={true}
          path={routes.projects}
          component={ProjectListScene}
        />
        <AuthRouterComponent
          exact={true}
          path={routes.employees}
          component={EmployeeListScene}
        />
        <AuthRouterComponent
          exact={true}
          path={routes.editProject()}
          component={ProjectScene}
        />
        <AuthRouterComponent
          exact={true}
          path={routes.editEmployee()}
          component={EmployeeScene}
        />
      </Switch>
    </HashRouter>
  );
};
