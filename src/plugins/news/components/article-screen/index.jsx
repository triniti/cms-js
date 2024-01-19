import React from 'react';
import { Badge, DropdownMenu, DropdownToggle, Form, TabContent, TabPane, UncontrolledDropdown } from 'reactstrap';
import withNodeScreen, { useDelegate } from 'plugins/ncr/components/with-node-screen';
import HistoryTab from 'plugins/ncr/components/history-tab';
import RawTab from 'plugins/ncr/components/raw-tab';
import NodeStatusCard from 'plugins/ncr/components/node-status-card';
import SeoTab from 'plugins/common/components/seo-tab';
import TaxonomyTab from 'plugins/taxonomy/components/taxonomy-tab';
import { ActionButton, FormErrors, Icon, Screen, ViewModeWarning } from 'components';
import DetailsTab from 'plugins/news/components/article-screen/DetailsTab';
import StoryTab from 'plugins/news/components/article-screen/StoryTab';
import NotificationsTab from 'plugins/news/components/article-screen/NotificationsTab';
import ActiveEditsNotificationModal from 'plugins/raven/components/active-edits-notification-modal';
import Collaborators from 'plugins/raven/components/collaborators';

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

  const { dirty, errors, hasSubmitErrors, hasValidationErrors, submitting, valid } = formState;
  const submitDisabled = submitting || isRefreshing || !dirty || (!valid && !hasSubmitErrors);

  const canDelete = policy.isGranted(`${qname}:delete`);
  const canUpdate = policy.isGranted(`${qname}:update`);
  const hasSeo = node.schema().hasMixin('triniti:common:mixin:seo');
  const hasNotifications = node.schema().hasMixin('triniti:notify:mixin:has-notifications');

  return (
    <Screen
      title={node.get('title')}
      header={node.get('title')}
      breadcrumbs={[
        { text: 'Articles', to: '/news/articles' },
        { text: node.get('title') },
      ]}
      activeTab={tab}
      tabs={[
        { text: 'Story', to: urls.tab('story') },
        { text: 'Details', to: urls.tab('details') },
        { text: 'Taxonomy', to: urls.tab('taxonomy') },
        (hasSeo && { text: 'Seo', to: urls.tab('seo') }),
        (hasNotifications && { text: 'Notifications', to: urls.tab('notifications') }),
        { text: 'History', to: urls.tab('history') },
        { text: 'Raw', to: urls.tab('raw') },
      ].filter(Boolean)}
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
          <TabPane tabId="story">
            <StoryTab {...props} />
          </TabPane>
          <TabPane tabId="details">
            <DetailsTab {...props} />
          </TabPane>
          <TabPane tabId="taxonomy">
            <TaxonomyTab {...props} />
          </TabPane>
          {hasSeo && (
            <TabPane tabId="seo">
              <SeoTab {...props} />
            </TabPane>
          )}
          {hasNotifications && (
            <TabPane tabId="notifications">
              <NotificationsTab {...props} />
            </TabPane>
          )}
          <TabPane tabId="history">
            <HistoryTab isFormDirty={dirty} {...props} />
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
