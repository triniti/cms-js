import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import authRedirectTo from '../../utils/authRedirectTo';
import delegateFactory from './delegate';
import selector from './selector';

class LoginScreen extends React.Component {
  static propTypes = {
    delegate: PropTypes.objectOf(PropTypes.func).isRequired,
    isAuthenticated: PropTypes.bool,
    history: PropTypes.object.isRequired, // eslint-disable-line
    match: PropTypes.object.isRequired, // eslint-disable-line
    location: PropTypes.object.isRequired,  // eslint-disable-line
  };

  static defaultProps = {
    isAuthenticated: false,
  };

  componentDidMount() {
    const { delegate, isAuthenticated, history, match, location } = this.props;
    if (!isAuthenticated && !match.params.temp) {
      delegate.requestLogin();
    } else if (!isAuthenticated && match.params.temp) {
      const tempToken = location.hash.substr(1);
      delegate.requestTemporaryLogin(tempToken).then(() => {
        history.replace(authRedirectTo.get());
      });
    }
  }

  render() {
    const { isAuthenticated } = this.props;

    if (isAuthenticated) {
      return <Redirect to={authRedirectTo.get()} />;
    }

    // authenticator service will handle the rendering of a login form
    return null;
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(LoginScreen);
