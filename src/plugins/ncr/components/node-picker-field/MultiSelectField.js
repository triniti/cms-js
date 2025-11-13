import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import classNames from 'classnames';
import { Badge, FormText, Label } from 'reactstrap';
import fastDeepEqual from 'fast-deep-equal/es6/index.js';
import isEmpty from 'lodash-es/isEmpty.js';
import { useField, useFormContext } from '@triniti/cms/components/index.js';
import defaultLoadOptions from '@triniti/cms/plugins/ncr/components/node-picker-field/loadOptions.js';
import MultiValueLabel from '@triniti/cms/plugins/ncr/components/node-picker-field/MultiValueLabel.js';
import Option from '@triniti/cms/plugins/ncr/components/node-picker-field/Option.js';
import SortableValues from '@triniti/cms/plugins/ncr/components/node-picker-field/SortableValues.js';

const defaultComponents = { MultiValueLabel, Option };
const isEqual = (a, b) => fastDeepEqual(a, b) || (isEmpty(a) && isEmpty(b));
const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.userAgent);
const isModifierPressed = (e) => isMac ? e.metaKey : e.ctrlKey;

export default function MultiSelectField(props) {
  const {
    groupClassName = '',
    name,
    label,
    description,
    nestedPbj,
    pbjName,
    debounceTimeout = 400,
    isClearable = false,
    readOnly = false,
    required = false,
    labelField = 'title',
    showImage = true,
    sortable = false,
    components = defaultComponents,
    loadOptions = defaultLoadOptions,
    request,
    ...rest
  } = props;
  const formContext = useFormContext();
  const { editMode } = formContext;
  const { input, meta } = useField({ ...props, isEqual }, formContext);
  
  const [q, setQ] = useState(request.get('q'));
  const [cachedQuery, setCachedQuery] = useState('');
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const modifierKeyPressedRef = useRef(false);
  const cachedQueryRef = useRef(cachedQuery);
  
  const rootClassName = classNames(groupClassName, 'form-group');
  const className = classNames(
    'select',
    showImage && 'select-with-image',
    sortable && 'select-stacked',
    meta.touched && !meta.valid && 'is-invalid',
    meta.touched && meta.valid && 'is-valid'
  );
  const currentOptions = input.value.length ? input.value.map(v => ({ value: v, label: v })) : [];
  
  const clearQuery = useCallback(() => {
    request.clear('q');
    setQ('');
    setCachedQuery('');
  }, [request]);
  
  // Track modifier key state
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isModifierPressed(e)) modifierKeyPressedRef.current = true;
    };
    const handleKeyUp = (e) => {
      if (!isModifierPressed(e)) modifierKeyPressedRef.current = false;
    };
    const handleMouseDown = (e) => {
      if (isModifierPressed(e)) modifierKeyPressedRef.current = true;
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
  
  // Sync cached query ref and ensure request has cached query when input is empty
  useEffect(() => {
    cachedQueryRef.current = cachedQuery;
    if (!q && cachedQuery && request.get('q') !== cachedQuery) {
      request.set('q', cachedQuery);
    }
  }, [q, cachedQuery, request]);
  
  // Wrapper for loadOptions to use cached query for cache key matching
  const wrappedLoadOptions = useCallback((search, loadedOptions, additional) => {
    const searchToUse = (!search && cachedQueryRef.current) ? cachedQueryRef.current : search;
    if (!search && cachedQueryRef.current) {
      request.set('q', cachedQueryRef.current);
    }
    return loadOptions(searchToUse, loadedOptions, additional);
  }, [request, loadOptions]);
  
  const handleInputChange = useCallback((value, action) => {
    if (action.action === 'input-change') {
      request.set('q', value);
      setQ(value);
      if (value) setCachedQuery(value);
      return;
    }
    if (action.action === 'menu-close') {
      setMenuIsOpen(false);
      clearQuery();
    }
  }, [request, clearQuery]);
  
  const handleMenuOpen = useCallback(() => {
    setMenuIsOpen(true);
    if (!q && cachedQuery) {
      setQ(cachedQuery);
      request.set('q', cachedQuery);
    }
  }, [q, cachedQuery, request]);
  
  const handleChange = useCallback((selected) => {
    const wasModifierPressed = modifierKeyPressedRef.current;
    const queryToCache = (wasModifierPressed && cachedQuery) 
      ? cachedQuery 
      : (q || request.get('q') || '');
    
    input.onChange(selected ? selected.map(o => o.value) : undefined);
    
    if (wasModifierPressed && queryToCache) {
      if (queryToCache !== cachedQuery) setCachedQuery(queryToCache);
      setQ(queryToCache);
      request.set('q', queryToCache);
      setMenuIsOpen(true);
    } else {
      setMenuIsOpen(false);
      clearQuery();
      modifierKeyPressedRef.current = false;
    }
  }, [input, q, cachedQuery, request, clearQuery]);
  
  return (
    <div className={rootClassName} id={`form-group-${pbjName || name}`}>
      {label && <Label htmlFor={name}>{label}{required && <Badge className="ms-1" color="light" pill>required</Badge>}</Label>}
      {sortable && input.value.length > 0 && <SortableValues input={input} {...props} editMode={editMode} />}
      <AsyncPaginate
        {...input}
        {...rest}
        id={name}
        name={name}
        className={className}
        classNamePrefix="select"
        isDisabled={!editMode || readOnly}
        isClearable={isClearable}
        closeMenuOnSelect={false}
        controlShouldRenderValue={!sortable}
        isMulti
        inputValue={q}
        menuIsOpen={menuIsOpen}
        onInputChange={handleInputChange}
        onMenuOpen={handleMenuOpen}
        onMenuClose={() => setMenuIsOpen(false)}
        cachedUniqs={[cachedQuery]}
        hideSelectedOptions={false}
        value={currentOptions}
        debounceTimeout={debounceTimeout}
        showImage={showImage}
        labelField={labelField}
        components={components}
        loadOptions={wrappedLoadOptions}
        additional={{ page: 1, request }}
        onChange={handleChange}
      />
      {description && <FormText color="dark">{description}</FormText>}
      {meta.touched && !meta.valid && <FormText color="danger">{meta.error}</FormText>}
    </div>
  );
}
