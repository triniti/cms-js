import React from 'react';
import DividerBlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/divider-block/DividerBlockV1Mixin';
import { localize } from '@triniti/cms/plugins/utils/services/Localization';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import './styles.scss';


const PreviewComponent = ({ node }) => (
  <div role="presentation" className="divider__container">
    <p style={{ marginBottom: '0px', fontStyle: 'italic' }}>{localize(DividerBlockV1Mixin.findOne().getQName().getVendor())} Divider Block</p>
    <div className={`divider__preview' ${node.get('stroke_color')}`} style={{ display: 'flex' }}>
      <p style={{ fontSize: '14px' }}>{node.get('text')}</p>
      <div
        className="divider__bar"
        style={{
          height: '6px',
          width: '360px',
          margin: '10px 0px 10px 6px',
          borderTopStyle: node.get('stroke_style') || 'solid',
        }}
      />
    </div>
  </div>
);

PreviewComponent.propTypes = {
  node: PropTypes.instanceOf(Message),
};

PreviewComponent.defaultProps = {
  node: null,
};

export default PreviewComponent;
