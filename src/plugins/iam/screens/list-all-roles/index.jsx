import { connect } from 'react-redux';
import { CreateModalButton, Screen, Spinner } from '@triniti/admin-ui-plugin/components';
import CreateRoleModal from '@triniti/cms/plugins/iam/components/create-role-modal';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PropTypes from 'prop-types';
import React from 'react';
import RolesList from '@triniti/cms/plugins/iam/components/roles-list';
import schemas from './schemas';
import selector from './selector';

class ListAllRolesScreen extends React.Component {
  static propTypes = {
    alerts: PropTypes.arrayOf(PropTypes.any),
    dispatch: PropTypes.func.isRequired,
    isFulfilled: PropTypes.bool,
    roles: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
  };

  static defaultProps = {
    alerts: [],
    isFulfilled: false,
    roles: [],
  };

  constructor(props) {
    super(props);
    const { dispatch, isFulfilled } = this.props;

    if (!isFulfilled) {
      dispatch(schemas.listAllRoles.createMessage());
    }
  }

  render() {
    const {
      alerts,
      dispatch,
      isFulfilled,
      roles,
    } = this.props;

    if (!isFulfilled) {
      return <Spinner className="p-4" />;
    }

    return (
      <Screen
        title="Roles"
        alerts={alerts}
        breadcrumbs={[
          { text: 'Roles' },
        ]}
        dispatch={dispatch}
        maxWidth="768px"
        primaryActions={(
          <CreateModalButton
            className="btn-action-create"
            modal={CreateRoleModal}
            text="Create Role"
          />
        )}
        body={<RolesList roles={roles} />}
      />
    );
  }
}

export default connect(selector)(ListAllRolesScreen);
