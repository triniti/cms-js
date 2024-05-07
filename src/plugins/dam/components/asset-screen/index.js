import React from 'react';
import { Badge, DropdownMenu, DropdownToggle, Form, TabContent, TabPane, UncontrolledDropdown } from 'reactstrap';
import withNodeScreen, { useDelegate } from '@triniti/cms/plugins/ncr/components/with-node-screen/index.js';
import HistoryTab from '@triniti/cms/plugins/ncr/components/history-tab/index.js';
import RawTab from '@triniti/cms/plugins/ncr/components/raw-tab/index.js';
import NodeStatusCard from '@triniti/cms/plugins/ncr/components/node-status-card/index.js';
import TaxonomyTab from '@triniti/cms/plugins/taxonomy/components/taxonomy-tab/index.js';
import { ActionButton, FormErrors, Icon, Screen, ViewModeWarning } from '@triniti/cms/components/index.js';
import DetailsTab from '@triniti/cms/plugins/dam/components/asset-screen/DetailsTab.js';
import VariantsTab from '@triniti/cms/plugins/dam/components/asset-screen/VariantsTab.js';
import ActiveEditsNotificationModal from '@triniti/cms/plugins/raven/components/active-edits-notification-modal/index.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';

function AssetScreen(props) {
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

  const TabItems=[
    { text: 'Details', to: urls.tab('details') },
    { text: 'Taxonomy', to: urls.tab('taxonomy') },
    { text: 'History', to: urls.tab('history') },
    { text: 'Raw', to: urls.tab('raw') },
  ]

  const TabItemsWithVariants=[
    { text: 'Details', to: urls.tab('details') },
    { text: 'Taxonomy', to: urls.tab('taxonomy') },
    { text: 'Variants', to: urls.tab('variants') },
    { text: 'History', to: urls.tab('history') },
    { text: 'Raw', to: urls.tab('raw') },
  ]

  return (
    <Screen
      title={node.get('title')}
      header={node.get('title')}
      breadcrumbs={[
        { text: 'Assets', to: '/dam/assets' },
        { text: node.get('title') },
      ]}
      activeTab={tab}
      tabs={[...(node.schema().hasMixin('triniti:dam:mixin:image-asset') ? TabItemsWithVariants : TabItems)]}
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
          <TabPane tabId="taxonomy">
            <TaxonomyTab {...props} />
          </TabPane>
          {node.schema().hasMixin('triniti:dam:mixin:image-asset') && (
          <TabPane tabId="variants">
            <VariantsTab {...props} asset={node} type="image-asset"/>
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

export default withNodeScreen(AssetScreen, {
  defaultTab: 'details',
  leaveUrl: '/dam/assets',
});
