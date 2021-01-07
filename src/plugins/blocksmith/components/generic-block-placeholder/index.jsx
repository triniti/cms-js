import { Badge, Icon, IconGroup } from '@triniti/admin-ui-plugin/components';
import { connect } from 'react-redux';
import { ContentBlock } from 'draft-js';
import classNames from 'classnames';
import get from 'lodash/get';
import Message from '@gdbots/pbj/Message';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import PlaceholderErrorBoundary from '@triniti/cms/plugins/blocksmith/components/placeholder-error-boundary';
import PropTypes from 'prop-types';
import React from 'react';
import ImagePreview from './ImagePreview';
import { handleDragEnd, handleDragStart, styleBlockTargetNodeStatus } from '../../utils';
import selector from './selector';
import './styles.scss';

class GenericBlockPlaceholder extends React.PureComponent {
  static propTypes = {
    block: PropTypes.instanceOf(ContentBlock).isRequired,
    config: PropTypes.oneOfType([
      PropTypes.shape({
        icon: PropTypes.shape({
          imgSrc: PropTypes.string,
        }),
        label: PropTypes.string,
      }),
      PropTypes.shape({
        iconGroup: PropTypes.shape({
          icons: PropTypes.shape({
            primary: PropTypes.shape({
              imgSrc: PropTypes.string,
            }),
            secondary: PropTypes.shape({
              imgSrc: PropTypes.string,
            }),
          }),
        }),
        label: PropTypes.string,
      }),
      PropTypes.shape({
        preview: PropTypes.func,
      }),
    ]),
    draggable: PropTypes.bool,
    label: PropTypes.string,
    showTitle: PropTypes.bool,
    targetNode: PropTypes.instanceOf(Message),
  };

  static defaultProps = {
    config: {
      label: null,
      icon: {
        imgSrc: 'full-screen',
      },
    },
    draggable: true,
    label: null,
    showTitle: false,
    targetNode: null,
  };

  constructor() {
    super();
    this.state = {
      imagePreviewSrc: null,
    };
    this.handleToggleImagePreviewSrc = this.handleToggleImagePreviewSrc.bind(this);
  }

  handleToggleImagePreviewSrc(src = null) {
    this.setState(({ imagePreviewSrc }) => ({
      imagePreviewSrc: imagePreviewSrc ? null : src,
    }));
  }

  render() {
    const {
      config,
      draggable,
      block,
      showTitle,
      targetNode,
      ...rest
    } = this.props;
    const { imagePreviewSrc } = this.state;

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
          ref={(ref) => { this.element = ref; }}
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
              onDismissImagePreview={this.handleToggleImagePreviewSrc}
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
            <IconGroup left key="iconGroup" className="mt-2 ml-1">
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
            </IconGroup>
          )}
          {config.preview && (
            <PreviewComponent
              node={node}
              showTitle={showTitle}
              onToggleImagePreviewSrc={this.handleToggleImagePreviewSrc}
              {...rest}
            />
          )}
          {config.label && (
            <div
              className="placeholder-label-holder ml-2 mt-1"
              style={{ width: `calc(100% - ${labelOffset}px)` }}
            >
              <p className={classNames('label float-left mr-2', config.preview ? 'mt-2' : 'mt-1', config.iconGroup ? 'mb-0' : 'mb-1')}>
                <i>{config.label}{title}</i>
              </p>
            </div>
          )}
        </div>
      </PlaceholderErrorBoundary>
    );
  }
}

export default connect(selector)(GenericBlockPlaceholder);
