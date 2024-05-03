import React, { useState } from 'react';
import { Badge, FormText, Label } from 'reactstrap';
import Creatable from 'react-select/creatable';
import classNames from 'classnames';
import fastDeepEqual from 'fast-deep-equal/es6/index.js';
import isEmpty from 'lodash-es/isEmpty';
import trim from 'lodash-es/trim';
import { withAsyncPaginate } from 'react-select-async-paginate';
import { createHashtag, isValidHashtag } from '@gdbots/pbj/utils';
import { useField, useFormContext } from '@triniti/cms/components/index.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import defaultLoadOptions from '@triniti/cms/plugins/taxonomy/components/hashtag-picker-field/loadOptions';

const isEqual = (a, b) => fastDeepEqual(a, b) || (isEmpty(a) && isEmpty(b));
const CreatableAsyncPaginate = withAsyncPaginate(Creatable);

function HashtagPickerField(props) {
  const {
    groupClassName = '',
    name,
    label,
    description,
    pbjName,
    debounceTimeout = 400,
    closeMenuOnSelect = false,
    isClearable = false,
    readOnly = false,
    required = false,
    loadOptions = defaultLoadOptions,
    request,
    ...rest
  } = props;
  const formContext = useFormContext();
  const { editMode } = formContext;
  const { input, meta } = useField({ ...props, isEqual }, formContext);
  const [q, setQ] = useState(request.get('prefix'));

  const className = classNames(
    'select',
    meta.touched && !meta.valid && 'is-invalid',
    meta.touched && meta.valid && 'is-valid',
  );

  const formatHashtag = (value) => {
    let hashtag = trim(value, '#_ ');
    if (!isValidHashtag(hashtag)) {
      return createHashtag(hashtag);
    }

    return hashtag;
  };

  const currentOptions = input.value.length ? input.value.map(v => ({ value: v, label: `#${v}` })) : [];

  const rootClassName = classNames(
    groupClassName,
    'form-group',
  );

  const onCreateOption = (inputValue) => {
    currentOptions.push({ value: inputValue, label: `#${inputValue}`});
    input.onChange(currentOptions.map(o => o.value));
    setQ('');
  };

  return (
    <div className={rootClassName} id={`form-group-${pbjName || name}`}>
      {label &&
      <Label htmlFor={name}>{label}{required && <Badge className="ms-1" color="light" pill>required</Badge>}</Label>}
      <CreatableAsyncPaginate
        {...input}
        {...rest}
        id={name}
        name={name}
        className={className}
        classNamePrefix="select"
        isDisabled={!editMode || readOnly}
        isClearable={isClearable}
        closeMenuOnSelect={closeMenuOnSelect}
        isMulti
        inputValue={q}
        onInputChange={(value, action) => {
          if (action.action === 'input-change') {
            const formatted = formatHashtag(value);
            request.set('prefix', formatted);
            setQ(formatted);
            return;
          }

          if (action.action === 'menu-close') {
            request.clear('prefix');
            setQ('');
          }
        }}
        cachedUniqs={[q]}
        hideSelectedOptions={false}
        value={currentOptions}
        debounceTimeout={debounceTimeout}
        additional={{ request }}
        loadOptions={loadOptions}
        onChange={selected => input.onChange(selected ? selected.map(o => o.value) : undefined)}
        onCreateOption={onCreateOption}
      />
      {description && <FormText color="dark">{description}</FormText>}
      {meta.touched && !meta.valid && <FormText color="danger">{meta.error}</FormText>}
    </div>
  )
}

export default withRequest(HashtagPickerField, 'triniti:taxonomy:request:suggest-hashtags-request', {
  channel: 'picker',
  initialData: {
    autocomplete: true,
  }
});
