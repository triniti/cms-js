import React from 'react';
import { ModalHeader } from 'reactstrap';
import Stepper from '@triniti/cms/blocksmith/components/stepper/index.js';

export default function Header({
  activeStep,
  isFreshBlock,
  toggle,
}) {
  return (
    <ModalHeader toggle={toggle}>
      <span className="nowrap">{`${isFreshBlock ? 'Add' : 'Update'} Article Block`}</span>
      <div className="ms-auto d-none d-sm-block" style={{ width: '60%', minWidth: '330px' }}>
        <Stepper
          className="p-0 stepper-items-2"
          steps={[
            {
              title: 'Select article',
            },
            {
              title: 'Customize options',
            },
          ]}
          activeStep={activeStep}
          horizontal
          fullWidth
          activeColor="#08a0e8"
          circleFontSize={12}
          circleTop={0}
          completeBarColor="#08a0e8"
          completeColor="#08a0e8"
          defaultBarColor="rgba(180, 180, 180, .5)"
          defaultColor="#999aa8"
          defaultTitleColor="#7a7a7c"
          size={27}
          titleFontSize={12}
        />
      </div>
    </ModalHeader>
  );
};
