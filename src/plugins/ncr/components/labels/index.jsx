import React from 'react';
import chroma from 'chroma-js';
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
    if (!node) {
      return;
    }
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

    const colors = (label) => {
      if (label === 'more-cowbell') {
        return '#0052CC';
      }
      if (label === 'needs-review') {
        return '#FF8B00';
      }
      if (label === 'research-has-failed-us') {
        return '#FF5630';
      }
      return '#c0c0c0';
    };

    const colourStyles = {
      control: (styles) => ({ ...styles, backgroundColor: 'white' }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma(colors(data.label));
        return {
          ...styles,
          backgroundColor: isDisabled
            ? null
            : isSelected
            ? data.color
            : isFocused
            ? color.alpha(0.1).css()
            : null,
          color: isDisabled
            ? '#ccc'
            : isSelected
            ? chroma.contrast(color, 'white') > 2
              ? 'white'
              : 'black'
            : colors(data.label),
          cursor: isDisabled ? 'not-allowed' : 'default',
          ':active': {
            ...styles[':active'],
            backgroundColor: !isDisabled && (isSelected ? colors(data.label) : color.alpha(0.3).css()),
          },
        };
      },
      multiValue: (styles, { data }) => {
        const color = chroma(colors(data.label));
        return {
          ...styles,
          backgroundColor: color.alpha(0.1).css(),
        };
      },
      multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: colors(data.label),
      }),
      multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: colors(data.label),
        ':hover': {
          backgroundColor: colors(data.label),
          color: 'white',
        },
      }),
    };

    return (
      <Card style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
        <CardBody>
          <Row>
            <Col>
              {disabled && <p className="text-warning">{disabledReasonMessage}</p>}
              <PicklistPicker
                disabled={disabled}
                isEditMode
                label="Labels"
                multi
                name="labels"
                onChange={this.handleChange}
                picklistId="labels"
                defaultValue={values}
                styles={colourStyles}
                // autoload={false}
                // cache={false}
                // creatable
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
