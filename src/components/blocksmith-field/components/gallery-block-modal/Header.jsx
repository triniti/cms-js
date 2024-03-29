import React from 'react';
import { ModalHeader } from 'reactstrap';
import Stepper from 'components/blocksmith-field/components/stepper';

const Header = ({
  activeStep,
  isFreshBlock,
  toggle,
}) => (
  <ModalHeader toggle={toggle}>
    <span className="nowrap">{`${isFreshBlock ? 'Add' : 'Update'} Gallery Block`}</span>
    <div className="ms-auto d-none d-sm-block" style={{ width: '60%', minWidth: '330px' }}>
      <Stepper
        className="p-0 stepper-items-2"
        steps={[
          {
            title: 'Select gallery',
          },
          {
            title: 'Customize Options',
          },
        ]}
        activeStep={activeStep}
        horizontal
        fullWidth
      />
    </div>
  </ModalHeader>
);

export default Header;