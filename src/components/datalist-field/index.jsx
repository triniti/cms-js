/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  FormText,
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
} from '@triniti/admin-ui-plugin/components';

/**
 * DatalistField.
 * @Important:: do not turn this component into a stateless component
 * in order to use "refs" for a parent component
 */
export default class DatalistField extends React.Component {
  static propTypes = {
    addon: PropTypes.shape({
      imgAlt: PropTypes.string,
      imgSrc: PropTypes.string,
      onClick: PropTypes.func,
      show: PropTypes.bool,
    }),
    className: PropTypes.string,
    input: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    inputClass: PropTypes.string,
    meta: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    options: PropTypes.arrayOf(PropTypes.string),
    readOnly: PropTypes.bool,
  };

  static defaultProps = {
    addon: {},
    className: '',
    inputClass: '',
    options: [],
    readOnly: false,
  };

  render() {
    const {
      addon,
      className,
      input,
      inputClass,
      options,
      readOnly,
      meta: { touched, error },
    } = this.props;

    return (
      <div className={className}>
        <InputGroup>
          <Input
            className={`rounded-right ${inputClass}`}
            disabled={readOnly}
            invalid={touched && !!error}
            list={input.name}
            style={{ width: 104 }}
            valid={touched && !error}
            {...input}
          />
          <datalist id={input.name}>
            {options.map((option) => <option value={option} key={option} />)}
          </datalist>
          {
            addon.show && !readOnly
            && (
            <InputGroupAddon addonType="append">
              <Button outline color="light" onClick={addon.onClick}>
                {
                  addon.imgSrc
                  && <Icon imgSrc={addon.imgSrc} alt={`${addon.imgAlt ? addon.imgAlt : 'unknown'}`} className="mr-0" />
                }
              </Button>
            </InputGroupAddon>
            )
          }
        </InputGroup>
        {touched && error && <FormText key="error" color="danger" className="ml-1">{error}</FormText>}
      </div>
    );
  }
}
