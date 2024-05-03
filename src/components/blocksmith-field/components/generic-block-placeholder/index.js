import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Badge } from 'reactstrap';
import classNames from 'classnames';
import get from 'lodash-es/get';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import Icon from 'components/icon';
import PlaceholderErrorBoundary from '@triniti/cms/components/blocksmith-field/components/placeholder-error-boundary';
import { handleDragEnd, handleDragStart, styleBlockTargetNodeStatus } from '@triniti/cms/components/blocksmith-field/utils';
import ImagePreview from '@triniti/cms/components/blocksmith-field/components/generic-block-placeholder/ImagePreview';
import selector from '@triniti/cms/components/blocksmith-field/components/generic-block-placeholder/selector';
import '@triniti/cms/components/blocksmith-field/components/generic-block-placeholder/styles.scss';

const GenericBlockPlaceholder = ({
  config,
  draggable,
  block,
  showTitle,
  targetNode,
  ...rest
}) => {
  const [ imagePreviewSrc, setImagePreviewSrc ] = useState(null);

  const handleToggleImagePreviewSrc = (src = null) => {
    setImagePreviewSrc(imagePreviewSrc ? null : src);
  }

  const PreviewComponent = get(config, 'preview.component', null);
  const node = block.getData().get('canvasBlock') || null;

  const title = (targetNode || node).has('title') && `: ${(targetNode || node).get('title')}`;
  const targetNodeStatus = targetNode && targetNode.get('status');
  let labelOffset = config.preview ? 156 : 70;
  if (targetNode && targetNodeStatus !== NodeStatus.PUBLISHED) {
    labelOffset += 65;
    styleBlockTargetNodeStatus(block);
  }

  return (
    <PlaceholderErrorBoundary block={block}>
      <div
        className={classNames({ draggable }, { 'block-preview': config.preview })}
        draggable={draggable}
        onDragStart={handleDragStart(block.getKey())}
        onDragEnd={handleDragEnd}
        // ref={(ref) => { this.element = ref; }}
        role="presentation"
      >
        {targetNode && targetNodeStatus !== NodeStatus.PUBLISHED && (
          <Badge className={`status-${targetNodeStatus} text-dark`}>
            { targetNodeStatus.toString()}
          </Badge>
        )}
        {imagePreviewSrc && (
          <ImagePreview
            draggable={draggable}
            onDismissImagePreview={handleToggleImagePreviewSrc}
            src={imagePreviewSrc}
          />
        )}
        {config.icon && (
          <Icon
            alert
            border
            color="black"
            imgSrc={get(config, 'icon.imgSrc', '')}
            key="icon"
            radius="rounded"
            size="xxl"
          />
        )}
        {config.iconGroup && (
          <span className="icon-group icon-group-left mt-2 ms-1">
            <Icon
              alert
              border
              imgSrc={get(config, 'iconGroup.icons.primary.imgSrc', '')}
              radius="rounded"
              size="sd"
              src={get(config, 'iconGroup.icons.primary.src', '')}
            />
            <Icon
              alert
              imgSrc={get(config, 'iconGroup.icons.secondary.imgSrc', '')}
              size="xxs"
              src={get(config, 'iconGroup.icons.secondary.src', '')}
            />
          </span>
        )}
        {config.preview && (
          <PreviewComponent
            node={node}
            showTitle={showTitle}
            onToggleImagePreviewSrc={handleToggleImagePreviewSrc}
            {...rest}
          />
        )}
        {config.label && (
          <div
            className="placeholder-label-holder"
            style={{ width: `calc(100% - ${labelOffset}px)` }}
          >
            <p className="label me-2 mb-1">
              <i><span className="fw-bold">{config.label}</span>{title}</i>
            </p>
          </div>
        )}
      </div>
    </PlaceholderErrorBoundary>
  );
}

export default connect(selector)(GenericBlockPlaceholder);
