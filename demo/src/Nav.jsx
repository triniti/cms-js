import get from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';
import TrinitiAppNav from '@triniti/admin-ui-plugin/components/triniti-app-nav';
import isGranted from '../../src/plugins/iam/selectors/isGranted';
import navConfig from './config/navConfig';

const Nav = ({ store }) => {
  const user = get(store.getState(), 'iam.auth.user');
  const userName = user ? `${user.get('first_name')} ${user.get('last_name')}` : '';
  const state = store.getState();

  for (let i = 0; i < navConfig.length; i += 1) {
    const dpLinks = navConfig[i] && navConfig[i].dpLinks
      ? navConfig[i].dpLinks
      : [];

    if (navConfig[i] && navConfig[i].permission && !isGranted(state, navConfig[i].permission)) {
      delete navConfig[i];
    }

    for (let j = 0; j < dpLinks.length; j += 1) {
      if (dpLinks[j] && dpLinks[j].permission && !isGranted(state, dpLinks[j].permission)) {
        delete dpLinks[j];
      }
    }
  }

  return <TrinitiAppNav navConfig={navConfig} userName={userName} />;
};

Nav.propTypes = {
  store: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Nav;
