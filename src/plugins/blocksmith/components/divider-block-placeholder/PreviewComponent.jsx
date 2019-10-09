import DividerBlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/divider-block/DividerBlockV1Mixin';
import { localize } from '@triniti/cms/plugins/utils/services/Localization';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import './styles.scss';


const PreviewComponent = ({ node }) => (
  <div role="presentation" className="divider__container">
    <p className="divider__title">{localize(DividerBlockV1Mixin.findOne().getQName().getVendor())} Divider Block</p>
    <div className={`divider__preview ${node.get('stroke_color')}`}>
      <p>{node.get('text')}</p>
      <div className="divider__bar" style={{ borderTopStyle: node.get('stroke_style') }} />
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
