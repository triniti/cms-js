import { Card, Icon, Table } from '@triniti/admin-ui-plugin/components';
import artifactUrl from '@triniti/cms/plugins/ovp/utils/artifactUrl';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React from 'react';
import ReactPlayer from 'react-player';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import TableBody from './TableBody';
import TableHeader from './TableHeader';

export default class AssetsTable extends React.Component {
  static propTypes = {
    areAllChecked: PropTypes.bool,
    hasMasterCheckbox: PropTypes.bool,
    nodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
    onChangeAllRows: PropTypes.func,
    onSelectRow: PropTypes.func,
    onSort: PropTypes.func.isRequired,
    selectedRows: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
    sort: PropTypes.string.isRequired,
  };

  static defaultProps = {
    areAllChecked: false,
    hasMasterCheckbox: true,
    onChangeAllRows: noop,
    onSelectRow: noop,
    selectedRows: [],
  };

  constructor() {
    super();
    this.state = {
      mediaPlayer: {
        height: '0px',
        isPlaying: false,
        url: '',
        volume: 1.0,
        width: '0px',
      },
    };
    this.handleMediaPlayerCommand = this.handleMediaPlayerCommand.bind(this);
  }

  handleMediaPlayerCommand(command, asset, mediaType, dimensions = { width: 0, height: 0 }) {
    this.player.seekTo(0);
    let currentDimensions = { width: 0, height: 0 };
    let currentlyPlayingAssetId = null;
    let isPlaying = false;
    let showControls = false;
    if (command === 'play') {
      isPlaying = true;
      currentlyPlayingAssetId = asset.get('_id');
      currentDimensions = dimensions;
      if (mediaType === 'video') {
        showControls = true;
      }
    }

    const { mediaPlayer } = this.state;
    this.setState({
      mediaPlayer: {
        controls: showControls,
        currentlyPlayingAssetId,
        height: currentDimensions.height,
        isPlaying,
        mediaType: mediaType || null,
        url: asset ? artifactUrl(asset, 'video') : null,
        volume: mediaPlayer.volume,
        width: currentDimensions.width,
      },
    });
  }

  render() {
    const { mediaPlayer } = this.state;
    const {
      areAllChecked,
      hasMasterCheckbox,
      nodes,
      onChangeAllRows,
      onSelectRow,
      onSort,
      selectedRows,
      sort,
    } = this.props;

    return (
      <Card>
        <div
          style={{
            zIndex: 1049,
            position: 'fixed',
            top: '50%',
            left: '50%',
            width: '100%',
            padding: '1rem',
            maxWidth: '800px',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {
            mediaPlayer.isPlaying && mediaPlayer.mediaType === 'video'
            && (
              <>
                <Icon
                  id="dismiss-player"
                  imgSrc="delete"
                  alert
                  onClick={() => this.handleMediaPlayerCommand('stop')}
                  size="xs"
                  style={{
                    cursor: 'pointer',
                    position: 'absolute',
                    right: '2px',
                    top: '2px',
                    zIndex: 1,
                  }}
                />
                <UncontrolledTooltip placement="top" target="dismiss-player">Dismiss Player</UncontrolledTooltip>
              </>
            )
          }
          <ReactPlayer
            controls={mediaPlayer.controls}
            height={mediaPlayer.height}
            playing={mediaPlayer.isPlaying}
            ref={(player) => { this.player = player; }}
            url={mediaPlayer.url}
            volume={mediaPlayer.volume}
            width={mediaPlayer.width}
            className="embed-responsive embed-responsive-16by9"
            style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.4)' }}
          />
        </div>
        <Table className="table-borderless table-stretch" hover responsive>
          <TableHeader
            areAllChecked={areAllChecked}
            hasMasterCheckbox={hasMasterCheckbox}
            onChangeAllRows={onChangeAllRows}
            onSort={onSort}
            sort={sort}
          />
          <TableBody
            assets={nodes}
            currentlyPlayingAssetId={mediaPlayer.currentlyPlayingAssetId}
            onPlayerCommand={this.handleMediaPlayerCommand}
            onSelectRow={onSelectRow}
            selectedRows={selectedRows}
          />
        </Table>
      </Card>
    );
  }
}
