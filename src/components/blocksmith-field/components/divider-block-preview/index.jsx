import React from 'react';
import 'components/blocksmith-field/components/divider-block-preview/styles.scss';

const DividerBlockPreview = ({ block }) => {
  const strokeColor = block.get('stroke_color');

  return (
    <div className="px-4 pb-3 divider-block__option">
      <div className={`divider__preview ${strokeColor}`} style={{ borderTopStyle: block.get('stroke_style') }}>
        <h5 className={strokeColor}>{block.get('text')}</h5>
      </div>
    </div>
  );
};

export default DividerBlockPreview;
