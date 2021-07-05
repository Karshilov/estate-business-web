import React from 'react';
import { HashRouter, Route, Switch  } from 'react-router-dom';
import Home from '../pages/Home';

const RootRouter = function () {
    return (
      <HashRouter>
        <Switch>
            <Route path="/" component={Home} />
        </Switch>
      </HashRouter>
    );
  };
  
  export default RootRouter;