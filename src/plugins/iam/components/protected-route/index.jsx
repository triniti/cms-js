import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { ACCESS_TOKEN_STORAGE_KEY } from '@gdbots/pbjx/constants';
import authRedirectTo from '../../utils/authRedirectTo';
import isJwtExpired from '../../utils/isJwtExpired';
import selector from './selector';

export default function createProtectedRoute(ProtectedComponent, extra = {}) {
  const ProtectedRoute = ({ isAuthenticated, location, ...rest }) => {
    const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    if (!isJwtExpired(token) && isAuthenticated) {
      return (
        <ProtectedComponent
          isAuthenticated={isAuthenticated}
          location={location}
          {...extra}
          {...rest}
        />
      );
    }

    const { pathname, search, hash } = location;
    const redirectTo = `${pathname}${search || ''}${hash || ''}`;
    authRedirectTo.set(redirectTo);
    return <Redirect to="/login" />;
  };

  ProtectedRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    location: PropTypes.shape({}).isRequired,
  };

  return connect(selector)(ProtectedRoute);
}
