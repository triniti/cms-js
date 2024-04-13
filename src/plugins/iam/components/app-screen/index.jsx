import React from 'react';
import { Badge, DropdownMenu, DropdownToggle, Form, TabContent, TabPane, UncontrolledDropdown } from 'reactstrap';
import withNodeScreen, { useDelegate } from '@triniti/cms/plugins/ncr/components/with-node-screen';
import HistoryTab from '@triniti/cms/plugins/ncr/components/history-tab';
import RawTab from '@triniti/cms/plugins/ncr/components/raw-tab';
import NodeStatusCard from '@triniti/cms/plugins/ncr/components/node-status-card';
import { ActionButton, FormErrors, Icon, Screen, ViewModeWarning } from '@triniti/cms/components';
import DetailsTab from '@triniti/cms/plugins/iam/components/app-screen/DetailsTab';
import RolesTab from '@triniti/cms/plugins/iam/components/app-screen/RolesTab';
import ActiveEditsNotificationModal from '@triniti/cms/plugins/raven/components/active-edits-notification-modal';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';

function AppScreen(props) {
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

  return (
    <Screen
      title={node.get('title')}
      header={node.get('title')}
      breadcrumbs={[
        { text: 'Apps', to: '/iam/apps' },
        { text: node.get('title') },
      ]}
      activeTab={tab}
      tabs={[
        { text: 'Details', to: urls.tab('details') },
        { text: 'Roles', to: urls.tab('roles') },
        { text: 'History', to: urls.tab('history') },
        { text: 'Raw', to: urls.tab('raw') },
      ]}
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
          <TabPane tabId="roles">
            <RolesTab {...props} />
          </TabPane>
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

export default withNodeScreen(AppScreen, {
  defaultTab: 'details',
  leaveUrl: '/iam/apps',
});
