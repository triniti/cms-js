import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { STATUS_FULFILLED } from '@triniti/app/constants';
import { CreateModalButton, Screen, StatusMessage } from '@triniti/admin-ui-plugin/components';

import CreateFlagsetModal from '../../components/create-flagset-modal';
import FlagsetsList from '../../components/flagsets-list';
import schemas from './schemas';
import selector from './selector';

class ListAllFlagsetsScreen extends React.PureComponent {
  static propTypes = {
    alerts: PropTypes.arrayOf(PropTypes.any),
    flagsetRefs: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
    dispatch: PropTypes.func.isRequired,
    listAllFlagsetsRequestState: PropTypes.shape({
      request: PropTypes.object,
      response: PropTypes.object,
      status: PropTypes.string,
      exception: PropTypes.object,
    }).isRequired,
  };

  static defaultProps = {
    alerts: [],
    flagsetRefs: [],
  };

  constructor(props) {
    super(props);

    const { dispatch, listAllFlagsetsRequestState } = this.props;

    if (listAllFlagsetsRequestState.status !== STATUS_FULFILLED) {
      dispatch(schemas.listAllFlagsets.createMessage());
    }
  }

  render() {
    const {
      alerts,
      flagsetRefs,
      dispatch,
      listAllFlagsetsRequestState: {
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
        title="Flagsets"
        alerts={alerts}
        breadcrumbs={[
          { text: 'Flagsets' },
        ]}
        dispatch={dispatch}
        maxWidth="768px"
        primaryActions={(
          <CreateModalButton
            className="btn-action-create"
            modal={CreateFlagsetModal}
            text="Create Flagset"
          />
        )}
        body={<FlagsetsList flagsetRefs={flagsetRefs} />}
      />
    );
  }
}

export default connect(selector)(ListAllFlagsetsScreen);
