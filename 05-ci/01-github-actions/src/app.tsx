import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import { store } from 'core/store';
import { RouterComponent } from 'core/router';
import { ThemeProviderComponent } from 'core/theme';

export const App: React.FunctionComponent = () => {
  return (
    <ThemeProviderComponent>
      <Provider store={store}>
        <RouterComponent />
      </Provider>
    </ThemeProviderComponent>
  );
};

export default hot(App);
