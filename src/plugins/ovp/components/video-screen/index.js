import React from 'react';
import { Badge, DropdownMenu, DropdownToggle, Form, TabContent, TabPane, UncontrolledDropdown } from 'reactstrap';
import withNodeScreen, { useDelegate } from '@triniti/cms/plugins/ncr/components/with-node-screen/index.js';
import NodeStatusCard from '@triniti/cms/plugins/ncr/components/node-status-card/index.js';
import { ActionButton, FormErrors, Icon, Screen, ViewModeWarning } from '@triniti/cms/components/index.js';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators/index.js';
import DetailsTab from '@triniti/cms/plugins/ovp/components/video-screen/DetailsTab.js';
import AssetsTab from '@triniti/cms/plugins/ovp/components/video-screen/AssetsTab.js';
import TaxonomyTab from '@triniti/cms/plugins/taxonomy/components/taxonomy-tab/index.js';
import SeoTab from '@triniti/cms/plugins/common/components/seo-tab/index.js';
import HistoryTab from '@triniti/cms/plugins/ncr/components/history-tab/index.js';
import RawTab from '@triniti/cms/plugins/ncr/components/raw-tab/index.js';
import MezzaninePreviewCard from '@triniti/cms/plugins/ovp/components/video-screen/MezzaninePreviewCard.js';
import SaveNodeButton from '@triniti/cms/plugins/ncr/components/save-node-button/index.js';
import MediaLiveCard from '@triniti/cms/plugins/ovp/components/livestreams-screen/MediaLiveCard.js';
import useRequest from '@triniti/cms/plugins/pbjx/components/useRequest.js';
import { useResolver } from '@triniti/cms/plugins/pbjx/components/with-request/index.js';

function VideoScreen(props) {
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
    urls,
    refreshNode,
  } = props;

  const delegate = useDelegate(props);

  const { dirty, errors, hasSubmitErrors, hasValidationErrors, submitting, valid } = formState;
  const submitDisabled = submitting || isRefreshing || !dirty || (!valid && !hasSubmitErrors);

  const canDelete = policy.isGranted(`${qname}:delete`);
  const canUpdate = policy.isGranted(`${qname}:update`);

  const schema = node.schema();
  const hasMedialiveChannel = schema.hasMixin('triniti:ovp.medialive:mixin:has-channel') && node.has('medialive_channel_arn');
  const medialiveChannelArn = node.get('medialive_channel_arn');
  const medialiveRequest = useResolver('triniti:ovp:request:search-videos-request', hasMedialiveChannel && medialiveChannelArn ? {
    channel: `video-medialive-${nodeRef}`,
    initialData: {
      count: 1,
      page: 1,
      q: `medialive_channel_arn:"${medialiveChannelArn}"`,
      derefs: ['medialive_channel_state'],
    },
  } : null);

  const {
    response: medialiveResponse,
    run: runMedialiveRequest,
    isRunning: isRunningMedialiveRequest,
  } = useRequest(medialiveRequest, Boolean(medialiveRequest));

  const medialive = (() => {
    if (!medialiveResponse) {
      return { channelState: 'unknown', inputs: [], originEndpoints: [], cdnEndpoints: [] };
    }

    const nodes = medialiveResponse.get('nodes', []);
    if (nodes.length === 0) {
      return { channelState: 'unknown', inputs: [], originEndpoints: [], cdnEndpoints: [] };
    }

    const responseNode = nodes[0];
    const responseNodeRef = responseNode.generateNodeRef();
    const key = responseNodeRef.toString();
    const metas = medialiveResponse.get('metas', {});

    return Object.entries(metas)
      .reduce((newObj, [name, value]) => {
        if (!name.startsWith(key)) {
          return newObj;
        }

        const newName = name.replace(`${key}.`, '');
        if (newName.startsWith('medialive_channel_state')) {
          newObj.channelState = value;
        } else if (newName.startsWith('medialive_input_')) {
          newObj.inputs.push(value);
        } else if (newName.startsWith('mediapackage_origin_endpoint_')) {
          newObj.originEndpoints.push(value);
        } else if (newName.startsWith('mediapackage_cdn_endpoint_')) {
          newObj.cdnEndpoints.push(value);
        } else {
          newObj[newName] = value;
        }

        return newObj;
      }, { channelState: 'unknown', inputs: [], originEndpoints: [], cdnEndpoints: [] });
  })();

  const handleRefreshMedialive = () => {
    runMedialiveRequest();
    refreshNode();
  };

  return (
    <Screen
      header={node.get('title')}
      activeNav="Content"
      activeSubNav="Videos"
      breadcrumbs={[
        { text: 'Videos', to: '/ovp/videos' },
        { text: node.get('title') },
      ]}
      activeTab={tab}
      tabs={[
        { text: 'Details', to: urls.tab('details') },
        { text: 'Taxonomy', to: urls.tab('taxonomy') },
        { text: 'SEO', to: urls.tab('seo') },
        { text: 'Assets', to: urls.tab('assets') },
        { text: 'History', to: urls.tab('history') },
        { text: 'Raw', to: urls.tab('raw') },
      ]}
      primaryActions={
        <>
          <Collaborators nodeRef={nodeRef} editMode={editMode} viewModeUrl={urls.viewMode} onPermalink />
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
          <SaveNodeButton 
            onClick={delegate.handleSave}
            disabled={submitDisabled}
            nodeRef={nodeRef}
          />
          {canUpdate && (
            <ActionButton
              text={editMode ? 'Enter View Mode' : 'Enter Edit Mode'}
              onClick={delegate.handleSwitchMode}
              disabled={submitting || isRefreshing}
              icon={editMode ? 'eye' : 'edit'}
              color="light"
              outline
            />
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
          {hasMedialiveChannel && (
            <MediaLiveCard
              node={node}
              nodeRef={nodeRef}
              medialive={medialive}
              refresh={handleRefreshMedialive}
              isRefreshing={isRefreshing || isRunningMedialiveRequest}
              showNodeActions={false}
              className="media-live-card-sidebar"
            />
          )}
          {node.has('mezzanine_ref') && <MezzaninePreviewCard nodeRef={node.get('mezzanine_ref')} />}
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

export default withNodeScreen(VideoScreen, {
  label: 'video',
  leaveUrl: '/ovp/videos',
});
