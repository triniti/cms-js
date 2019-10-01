import filesize from 'filesize';
import PropTypes from 'prop-types';
import React from 'react';
import ReactImageMagnify from 'react-image-magnify';
import Message from '@gdbots/pbj/Message';
import { Checkbox } from '@triniti/admin-ui-plugin/components';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import damUrl from '../../utils/damUrl';
import TableRowIcons from './TableRowIcons';

const TableRowImage = ({ asset, disabled, isSelected, onSelectRow }) => {
  const assetPath = damUrl(asset, 'o', 'sm');

  return (
    <tr className={`status-${asset.get('status')}`}>
      <th scope="row">
        <Checkbox
          disabled={disabled}
          id={asset.get('_id').toNodeRef().toString()}
          onChange={() => onSelectRow(asset.get('_id').toNodeRef())}
          checked={isSelected}
          size="sm"
        />
      </th>
      <td>
        <ReactImageMagnify
          style={{
            maxHeight: '60px',
            overflow: 'hidden',
          }}
          smallImage={{
            src: assetPath,
            width: 30,
            height: (30 / asset.get('width')) * asset.get('height'),
            isFluidWidth: false,
          }}
          imageStyle={{
            verticalAlign: 'top',
          }}
          largeImage={{
            src: assetPath,
            width: (asset.get('width')),
            height: (asset.get('height')),
          }}
          enlargedImageContainerStyle={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            marginLeft: 0,
            border: '0px',
            maxHeight: '100vh',
            maxWidth: '100vw',
            transform: 'translate(-50%, -50%)',
            zIndex: 1049,
            pointerEvents: 'none',
          }}
          enlargedImagePosition="beside"
          enlargedImageContainerDimensions={{ width: '100%' }}
          enlargedImageContainerClassName="w-auto"
          enlargedImageStyle={{
            margin: '16px',
            maxHeight: 'calc(90vh)',
            maxWidth: 'calc(90vw)',
            filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.4)',
            objectFit: 'scale-down',
          }}
          enlargedImageClassName="h-100 w-auto asset-hover-mw"
          hoverDelayInMs={100}
          hoverOffDelayInMs={20}
        />
      </td>
      <td>
        {asset.get('title')}
        <Collaborators nodeRef={asset.get('_id').toNodeRef()} />
      </td>
      <td>{ asset.get('mime_type') }</td>
      <td>{ filesize(asset.get('file_size').toString(), { round: 1 }) }</td>
      <td className="text-nowrap">{ convertReadableTime(asset.get('created_at')) }</td>
      <td className="td-icons">
        <TableRowIcons asset={asset} />
      </td>
    </tr>
  );
};

TableRowImage.propTypes = {
  asset: PropTypes.instanceOf(Message).isRequired,
  disabled: PropTypes.bool,
  isSelected: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
};

TableRowImage.defaultProps = {
  disabled: false,
  isSelected: false,
};

export default TableRowImage;
