// Import necessary libraries for App
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import DevTools from './components/DevTools';

// Import containers
import HomePage from './containers/HomePage';
import MyAccountHomePage from './containers/MyAccountHomePage';

import './App.css';

import TodoApp from './containers/TodoApp';

let devtools;
if (process.env.NODE_ENV === 'development') {
  devtools = <DevTools key="devtools" />;
}

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
        {devtools}
      </TodoApp>
    );
  }
}

export default connect(state => ({}))(App);
