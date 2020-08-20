import React from 'react';
import chroma from 'chroma-js';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import labelColors from 'config/labels'; // eslint-disable-line import/no-unresolved
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

const getColor = (label) => labelColors[label] || '#c0c0c0';

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

  componentDidUpdate({ node }) {
    if (!node) {
      return;
    }
    const { touched } = this.state;
    if (touched) {
      return;
    }
    // eslint-disable-next-line react/no-did-update-set-state
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
    this.setState({
      selected: (selected || []).map((val) => val.value),
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

    /* eslint-disable no-nested-ternary */
    const colourStyles = {
      control: (styles) => ({ ...styles, backgroundColor: 'white', height: 'unset', minHeight: '40px' }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma(getColor(data.label));
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
              : getColor(data.label),
          cursor: isDisabled ? 'not-allowed' : 'default',
          ':active': {
            ...styles[':active'],
            backgroundColor: !isDisabled && (isSelected ? getColor(data.label) : color.alpha(0.3).css()),
          },
        };
      },
      multiValue: (styles, { data }) => {
        const color = chroma(getColor(data.label));
        return {
          ...styles,
          backgroundColor: color.alpha(0.1).css(),
        };
      },
      multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: getColor(data.label),
      }),
      multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: getColor(data.label),
        ':hover': {
          backgroundColor: getColor(data.label),
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
                autoload={false}
                cache={false}
                creatable
                disabled={disabled}
                isEditMode
                label="Labels"
                multi
                onChange={this.handleChange}
                picklistId={`${node.schema().getCurie().getMessage()}-labels`}
                value={values}
                styles={colourStyles}
              />
            </Col>
          </Row>
          {touched && this.isNodeDiff() && (
          <Row>
            <Col>
              <Button
                className="ml-2 mb-0 mr-0"
                color="danger"
                onClick={this.handleApplyLabels}
                size="sm"
              >
                <Icon imgSrc="check-outline" className="mr-1" />
                Apply
              </Button>
              <Button
                className="ml-1 mb-0"
                color="secondary"
                onClick={this.handleCancel}
                size="sm"
              >
                Cancel
              </Button>
            </Col>
          </Row>
          )}
        </CardBody>
      </Card>
    );
  }
}

export default connect(null, createDelegateFactory(delegateFactory))(Labels);
