import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PublicTemplate from './PublicTemplate';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

// Import loader from components
import Loader from '../components/Loader';

export class HomePage extends Component {
  static propTypes = {
    authenticated: PropTypes.bool,
    dispatch: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { dispatch } = this.props;
  }

  render() {
    const { authenticated, apiUrlsLoading } = this.props;

    // Make a buffer just in case the page loads before information is fetched.
    let content = <Loader />;
    let notification;

    if (authenticated) {
      notification = <p>You have no tasks right now. Create one!</p>;
    } else {
      notification = (
        <p>
          You have no tasks right now. <Link to="/my-account">Log in</Link> to
          create one!
        </p>
      );
    }

    content = (
      <div className="container">
        <Row>
          <Col sm={12} md={8} mdOffset={2}>
            <h1>The ultimate To-Do List</h1>
            {notification}
          </Col>
        </Row>
      </div>
    );
    return <PublicTemplate>{content}</PublicTemplate>;
  }
}

export default HomePage;
