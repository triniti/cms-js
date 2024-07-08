import React from 'react';
import '@triniti/cms/blocksmith/components/divider-block-modal/DividerBlockPreview.scss';

const DividerBlockPreview = (props) => {
  const { formState } = props;
  const {
    stroke_color: strokeColor,
    stroke_style: strokeStyle,
    text,
  } = formState.values;

  return (
    <div className="pt-4 pb-3 divider-block__option">
      <div className={`divider__preview text-${strokeColor}`} style={{ borderTopStyle: strokeStyle }}>
        <h5 className={strokeColor}>{text}</h5>
      </div>
    </div>
  );
};

export default DividerBlockPreview;
