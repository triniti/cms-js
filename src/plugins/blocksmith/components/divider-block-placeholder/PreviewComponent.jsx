import DividerBlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/divider-block/DividerBlockV1Mixin';
import { localize } from '@triniti/cms/plugins/utils/services/Localization';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import './styles.scss';


const PreviewComponent = ({ node }) => {
  const strokeColor = node.get('stroke_color');

  return (
    <div role="presentation" className="divider__container divider__color">
      <p className="divider__title">{localize(DividerBlockV1Mixin.findOne().getQName().getVendor())} Divider Block</p>
      <div className={`divider__preview ${strokeColor}`} style={{ borderTopStyle: node.get('stroke_style') }}>
        <h5 className={strokeColor}>{node.get('text')}</h5>
      </div>
    </div>
  );
};

PreviewComponent.propTypes = {
  node: PropTypes.instanceOf(Message),
};

PreviewComponent.defaultProps = {
  node: null,
};

export default PreviewComponent;
