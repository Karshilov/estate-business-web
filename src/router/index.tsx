import * as React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import DesktopRouter from './desktop';

const RootRouter = function () {
  return (
    <HashRouter>
      <Switch>
        <Route path='/'>
          <DesktopRouter />
        </Route>
      </Switch>
    </HashRouter>
  );
};

export default RootRouter;