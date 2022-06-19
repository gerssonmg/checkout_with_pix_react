import React from 'react';
import { Switch, Route } from 'react-router-dom';

import LoginComponent from './login/login.component';
import SignupComponent from './sign-up/signup.component';
import PartiesListComponent from './home/parties-list.component';
import Profile from './profile/profile.component'
import CheckoutPixComponent from './checkout/CheckoutPixComponent';
import ResetPassword from './reset_password/reset-password.component';


export default function PublicRoutes() {
  return (
    <Switch>
      <Route exact path="/login" component={LoginComponent} />

      <Route exact path="/nova-senha" component={ResetPassword} />

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
        path="/comprar/:id"
        component={CheckoutPixComponent}
      />

      <Route
        path="/"
        component={PartiesListComponent}
      />
    </Switch>
  );
}
