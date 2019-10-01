import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { STATUS_FULFILLED } from '@triniti/app/constants';
import { CreateModalButton, Screen, StatusMessage } from '@triniti/admin-ui-plugin/components';
import CreatePicklistModal from '@triniti/cms/plugins/sys/components/create-picklist-modal';
import PicklistsList from '../../components/picklists-list';

import schemas from './schemas';
import selector from './selector';

class ListAllPicklistsScreen extends React.PureComponent {
  static propTypes = {
    alerts: PropTypes.arrayOf(PropTypes.any),
    picklistRefs: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
    dispatch: PropTypes.func.isRequired,
    listAllPicklistsRequestState: PropTypes.shape({
      request: PropTypes.object,
      response: PropTypes.object,
      status: PropTypes.string,
      exception: PropTypes.object,
    }).isRequired,
  };

  static defaultProps = {
    alerts: [],
    picklistRefs: [],
  };

  constructor(props) {
    super(props);

    const { dispatch, listAllPicklistsRequestState } = this.props;

    if (listAllPicklistsRequestState.status !== STATUS_FULFILLED) {
      dispatch(schemas.listAllPicklists.createMessage());
    }
  }

  render() {
    const {
      alerts,
      picklistRefs,
      dispatch,
      listAllPicklistsRequestState: {
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
        title="Picklists"
        alerts={alerts}
        breadcrumbs={[
          { text: 'Picklists' },
        ]}
        dispatch={dispatch}
        maxWidth="768px"
        primaryActions={(
          <CreateModalButton
            className="btn-action-create"
            modal={CreatePicklistModal}
            text="Create Picklist"
          />
        )}
        body={<PicklistsList picklistRefs={picklistRefs} />}
      />
    );
  }
}

export default connect(selector)(ListAllPicklistsScreen);
