import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Message from '@gdbots/pbj/Message';
import { STATUS_FULFILLED } from '@triniti/app/constants';
import { CreateModalButton, Screen, StatusMessage } from '@triniti/admin-ui-plugin/components';
import AppsList from '@triniti/cms/plugins/iam/components/apps-list';
import CreateAppModal from '@triniti/cms/plugins/iam/components/create-app-modal';

import schemas from './schemas';
import selector from './selector';

class ListAllAppsScreen extends React.PureComponent {
  static propTypes = {
    alerts: PropTypes.arrayOf(PropTypes.any),
    apps: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
    dispatch: PropTypes.func.isRequired,
    getAllAppsRequestState: PropTypes.shape({
      request: PropTypes.object,
      response: PropTypes.object,
      status: PropTypes.string,
      exception: PropTypes.object,
    }).isRequired,
  };

  static defaultProps = {
    alerts: [],
    apps: [],
  };

  constructor(props) {
    super(props);

    const { dispatch, getAllAppsRequestState } = this.props;

    if (getAllAppsRequestState.status !== STATUS_FULFILLED) {
      dispatch(schemas.getAllApps.createMessage());
    }
  }

  render() {
    const {
      alerts,
      apps,
      dispatch,
      getAllAppsRequestState: {
        response,
        status,
        exception,
      },
    } = this.props;

    if (!response || status !== STATUS_FULFILLED) {
      return <StatusMessage status={status} exception={exception} />;
    }

    return (
      <Screen
        title="Apps"
        alerts={alerts}
        breadcrumbs={[
          { text: 'Apps' },
        ]}
        dispatch={dispatch}
        maxWidth="768px"
        primaryActions={(
          <CreateModalButton
            className="btn-action-create"
            modal={CreateAppModal}
            text="Create App"
          />
        )}
        body={
          <AppsList key="list" apps={apps} />
        }
      />
    );
  }
}

export default connect(selector)(ListAllAppsScreen);
