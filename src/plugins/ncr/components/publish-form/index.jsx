import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import Message from '@gdbots/pbj/Message';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import {
  Button,
  Card,
  CardBody,
  Col,
  DatePicker,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  UncontrolledButtonDropdown,
} from '@triniti/admin-ui-plugin/components';
import selector from './selector';
import delegateFactory from './delegate';

const operationType = {
  NO_OPERATION: 'Publish Options',
  PUBLISH_SCHEDULE: 'Schedule',
  PUBLISH_NOW: 'Publish Now',
  UNPUBLISH: 'Unpublish',
  MARK_AS_DRAFT: 'Mark As Draft',
  MARK_AS_PENDING: 'Mark As Pending',
};

class PublishForm extends React.PureComponent {
  static propTypes = {
    canMarkAsDraft: PropTypes.bool,
    canMarkAsPending: PropTypes.bool,
    canPublish: PropTypes.bool,
    canUnpublish: PropTypes.bool,
    disabled: PropTypes.bool,
    disabledReasonMessage: PropTypes.string,
    delegate: PropTypes.shape({
      handlePublishNow: PropTypes.func.isRequired,
      handleMarkNodeAsDraft: PropTypes.func.isRequired,
      handleMarkNodeAsPending: PropTypes.func.isRequired,
      handlePublishSchedule: PropTypes.func.isRequired,
      handleUnpublish: PropTypes.func.isRequired,
      handleValidate: PropTypes.func,
    }).isRequired,
    node: PropTypes.instanceOf(Message),
    onOperationChange: PropTypes.func,
  };

  static defaultProps = {
    canMarkAsDraft: false,
    canMarkAsPending: false,
    canPublish: false,
    canUnpublish: false,
    disabled: false,
    disabledReasonMessage: 'Publish options disabled until saved.',
    onOperationChange: undefined,
    node: null,
  };

  constructor(props) {
    super(props);
    const { node } = props;
    this.state = {
      operation: operationType.NO_OPERATION,
      publishedAt: node.get('published_at', new Date()),
    };

    this.applyChangeStatus = this.applyChangeStatus.bind(this);
    this.cancelChangeStatus = this.cancelChangeStatus.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleOptionSelect = this.handleOptionSelect.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
  }

  applyChangeStatus() {
    const { delegate } = this.props;
    const { publishedAt, operation } = this.state;

    switch (operation) {
      case operationType.MARK_AS_DRAFT:
        delegate.handleMarkNodeAsDraft();
        break;
      case operationType.MARK_AS_PENDING:
        delegate.handleMarkNodeAsPending();
        break;
      case operationType.PUBLISH_NOW:
        delegate.handlePublishNow();
        break;
      case operationType.PUBLISH_SCHEDULE:
        delegate.handlePublishSchedule(publishedAt);
        break;
      case operationType.UNPUBLISH:
        delegate.handleUnpublish();
        break;
      default:
        break;
    }

    this.cancelChangeStatus();
  }

  cancelChangeStatus() {
    const { onOperationChange } = this.props;
    onOperationChange(operationType.NO_OPERATION);
    this.setState({ operation: operationType.NO_OPERATION });
  }

  handleChangeDate(publishedAt) {
    this.setState({ publishedAt });
  }

  handleOptionSelect(e) {
    const { onOperationChange } = this.props;
    const operation = e.target.innerText;

    if (typeof onOperationChange === 'function') {
      onOperationChange(operation);
    }
    this.setState({ operation });
  }

  /**
   * @param {SyntheticEvent} e
   */
  handleTimeChange({ target: { value: time } }) {
    const { publishedAt } = this.state;
    this.setState({
      publishedAt: moment(publishedAt)
        .set('hours', time ? time.split(':')[0] : 0)
        .set('minutes', time ? time.split(':')[1] : 0)
        .toDate(),
    });
  }

  render() {
    const {
      canMarkAsDraft,
      canMarkAsPending,
      canPublish,
      canUnpublish,
      disabled,
      disabledReasonMessage,
      node,
    } = this.props;

    if (!node) {
      return null;
    }

    const { operation, publishedAt } = this.state;
    const iconSrc = (operation === operationType.PUBLISH_SCHEDULE) ? 'calendar' : 'check-outline';

    return (
      <Card>
        <CardBody>
          <Row>
            <Col>
              {disabled && <p className="text-warning">{disabledReasonMessage}</p>}
              <UncontrolledButtonDropdown>
                <DropdownToggle caret disabled={disabled}>{operation}</DropdownToggle>
                <DropdownMenu className="p-0">
                  {canPublish
                  && (
                  <DropdownItem
                    className="status-published"
                    disabled={operation === operationType.PUBLISH_NOW}
                    onClick={this.handleOptionSelect}
                  >
                    {operationType.PUBLISH_NOW}
                  </DropdownItem>
                  )}
                  {canPublish
                  && (
                  <DropdownItem
                    className="status-scheduled"
                    disabled={operation === operationType.PUBLISH_SCHEDULE}
                    onClick={this.handleOptionSelect}
                  >
                    {operationType.PUBLISH_SCHEDULE}
                  </DropdownItem>
                  )}
                  {canUnpublish
                  && (
                  <DropdownItem
                    className="status-draft"
                    disabled={operation === operationType.UNPUBLISH}
                    onClick={this.handleOptionSelect}
                  >
                    {operationType.UNPUBLISH}
                  </DropdownItem>
                  )}
                  {canMarkAsDraft
                  && (
                  <DropdownItem
                    className="status-draft"
                    disabled={operation === operationType.MARK_AS_DRAFT}
                    onClick={this.handleOptionSelect}
                  >
                    {operationType.MARK_AS_DRAFT}
                  </DropdownItem>
                  )}
                  {canMarkAsPending
                  && (
                  <DropdownItem
                    className="status-pending"
                    disabled={operation === operationType.MARK_AS_PENDING}
                    onClick={this.handleOptionSelect}
                  >
                    {operationType.MARK_AS_PENDING}
                  </DropdownItem>
                  )}
                </DropdownMenu>
              </UncontrolledButtonDropdown>
              {operation !== operationType.NO_OPERATION && !disabled
              && [
                <Button
                  key="apply"
                  className="ml-2 mb-0 mr-0"
                  color="danger"
                  onClick={this.applyChangeStatus}
                  size="sm"
                >
                  <Icon imgSrc={iconSrc} className="mr-1" />
                  Apply
                </Button>,
                <Button
                  key="cancel"
                  className="ml-1 mb-0"
                  color="secondary"
                  onClick={this.cancelChangeStatus}
                  size="sm"
                >
                  Cancel
                </Button>,
              ]}
            </Col>
          </Row>
          {operation === operationType.PUBLISH_SCHEDULE && !disabled
          && (
          <Row>
            <Col style={{ maxWidth: '274px' }}>
              <FormGroup className="mb-3 mt-1 shadow-none">
                <DatePicker
                  onChange={this.handleChangeDate}
                  selected={publishedAt}
                  shouldCloseOnSelect={false}
                  inline
                />
                <InputGroup>
                  <InputGroupAddon addonType="prepend" className="text-dark">
                    <InputGroupText><Icon imgSrc="clock-outline" /></InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="time"
                    onChange={this.handleTimeChange}
                    value={moment(publishedAt).format('HH:mm')}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
          )}
        </CardBody>
      </Card>
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(PublishForm);
