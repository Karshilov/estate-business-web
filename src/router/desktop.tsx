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
import SecondHandSearch from '../pages/SecondHandPage/SecondHandSearch';
import SecondHandDetail from '../pages/SecondHandPage/SecondHandDetail';
import BlogPublish from '../pages/Blog/BlogPublish'
import PersonalPage from '../pages/PersonalPage'
import Broker from '../pages/Broker';
import BlogList from '../pages/Blog/BlogList';
import BlogDetail from '../pages/Blog/BlogDetail';

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
            <Route exact path="/rent/detail/:id" component={RentDetail} />
            <Route path="/rent-search/:keywords" component={RentSearch} />
            <Route exact path="/rent-search" component={RentSearch} />
            {/*
            <Route path="/second-hand/detail/:id" component={SecondHandDetail} />
            <Route path="/second-hand-search/:keywords" component={SecondHandSearch} />
            <Route path="/second-hand-search" component={SecondHandSearch} />
            */}
            <Route exact path="/blog-detail/:id" component={BlogDetail} />
            <Route path="/blog-publish/:id" component={BlogPublish} />
            <Route exact path="/blog-publish" component={BlogPublish} />
            <Route exact path="/blog-list" component={BlogList} />
            <Route exact path="/personal-page" component={PersonalPage} />
            <Route path="/personal-page/:id" component={PersonalPage} />
            <Route exact path="/broker" component={Broker} />
          </AuthGuard>
        </Switch>
      </HashRouter>
    </Frame>
  );
})

export default DesktopRouter;