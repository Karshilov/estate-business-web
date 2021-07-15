import React from 'react';
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom';
import Frame from '../pages/Frame';
import PublishResources from '../pages/PublishResources';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AuthGuard from '../components/AuthGuard';
import RentSearch from '../pages/RentPage/RentSearch';
import RentDetail from '../pages/RentPage/RentDetail';

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
            <Route path="/rent/detail/:id" component={RentDetail} />
            <Route path="/rent-search/:keywords" component={RentSearch} />
            <Route path="/rent-search" component={RentSearch} />
          </AuthGuard>
        </Switch>
      </HashRouter>
    </Frame>
  );
})

export default DesktopRouter;