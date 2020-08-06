import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import Message from '@gdbots/pbj/Message';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import {
  Button,
  Card,
  CardBody,
  Col,
  Icon,
  Row,
} from '@triniti/admin-ui-plugin/components';
import PicklistPicker from '@triniti/cms/plugins/sys/components/picklist-picker';
import delegateFactory from './delegate';

class Labels extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    disabledReasonMessage: PropTypes.string,
    delegate: PropTypes.shape({
      handleApplyLabels: PropTypes.func.isRequired,
    }).isRequired,
    node: PropTypes.instanceOf(Message),
  };

  static defaultProps = {
    disabled: false,
    disabledReasonMessage: 'Labels disabled until saved.',
    node: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      touched: false,
      selected: [],
    };

    this.isNodeDiff = this.isNodeDiff.bind(this);
    this.handleApplyLabels = this.handleApplyLabels.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  UNSAFE_componentWillReceiveProps({ node }) {
    const { touched } = this.state;
    if (touched) {
      return;
    }

    this.setState({
      selected: node.get('labels', []),
    });
  }

  handleApplyLabels() {
    const { delegate } = this.props;
    const { selected } = this.state;
    delegate.handleApplyLabels(selected);
  }

  handleChange(selected) {
    const selectedList = [];
    if (selected) {
      selected.forEach((val) => {
        selectedList.push(val.value);
      });
    }
    this.setState({
      selected: selectedList,
      touched: true,
    });
  }

  handleCancel() {
    const { node } = this.props;
    this.setState({
      selected: node.get('labels', []),
      touched: false,
    });
  }

  isNodeDiff() {
    const { node } = this.props;
    const { selected } = this.state;
    return !isEqual(node.get('labels', []).sort(), selected.sort());
  }

  render() {
    const {
      disabled,
      disabledReasonMessage,
      node,
    } = this.props;

    const {
      selected,
      touched,
    } = this.state;

    if (!node) {
      return null;
    }

    const values = [];
    (touched ? selected : node.get('labels', [])).forEach((val) => {
      values.push({
        label: val,
        value: val,
      });
    });

    return (
      <Card style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
        <CardBody>
          <Row>
            <Col>
              {disabled && <p className="text-warning">{disabledReasonMessage}</p>}
              <PicklistPicker
                key={node.get('etag')}
                disabled={disabled}
                isEditMode
                label="Labels"
                name="labels"
                multi
                onChange={this.handleChange}
                picklistId="labels"
                value={values}
              />
            </Col>
          </Row>
          {this.isNodeDiff && (
          <Row>
            <Col>
              {this.isNodeDiff() && [
                <Button
                  key="apply"
                  className="ml-2 mb-0 mr-0"
                  color="danger"
                  onClick={this.handleApplyLabels}
                  size="sm"
                >
                  <Icon imgSrc="check-outline" className="mr-1" />
                  Apply
                </Button>,
                <Button
                  key="cancel"
                  className="ml-1 mb-0"
                  color="secondary"
                  onClick={this.handleCancel}
                  size="sm"
                >
                  Cancel
                </Button>,
              ]}
            </Col>
          </Row>
          )}
        </CardBody>
      </Card>
    );
  }
}

export default connect(null, createDelegateFactory(delegateFactory))(Labels);
