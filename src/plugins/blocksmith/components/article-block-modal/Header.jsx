import React from 'react';
import PropTypes from 'prop-types';
import { ModalHeader, Stepper } from '@triniti/admin-ui-plugin/components';

const Header = ({
  activeStep,
  isFreshBlock,
  toggle,
}) => (
  <ModalHeader toggle={toggle}>
    <span className="nowrap">{`${isFreshBlock ? 'Add' : 'Update'} Article Block`}</span>
    <div className="ml-auto d-none d-sm-block" style={{ width: '60%', minWidth: '330px' }}>
      <Stepper
        className="p-0 bg-gray-100 stepper-items-2"
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
      />
    </div>
  </ModalHeader>
);

Header.propTypes = {
  activeStep: PropTypes.number.isRequired,
  isFreshBlock: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Header;
