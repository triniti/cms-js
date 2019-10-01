import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import createDelegateFactory from '@triniti/app/createDelegateFactory';
import DraggableRolesList from '@triniti/cms/plugins/iam/components/draggable-roles-list';
import Exception from '@gdbots/common/Exception';
import Message from '@gdbots/pbj/Message';
import Schema from '@gdbots/pbj/Schema';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  StatusMessage,
} from '@triniti/admin-ui-plugin/components';
import { STATUS_FULFILLED } from '@triniti/app/constants';

import delegateFactory from './delegate';
import selector from './selector';

class RolesPicker extends React.Component {
  static propTypes = {
    listAllRolesRequestState: PropTypes.shape({
      request: PropTypes.instanceOf(Message),
      response: PropTypes.instanceOf(Message),
      status: PropTypes.string,
      exception: PropTypes.instanceOf(Exception),
    }),
    node: PropTypes.instanceOf(Message),
    delegate: PropTypes.shape({
      handleInitialize: PropTypes.func,
      grantRolesToNode: PropTypes.func,
      revokeRolesFromNode: PropTypes.func,
    }).isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    schemas: PropTypes.shape({ // this is being used in delegate.js
      grantRolesToNode: PropTypes.instanceOf(Schema),
      revokeRolesFromNode: PropTypes.instanceOf(Schema),
    }).isRequired,
  };

  static defaultProps = {
    listAllRolesRequestState: null,
    node: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      rolesToBeGranted: [],
      rolesToBeRevoked: [],
    };

    this.grantRolesToNode = this.grantRolesToNode.bind(this);
    this.handleNodeRoleAdded = this.handleNodeRoleAdded.bind(this);
    this.handleNodeRoleRemoved = this.handleNodeRoleRemoved.bind(this);
    this.revokeRolesFromNode = this.revokeRolesFromNode.bind(this);
  }

  componentDidMount() {
    const { delegate } = this.props;
    delegate.handleInitialize();
  }

  handleNodeRoleAdded(evt) {
    const { node } = this.props;
    const roleNodeRef = evt.item.dataset.noderef;

    if (!node.isInSet('roles', roleNodeRef)) {
      this.setState(({ rolesToBeGranted }) => ({
        rolesToBeGranted: [
          ...rolesToBeGranted,
          roleNodeRef,
        ],
      }));
    }

    const { rolesToBeRevoked } = this.state;
    const index = rolesToBeRevoked.indexOf(roleNodeRef);
    if (index > -1) {
      this.setState({
        rolesToBeRevoked: [
          ...rolesToBeRevoked.slice(0, index),
          ...rolesToBeRevoked.slice(index + 1),
        ],
      });
    }
  }

  handleNodeRoleRemoved(evt) {
    const { node } = this.props;
    const roleNodeRef = evt.item.dataset.noderef;

    if (node.isInSet('roles', roleNodeRef)) {
      this.setState(({ rolesToBeRevoked }) => ({
        rolesToBeRevoked: [
          ...rolesToBeRevoked,
          roleNodeRef,
        ],
      }));
    }

    const { rolesToBeGranted } = this.state;
    const index = rolesToBeGranted.indexOf(roleNodeRef);
    if (index > -1) {
      this.setState({
        rolesToBeGranted: [
          ...rolesToBeGranted.slice(0, index),
          ...rolesToBeGranted.slice(index + 1),
        ],
      });
    }
  }

  async grantRolesToNode() {
    const { node, delegate } = this.props;
    const { rolesToBeGranted } = this.state;
    try {
      await delegate.grantRolesToNode(node, rolesToBeGranted);
      delegate.sendAlert('Role(s) granted');
      this.setState({ rolesToBeGranted: [] });
    } catch (e) {
      delegate.sendAlert(`Grant roles failed:: ${e.message() || e}`, 'danger');
    }
  }

  async revokeRolesFromNode() {
    const { node, delegate } = this.props;
    const { rolesToBeRevoked } = this.state;
    try {
      await delegate.revokeRolesFromNode(node, rolesToBeRevoked);
      delegate.sendAlert('Role(s) revoked');
      this.setState({ rolesToBeRevoked: [] });
    } catch (e) {
      delegate.sendAlert(`Revoke roles failed:: ${e.message() || e}`, 'danger');
    }
  }

  render() {
    const { listAllRolesRequestState, node, delegate } = this.props;
    const { response, status, exception } = listAllRolesRequestState;

    if (!response || status !== STATUS_FULFILLED) {
      return <StatusMessage status={status} exception={exception} />;
    }

    const rolesToList = delegate.findRolesToDisplay(response, node);
    const { rolesToBeGranted, rolesToBeRevoked } = this.state;

    return (
      <Card>
        <CardHeader>Details</CardHeader>
        <CardBody indent>
          <Row>
            <Col xs="6" lg="6" className="pb-2">
              <Button
                className="d-block mx-auto"
                color="info"
                disabled={isEmpty(rolesToBeGranted)}
                onClick={this.grantRolesToNode}
              >
                Grant
              </Button>
            </Col>
            <Col xs="6" lg="6" className="pb-2">
              <Button
                className="d-block mx-auto"
                color="warning"
                disabled={isEmpty(rolesToBeRevoked)}
                onClick={this.revokeRolesFromNode}
              >
                Revoke
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs="6" lg="6" className="pb-2">
              <DraggableRolesList
                onAdd={this.handleNodeRoleAdded}
                roles={node.get('roles') || []}
                title="Current Roles"
              />
            </Col>

            <Col xs="6" lg="6" className="pb-2">
              <DraggableRolesList
                onAdd={this.handleNodeRoleRemoved}
                roles={rolesToList}
                title="All Roles"
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(RolesPicker);
