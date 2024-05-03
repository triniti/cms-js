import React from 'react';
import { Badge, DropdownMenu, DropdownToggle, Form, TabContent, TabPane, UncontrolledDropdown } from 'reactstrap';
import withNodeScreen, { useDelegate } from 'plugins/ncr/components/with-node-screen';
import CodeTab from 'plugins/common/components/code-tab';
import HistoryTab from 'plugins/ncr/components/history-tab';
import RawTab from 'plugins/ncr/components/raw-tab';
import NodeStatusCard from 'plugins/ncr/components/node-status-card';
import { ActionButton, FormErrors, Icon, Screen, ViewModeWarning } from '@triniti/cms/components/index.js';
import WidgetHasSearchRequestFields from 'plugins/curator/components/widget-screen/widget-has-search-request-fields';
import DetailsTab from 'plugins/curator/components/widget-screen/DetailsTab';
import ActiveEditsNotificationModal from 'plugins/raven/components/active-edits-notification-modal';
import Collaborators from 'plugins/raven/components/collaborators';

function WidgetScreen(props) {
  const {
    formState,
    handleSubmit,
    editMode,
    node,
    isRefreshing,
    qname,
    nodeRef,
    policy,
    tab,
    urls
  } = props;

  const delegate = useDelegate(props);

  const { dirty, errors, hasSubmitErrors, hasValidationErrors, submitting, valid } = formState;
  const submitDisabled = submitting || isRefreshing || !dirty || (!valid && !hasSubmitErrors);

  const canDelete = policy.isGranted(`${qname}:delete`);
  const canUpdate = policy.isGranted(`${qname}:update`);

  const TabItems = [
    { text: 'Details', to: urls.tab('details') },
    { text: 'Code', to: urls.tab('code') },
    { text: 'History', to: urls.tab('history') },
    { text: 'Raw', to: urls.tab('raw') },
  ]

  const TabItemsWithDataSource = [
    { text: 'Details', to: urls.tab('details') },
    { text: 'Data Source', to: urls.tab('data-source') },
    { text: 'Code', to: urls.tab('code') },
    { text: 'History', to: urls.tab('history') },
    { text: 'Raw', to: urls.tab('raw') },
  ]

  return (
    <Screen
      title={node.get('title')}
      header={node.get('title')}
      breadcrumbs={[
        { text: 'Widgets', to: '/curator/widgets' },
        { text: node.get('title') },
      ]}
      activeTab={tab}
      tabs={[...(node.schema().hasMixin('triniti:curator:mixin:widget-has-search-request') ? TabItemsWithDataSource : TabItems)]}
      primaryActions={
        <>
          <Collaborators nodeRef={nodeRef} />
          {isRefreshing && <Badge color="light" pill><span className="badge-animated">Refreshing Node</span></Badge>}
          {!isRefreshing && dirty && hasValidationErrors && <Badge color="danger" pill>Form Has Errors</Badge>}
          <ActionButton
            text="Close"
            onClick={delegate.handleClose}
            disabled={submitting || isRefreshing}
            color="light"
            outline
          />
          {canUpdate && (
            <>
              <ActionButton
                text="Save"
                onClick={delegate.handleSave}
                disabled={submitDisabled}
                icon="save"
                color="primary"
              />
              <ActionButton
                text={editMode ? 'Enter View Mode' : 'Enter Edit Mode'}
                onClick={delegate.handleSwitchMode}
                disabled={submitting || isRefreshing}
                color="light"
                outline
              />
            </>
          )}
          {canDelete && (
            <UncontrolledDropdown>
              <DropdownToggle className="px-1 me-0 mb-0" color="light" outline>
                <Icon imgSrc="more-vertical" alt="More Actions" size="md" />
              </DropdownToggle>
              <DropdownMenu end className="px-2 dropdown-menu-arrow-right">
                <ActionButton
                  text="Delete"
                  onClick={delegate.handleDelete}
                  icon="delete"
                  color="danger"
                  outline
                />
              </DropdownMenu>
            </UncontrolledDropdown>
          )}
        </>
      }
      sidebar={
        <>
          <NodeStatusCard nodeRef={nodeRef} onStatusUpdated={delegate.handleStatusUpdated} />
        </>
      }
    >
      {!editMode && <ViewModeWarning />}
      {editMode && <ActiveEditsNotificationModal nodeRef={nodeRef} />}
      {dirty && hasValidationErrors && <FormErrors errors={errors} />}
      <Form onSubmit={handleSubmit} autoComplete="off">
        <TabContent activeTab={tab}>
          <TabPane tabId="details">
            <DetailsTab {...props} />
          </TabPane>
          <TabPane tabId="code">
            <CodeTab {...props} />
          </TabPane>
          {node.schema().hasMixin('triniti:curator:mixin:widget-has-search-request') && (
            <TabPane tabId="data-source">
              <WidgetHasSearchRequestFields {...props} />
            </TabPane>
          )}
          <TabPane tabId="history">
            <HistoryTab {...props} />
          </TabPane>
          <TabPane tabId="raw">
            <RawTab {...props} />
          </TabPane>
        </TabContent>
      </Form>
    </Screen>
  );
}

export default withNodeScreen(WidgetScreen, {
  defaultTab: 'details',
  leaveUrl: '/curator/widgets',
});
