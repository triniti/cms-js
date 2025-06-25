import React, { useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import classNames from 'classnames';
import { FormText } from 'reactstrap';
import { useField } from 'react-final-form';
import { useFormContext } from '@triniti/cms/components/index.js';
import validateKey from '@triniti/cms/components/key-values-field/validateKey.js';

export default function SelectKeyField(props) {
  const {
    name,
    nestedPbj,
    pbjName,
    className = '',
    groupClassName = '',
    options = [],
    ignoreUnknownOptions = false,
    readOnly = false,
    ...rest
  } = props;
  const formContext = useFormContext();
  const { editMode } = formContext;
  const { input, meta } = useField(name, {
    validate: (value, allValues) => validateKey(value, allValues, pbjName),
  });

  const [allOptions, setAllOptions] = useState(options);

  useEffect(() => {
    if (ignoreUnknownOptions || !`${input.value}`.length) {
      return;
    }

    if (options.map(o => `${o.value}`).includes(`${input.value}`)) {
      return;
    }

    setAllOptions([...options, { value: input.value, label: input.value }]);
  }, []);

  const rootClassName = classNames(groupClassName, 'form-group');
  const classes = classNames(
    'select',
    meta.touched && !meta.valid && 'is-invalid',
    meta.touched && meta.valid && 'is-valid',
  );

  const currentOption = `${input.value}`.length ? allOptions.find(o => `${o.value}` === `${input.value}`) : null;

  return (
    <div className={rootClassName}>
      <ReactSelect
        {...input}
        {...rest}
        id={name}
        name={name}
        className={classes}
        classNamePrefix="select"
        isDisabled={!editMode || readOnly}
        isClearable={false}
        isMulti={false}
        options={allOptions}
        value={currentOption}
        onChange={selected => input.onChange(selected ? selected.value : undefined)}
      />
      {!meta.valid && <FormText color="danger">{meta.error}</FormText>}
    </div>
  );
}
