import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { PageHeader, Button, Row, Col } from 'react-bootstrap';
//import AccountUpdater from './AccountUpdater';
//import PostsByUser from '../containers/PostsByUser';
import { connect } from 'react-redux';
import MyAccountTemplate from '../containers/MyAccountTemplate';

export class MyAccountHomePage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object,
    manufacturers: PropTypes.array
  };

  render() {
    return (
      <MyAccountTemplate>
        <div className="edit-account-page">
          <Row>
            <Col xs={12} md={8} mdOffset={2}>
              <PageHeader>
                My Account <small>edit account details below</small>
              </PageHeader>
              {/* <AccountUpdater
                user={this.props.user}
                profile={this.props.profile}
              /> */}
              <PageHeader>
                My Posts <small>view or update posts below</small>
              </PageHeader>
              {/* <PostsByUser /> */}
              <hr />
              <Link to="posts/new">
                <Button onClick={null}>
                  <span className="glyphicon glyphicon-plus" /> Create a new
                  post
                </Button>
              </Link>
              <p className="return-link marg-top-md">
                <Link to="/">
                  <span className="marg-left-mdsm glyphicon glyphicon-arrow-left" />{' '}
                  Back to all posts
                </Link>
              </p>
            </Col>
          </Row>
        </div>
      </MyAccountTemplate>
    );
  }
}

export default connect(state => {
  return {
    user: state.application.user,
    profile: state.application.profile
  };
})(MyAccountHomePage);
