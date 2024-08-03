import React from 'react';
import { Badge, DropdownMenu, DropdownToggle, Form, TabContent, TabPane, UncontrolledDropdown } from 'reactstrap';
import withNodeScreen, { useDelegate } from '@triniti/cms/plugins/ncr/components/with-node-screen/index.js';
import NodeStatusCard from '@triniti/cms/plugins/ncr/components/node-status-card/index.js';
import { ActionButton, FormErrors, Icon, Screen, ViewModeWarning } from '@triniti/cms/components/index.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import ReactionsCard from '@triniti/cms/plugins/apollo/components/reactions-card/index.js';
import StatsCard from '@triniti/cms/plugins/news/components/article-screen/StatsCard.js';
import StoryTab from '@triniti/cms/plugins/news/components/article-screen/StoryTab.js';
import DetailsTab from '@triniti/cms/plugins/news/components/article-screen/DetailsTab.js';
import NotificationsTab from '@triniti/cms/plugins/news/components/article-screen/NotificationsTab.js';
import AssetsTab from '@triniti/cms/plugins/news/components/article-screen/AssetsTab.js';
import TaxonomyTab from '@triniti/cms/plugins/taxonomy/components/taxonomy-tab/index.js';
import SeoTab from '@triniti/cms/plugins/common/components/seo-tab/index.js';
import HistoryTab from '@triniti/cms/plugins/ncr/components/history-tab/index.js';
import RawTab from '@triniti/cms/plugins/ncr/components/raw-tab/index.js';

function ArticleScreen(props) {
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
  const schema = node.schema();

  const { dirty, errors, hasSubmitErrors, hasValidationErrors, submitting, valid } = formState;
  const submitDisabled = submitting || isRefreshing || !dirty || (!valid && !hasSubmitErrors);

  const canDelete = policy.isGranted(`${qname}:delete`);
  const canUpdate = policy.isGranted(`${qname}:update`);

  return (
    <Screen
      header={node.get('title')}
      activeNav="Content"
      activeSubNav="Articles"
      breadcrumbs={[
        { text: 'Articles', to: '/news/articles' },
        { text: node.get('title') },
      ]}
      activeTab={tab}
      tabs={[
        { text: 'Story', to: urls.tab('story') },
        { text: 'Details', to: urls.tab('details') },
        { text: 'Taxonomy', to: urls.tab('taxonomy') },
        { text: 'SEO', to: urls.tab('seo') },
        { text: 'Notifications', to: urls.tab('notifications') },
        { text: 'Assets', to: urls.tab('assets') },
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
          {canDelete && (
            <UncontrolledDropdown>
              <DropdownToggle className="px-1 me-0 mb-0" color="light" outline>
                <Icon imgSrc="more-vertical" alt="More Actions" size="md" />
              </DropdownToggle>
              <DropdownMenu end className="px-2 dropdown-menu-arrow-right">
                <ActionButton
                  text="Delete"
                  onClick={delegate.handleDelete}
                  icon="trash"
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
          <StatsCard nodeRef={nodeRef.replace('article', 'article-stats')} />
          {schema.hasMixin('triniti:apollo:mixin:has-reactions') && (
            <ReactionsCard nodeRef={nodeRef.replace('article', 'reactions')} />
          )}
        </>
      }
    >
      {!editMode && <ViewModeWarning />}
      {dirty && hasValidationErrors && <FormErrors errors={errors} />}
      <Form onSubmit={handleSubmit} autoComplete="off">
        <TabContent activeTab={tab}>
          <TabPane tabId="story">
            <StoryTab {...props} />
          </TabPane>
          <TabPane tabId="details">
            <DetailsTab {...props} />
          </TabPane>
          <TabPane tabId="taxonomy">
            <TaxonomyTab {...props} />
          </TabPane>
          <TabPane tabId="seo">
            <SeoTab {...props} />
          </TabPane>
          <TabPane tabId="notifications">
            <NotificationsTab {...props} />
          </TabPane>
          <TabPane tabId="assets">
            <AssetsTab {...props} />
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

export default withNodeScreen(ArticleScreen, {
  label: 'article',
  defaultTab: 'story',
  leaveUrl: '/news/articles',
});
