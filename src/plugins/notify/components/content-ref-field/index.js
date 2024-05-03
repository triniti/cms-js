import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Field, useField, useFormState } from 'react-final-form';
import ReactSelect from 'react-select';
import classNames from 'classnames';
import { Badge, Label } from 'reactstrap';
import { ErrorBoundary, Loading, useFormContext } from '@triniti/cms/components/index.js';

export const pickers = {
  article: lazy(() => import('@triniti/cms/plugins/news/components/article-picker-field')),
  // gallery: lazy(() => import('@triniti/cms/plugins/curator/components/gallery-picker-field')),
  // video: lazy(() => import('@triniti/cms/plugins/ovp/components/video-picker-field')),
  none: props => <Field {...props} type="hidden" component="input" value={null} />,
};

const defaultOptions = [
  { label: 'Article', value: 'article' },
  // { label: 'Gallery', value: 'gallery' },
  // { label: 'Video', value: 'video' },
  { label: 'None - Custom Message', value: 'none' },
];

export default function ContentRefField(props) {
  const {
    groupClassName = '',
    name = 'content_ref',
    label = 'Content',
    options = defaultOptions,
    defaultType = 'article',
    readOnly = false,
    required = false,
    contentRef,
    ...rest
  } = props;



  const formContext = useFormContext();
  const { editMode } = formContext;
  const { values } = useFormState({ subscription: { values: true } });
  const initialType = (values.content_ref || `fake:${defaultType}:id`).split(':')[1].split('-').pop();
  const [type, setType] = useState(initialType);
  const contentRefField = useField(name);
  const ContentPickerField = pickers[type];
  const selectName = `${name}-select`;
  const currentOption = options.find(o => o.value === type);

  useEffect(() => {
    if (contentRef) {
      formContext.form.change(name, contentRef);
    }
  });

  const rootClassName = classNames(
    groupClassName,
    'form-group',
  );

  return (
    <div className={contentRef ? 'd-none' : ''}>
      <div className={rootClassName} id={`form-group-${selectName}`}>
        <Label htmlFor={selectName}>
          Content Type <Badge className="ms-1" color="light" pill>required</Badge>
        </Label>
        <ReactSelect
          id={selectName}
          name={selectName}
          className="select"
          classNamePrefix="select"
          isDisabled={!editMode || readOnly}
          options={options}
          value={currentOption}
          onChange={(selected) => {
            if (!selected || selected.value !== type) {
              contentRefField.input.onChange(undefined);
              contentRefField.input.onBlur();
            }

            setType(selected.value);
          }}
        />
      </div>
      <Suspense fallback={<Loading />}>
        <ErrorBoundary>
          <ContentPickerField
            name={name}
            label={label}
            readOnly={readOnly}
            {...rest}
            required={type !== 'none'}
          />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}
