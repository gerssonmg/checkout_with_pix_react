import React from 'react';
import { Switch, Route } from 'react-router-dom';

import LoginComponent from './login/login.component';
import SignupComponent from './sign-up/signup.component';
import PartiesListComponent from './home/parties-list.component';
import Profile from './profile/profile.component'

export default function PublicRoutes() {
  return (
    <Switch>
      <Route exact path="/login" component={LoginComponent} />

      <Route
        exact
        path="/cadastro"
        component={SignupComponent}
      />
      <Route
        path="/perfil"
        component={Profile}
      />
      <Route
        path="/"
        component={PartiesListComponent}
      />
    </Switch>
  );
}
