import React from 'react';
import { Badge, DropdownMenu, DropdownToggle, Form, TabContent, TabPane, UncontrolledDropdown } from 'reactstrap';
import withNodeScreen, { useDelegate } from '@triniti/cms/plugins/ncr/components/with-node-screen/index.js';
import NodeStatusCard from '@triniti/cms/plugins/ncr/components/node-status-card/index.js';
import { ActionButton, FormErrors, Icon, Screen, ViewModeWarning } from '@triniti/cms/components/index.js';
import DetailsTab from '@triniti/cms/plugins/curator/components/teaser-screen/DetailsTab.js';
import TaxonomyTab from '@triniti/cms/plugins/taxonomy/components/taxonomy-tab/index.js';
import SeoTab from '@triniti/cms/plugins/common/components/seo-tab/index.js';
import HistoryTab from '@triniti/cms/plugins/ncr/components/history-tab/index.js';
import RawTab from '@triniti/cms/plugins/ncr/components/raw-tab/index.js';

function TeaserScreen(props) {
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
  const canDuplicate = policy.isGranted(`${qname}:create`);

  return (
    <Screen
      header={node.get('title')}
      activeNav="Structure"
      activeSubNav="Teasers"
      breadcrumbs={[
        { text: 'Teasers', to: '/curator/teasers' },
        { text: node.get('title') },
      ]}
      activeTab={tab}
      tabs={[
        { text: 'Details', to: urls.tab('details') },
        { text: 'Taxonomy', to: urls.tab('taxonomy') },
        { text: 'SEO', to: urls.tab('seo') },
        { text: 'History', to: urls.tab('history') },
        { text: 'Raw', to: urls.tab('raw') },
      ]}
      primaryActions={
        <>
          {isRefreshing && <Badge color="light" pill><span className="badge-animated">Refreshing Node</span></Badge>}
          {!isRefreshing && dirty && hasValidationErrors && <Badge color="danger" pill>Form Has Errors</Badge>}
          <ActionButton
            text="Close"
            onClick={delegate.handleClose}
            disabled={submitting || isRefreshing}
            icon="back"
            color="light"
            outline
          />
          {canUpdate && (
            <>
              <ActionButton
                text="Save"
                onClick={delegate.handleSave}
                disabled={submitDisabled}
                icon="save-diskette"
                color="primary"
              />
              <ActionButton
                text={editMode ? 'Enter View Mode' : 'Enter Edit Mode'}
                onClick={delegate.handleSwitchMode}
                disabled={submitting || isRefreshing}
                icon={editMode ? 'eye' : 'edit'}
                color="light"
                outline
              />
            </>
          )}
          {(canDelete || canDuplicate) && (
            <UncontrolledDropdown>
              <DropdownToggle className="px-1 me-0 mb-0" color="light" outline>
                <Icon imgSrc="more-vertical" alt="More Actions" size="md" />
              </DropdownToggle>
              <DropdownMenu end className="px-2 dropdown-menu-arrow-right">
                {canDuplicate && (
                  <ActionButton
                    text="Duplicate"
                    onClick={delegate.handleDuplicate}
                    icon="documents"
                    color="light"
                    outline
                  />
                )}
                {canDelete && (
                  <ActionButton
                    text="Delete"
                    onClick={delegate.handleDelete}
                    icon="trash"
                    color="danger"
                    outline
                  />
                )}
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
      {dirty && hasValidationErrors && <FormErrors errors={errors} />}
      <Form onSubmit={handleSubmit} autoComplete="off">
        <TabContent activeTab={tab}>
          <TabPane tabId="details">
            <DetailsTab {...props} />
          </TabPane>
          <TabPane tabId="taxonomy">
            <TaxonomyTab {...props} />
          </TabPane>
          <TabPane tabId="seo">
            <SeoTab {...props} />
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

export default withNodeScreen(TeaserScreen, {
  defaultTab: 'details',
  leaveUrl: '/curator/teasers',
});
