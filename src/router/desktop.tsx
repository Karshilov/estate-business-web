import React from 'react';
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom';
import Frame from '../pages/Frame';
import PublishResources from '../pages/PublishResources';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AuthGuard from '../components/AuthGuard';

const DesktopRouter = withRouter(({ history }) => {
  return (
    <Frame history={history}>
      <HashRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <AuthGuard>
            <Route exact path="/publish-resources" component={PublishResources} />
          </AuthGuard>
        </Switch>
      </HashRouter>
    </Frame>
  );
})

export default DesktopRouter;