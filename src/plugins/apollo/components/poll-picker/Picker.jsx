import { components } from 'react-select';
import { FormGroup, Select } from '@triniti/admin-ui-plugin/components';
import classNames from 'classnames';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import Option from './Option';
import Menu from './Menu';

const Picker = ({
  className,
  closeOnSelect,
  isMulti,
  menuListRef,
  onInputChange,
  onMenuOpen,
  onPick,
  options,
  response,
  selectedPolls,
}) => (
  <FormGroup className={classNames(className, 'px-4', 'py-2')}>
    <h3 className="mb-4">{`Search and Select ${isMulti ? 'Polls' : 'a Poll'}`}</h3>
    <Select
      closeOnSelect={closeOnSelect}
      components={{
        Menu: ({ children, ...rest }) => <Menu response={response} {...rest}>{children}</Menu>,
        MenuList: (props) => (
          <components.MenuList
            {...props}
            innerRef={(e) => { props.innerRef(e); menuListRef(e); }}
          />
        ),
        MultiValue: () => null,
        Option: ({ children, ...rest }) => <Option onPick={onPick} selectedPolls={selectedPolls} {...rest}>{children}</Option>,
      }}
      filterOption={() => true} // never filter any options
      isMulti={isMulti}
      onChange={onPick}
      onInputChange={onInputChange}
      onMenuOpen={onMenuOpen}
      options={options}
      placeholder="Start typing to find polls..."
    />
  </FormGroup>
);

Picker.propTypes = {
  className: PropTypes.string,
  closeOnSelect: PropTypes.bool,
  isMulti: PropTypes.bool,
  onInputChange: PropTypes.func.isRequired,
  onMenuOpen: PropTypes.func.isRequired,
  onPick: PropTypes.func.isRequired,
  response: PropTypes.instanceOf(Message),
};

Picker.defaultProps = {
  className: '',
  closeOnSelect: false,
  isMulti: true,
  response: null,
};

export default Picker;
