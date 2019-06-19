// Import necessary libraries for App
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

// Import containers
import HomePage from './containers/HomePage';
import MyAccountHomePage from './containers/MyAccountHomePage';

import './scss/style.css';

import TodoApp from './containers/TodoApp';

export class App extends Component {
  render() {
    return (
      <TodoApp>
        <BrowserRouter key="router">
          <Switch>
            <Route exact path="/my-account" component={MyAccountHomePage} />
            <Route exact path="/" component={HomePage} />
          </Switch>
        </BrowserRouter>
      </TodoApp>
    );
  }
}

export default connect(state => ({}))(App);
