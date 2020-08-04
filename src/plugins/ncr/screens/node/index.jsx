import ActiveEditNotificationModal from '@triniti/cms/plugins/raven/components/active-edit-notification-modal';
import Chat from '@triniti/cms/plugins/raven/components/chat';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import get from 'lodash/get';
import getUserConfirmation from '@triniti/admin-ui-plugin/utils/getUserConfirmation';
import isEmpty from 'lodash/isEmpty';
import Labels from '@triniti/cms/plugins/ncr/components/labels';
import NodeLock from '@triniti/cms/plugins/ncr/components/node-lock';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import NodeStatus from '@triniti/cms/plugins/ncr/components/node-status';
import PreviewButtons from '@triniti/cms/plugins/ncr/components/preview-buttons';
import PropTypes from 'prop-types';
import PublishForm from '@triniti/cms/plugins/ncr/components/publish-form';
import React, { Fragment } from 'react';
import {
  ActionButton,
  Alert,
  DropdownMenu,
  DropdownToggle,
  Icon,
  InputGroup,
  InputGroupButtonDropdown,
  Screen,
  StatusMessage,
  UncontrolledDropdown,
} from '@triniti/admin-ui-plugin/components';

import AbstractDelegate from './AbstractDelegate';
import './styles.scss';

export default class AbstractNodeScreen extends React.Component {
  static propTypes = {
    alerts: PropTypes.arrayOf(PropTypes.object),
    delegate: PropTypes.instanceOf(AbstractDelegate).isRequired,
    dispatch: PropTypes.func.isRequired,
    formErrorAlerts: PropTypes.arrayOf(PropTypes.object),
    getNodeRequestState: PropTypes.shape({
      exception: PropTypes.object,
      request: PropTypes.object,
      response: PropTypes.object,
      status: PropTypes.string,
    }).isRequired,
    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    isDeleteDisabled: PropTypes.bool,
    isEditMode: PropTypes.bool,
    isLocked: PropTypes.bool,
    isPristine: PropTypes.bool,
    isSaveDisabled: PropTypes.bool,
    isSaveAndPublishDisabled: PropTypes.bool,
    isToggleDisabled: PropTypes.bool,
    location: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    match: PropTypes.objectOf(PropTypes.any).isRequired,
    modePath: PropTypes.string,
    nodeRef: PropTypes.instanceOf(NodeRef).isRequired,
    tab: PropTypes.string,
  };

  static defaultProps = {
    alerts: [],
    formErrorAlerts: [],
    isDeleteDisabled: false,
    isEditMode: false,
    isLocked: false,
    isPristine: true,
    isSaveDisabled: false,
    isSaveAndPublishDisabled: false,
    isToggleDisabled: false,
    modePath: '',
    tab: '',
  };

  constructor(props) {
    super(props);

    const { delegate } = props;
    delegate.bindToComponent(this);
    this.state = {
      isSaveDropDownOpen: false,
      publishOperation: '',
    };

    this.handleCancel = this.handleCancel.bind(this);
    this.handlePublishFormChange = this.handlePublishFormChange.bind(this);
    this.handleToggleSaveDropdown = this.handleToggleSaveDropdown.bind(this);
  }

  componentDidMount() {
    const { delegate, history } = this.props;
    // needs to have this getter because if you create an article from
    // the article screen, this will not fire again (because not remounting)
    // and the location used in history.block will be stale
    // eslint-disable-next-line react/destructuring-assignment
    const getLocation = () => this.props.location;
    delegate.componentDidMount();
    // fixme:: figure out why this does not work in delegate
    this.unblock = history.block((nextLocation) => {
      const currentUrl = getLocation().pathname;
      const transitionTo = nextLocation.pathname;

      if (!transitionTo.split('/')[3] || transitionTo.split('/')[3] !== currentUrl.split('/')[3]) {
        if (!this.props.isPristine) { // eslint-disable-line react/destructuring-assignment
          return 'You have unsaved changes!';
        }

        if (this.state.publishOperation && this.state.publishOperation !== 'Publish Options') { // eslint-disable-line react/destructuring-assignment
          return 'You have unfinished publish action!';
        }
      }

      return true;
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    nextProps.delegate.bindToComponent(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { delegate } = this.props;
    delegate.componentDidUpdate(prevProps, prevState, snapshot);
  }

  componentWillUnmount() {
    this.unblock();
    const { delegate } = this.props;
    delegate.componentWillUnmount();
  }

  getBreadcrumbs() {
    const { delegate } = this.props;
    const node = delegate.getNode();
    const baseUrl = delegate.getBaseUrl();

    return [
      {
        to: baseUrl,
        text: baseUrl.split('/')[2],
      },
      { text: (node && node.get('title', 'Untitled')) || 'Loading...' },
    ];
  }

  getBadge() {
    return null;
  }

  getForm() {
    return null;
  }

  getFormRenderProps() {
    return {};
  }

  getTabs() {
    return {};
  }

  // fixme: this should be a delegate method but isnt because of the unblock delegate issue
  handleCancel() {
    const { history, isPristine, match } = this.props;
    if (isPristine) {
      history.push(match.url.match(/\/.+?\/.+?\//)[0]);
    } else {
      getUserConfirmation('You have unsaved changes!', (didConfirm) => {
        if (didConfirm) {
          this.unblock();
          history.push(match.url.match(/\/.+?\/.+?\//)[0]);
        }
      });
    }
  }

  handlePublishFormChange(selectedOperation) {
    this.setState({ publishOperation: selectedOperation });
  }

  handleToggleSaveDropdown() {
    this.setState(({ isSaveDropDownOpen }) => ({ isSaveDropDownOpen: !isSaveDropDownOpen }));
  }

  renderForm() {
    const { delegate, isEditMode, tab } = this.props;
    const node = delegate.getNode();
    const FormComponent = this.getForm();

    return FormComponent && node && (
      <Fragment key="form">
        {!isEditMode && (
          <Alert color="warning" className="mb-0">
            <span><Icon imgSrc="warning-outline" /> {'You\'re in'} <strong>View Mode</strong></span>
          </Alert>
        )}
        <FormComponent
          form={delegate.getFormName()}
          initialValues={delegate.getInitialValues()}
          isEditMode={isEditMode}
          node={node}
          onSubmit={delegate.handleSubmit}
          tab={tab}
          validate={delegate.handleValidate}
          warn={delegate.handleWarn}
          {...this.getFormRenderProps()}
        />
      </Fragment>
    );
  }

  renderBody() {
    const { delegate, getNodeRequestState } = this.props;

    if (!delegate.getNode()) {
      return (
        <StatusMessage
          exception={getNodeRequestState.exception}
          key="status"
          status={getNodeRequestState.status}
        />
      );
    }

    return [this.renderForm()];
  }

  renderAdditionalPrimaryActions() {
    return null;
  }

  renderPrimaryActions() {
    const {
      delegate,
      isDeleteDisabled,
      isEditMode,
      isSaveDisabled,
      isSaveAndPublishDisabled,
      isToggleDisabled,
      nodeRef,
    } = this.props;
    const { isSaveDropDownOpen } = this.state;

    return (
      <Fragment key="primary-actions">
        {delegate.isCollaborationEnabled() && (
          <>
            {isEditMode && <ActiveEditNotificationModal key="active-edit-notification" nodeRef={nodeRef} />}
            <Collaborators key={`collaborators${isEditMode}`} nodeRef={nodeRef} />
          </>
        )}
        {this.renderAdditionalPrimaryActions()}
        <ActionButton
          key="cancel"
          onClick={this.handleCancel}
          text="Cancel"
        />
        <InputGroup className="pr-2">
          <InputGroupButtonDropdown addonType="prepend" isOpen={isSaveDropDownOpen} toggle={this.handleToggleSaveDropdown}>
            <ActionButton
              disabled={isSaveDisabled}
              icon="save"
              onClick={delegate.handleSave}
              text="Save"
            />
            <DropdownToggle
              className="dropdown-toggle-save-options"
              disabled={isSaveDisabled}
              outline
              split
            />
            <DropdownMenu right className="dropdown-menu-save-options px-2">
              <ActionButton
                className="mb-2"
                disabled={isSaveAndPublishDisabled}
                icon="save"
                onClick={delegate.handleSaveAndPublish}
                text="Save &amp; Publish"
              />
              <ActionButton
                icon="save"
                onClick={delegate.handleSaveAndClose}
                text="Save &amp; Close"
              />
            </DropdownMenu>
          </InputGroupButtonDropdown>
        </InputGroup>
        <ActionButton
          disabled={isToggleDisabled}
          key="toggle"
          onClick={delegate.handleToggle}
          text={isEditMode ? 'Enter View Mode' : 'Enter Edit Mode'}
        />
        <UncontrolledDropdown key="delete">
          <DropdownToggle className="px-1 mr-0">
            <Icon imgSrc="more-vertical" alt="more" size="md" />
          </DropdownToggle>
          <DropdownMenu right className="px-2 dropdown-menu-arrow-right">
            <ActionButton
              disabled={isDeleteDisabled}
              icon="delete"
              onClick={delegate.handleDelete}
              text="Delete"
            />
            {this.renderNodeLock()}
          </DropdownMenu>
        </UncontrolledDropdown>
      </Fragment>
    );
  }

  renderBadge() {
    return this.getBadge();
  }

  renderChat() {
    const { delegate } = this.props;
    if (!delegate.isCollaborationEnabled()) {
      return null;
    }

    const { nodeRef } = this.props;
    return <Chat key="chat" nodeRef={nodeRef} />;
  }

  renderLabels() {
    const { delegate, match, isSaveDisabled } = this.props;
    const nodeSchema = delegate.config.schemas.node || delegate.config.schemas.nodes
      .find((schema) => schema.getCurie().getMessage().includes(match.params.type));

    if (!nodeSchema.hasMixin('gdbots:common:mixin:labelable')) {
      return null;
    }

    return (
      <Labels
        disabled={!isSaveDisabled}
        key="labels"
        node={delegate.getNode()}
        schemas={delegate.getSchemas()}
      />
    );
  }

  renderNodeLock() {
    const {
      delegate,
      match,
    } = this.props;

    const nodeSchema = delegate.getSchemas().node
      || delegate.getSchemas().nodes
        .find((schema) => schema.getCurie().getMessage().includes(match.params.type));

    if (!nodeSchema.hasMixin('gdbots:ncr:mixin:lockable')) {
      return null;
    }

    return (
      <NodeLock
        key="lock"
        node={delegate.getNode()}
        schemas={delegate.getSchemas()}
      />
    );
  }

  renderNodeStatus() {
    const { delegate } = this.props;
    const node = delegate.getNode();
    return node ? <NodeStatus key="NodeStatus" node={node} /> : null;
  }

  renderPreviewButtons() {
    const { delegate } = this.props;
    const node = delegate.getNode();
    return <PreviewButtons key="PreviewButtons" node={node} />;
  }

  renderPublishForm() {
    const { delegate, match, isSaveDisabled } = this.props;
    const nodeSchema = delegate.config.schemas.node || delegate.config.schemas.nodes
      .find((schema) => schema.getCurie().getMessage().includes(match.params.type));

    if (!nodeSchema.hasMixin('gdbots:ncr:mixin:publishable')) {
      return null;
    }

    const node = delegate.getNode();

    return !node ? null : (
      <PublishForm
        disabled={!isSaveDisabled}
        key="publishForm"
        formName={delegate.getFormName()}
        node={delegate.getNode()}
        onOperationChange={this.handlePublishFormChange}
        schemas={delegate.getSchemas()}
      />
    );
  }

  renderSidebar() {
    return [
      this.renderPreviewButtons(),
      this.renderNodeStatus(),
      this.renderPublishForm(),
      this.renderLabels(),
      this.renderChat(),
    ];
  }

  renderTabs() {
    const { delegate, modePath, nodeRef, match: { params: { type } } } = this.props;
    const routeBaseUrl = delegate.getBaseUrl();
    const tabs = [
      ...this.getTabs(),
      'history',
      'raw',
    ];

    return tabs
      .filter((tab) => !isEmpty(tab))
      .map((tab) => ({
        to: `${routeBaseUrl}/${type ? `${type}/` : ''}${nodeRef.getId()}/${tab.tab || tab}${modePath}`,
        text: (tab.tab ? get(tab, 'text', tab.tab) : tab).replace(/-/g, ' '),
      }));
  }

  render() {
    const { alerts, delegate, dispatch } = this.props;
    const node = delegate.getNode();
    return (
      <Screen
        badge={this.renderBadge()}
        dispatch={dispatch}
        alerts={alerts}
        breadcrumbs={this.getBreadcrumbs()}
        primaryActions={this.renderPrimaryActions()}
        tabs={this.renderTabs()}
        sidebar={this.renderSidebar()}
        body={this.renderBody()}
        title={(node && node.get('title')) || 'Loading...'}
      />
    );
  }
}
