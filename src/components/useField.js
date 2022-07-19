import isArray from 'lodash-es/isArray';
import isFunction from 'lodash-es/isFunction';
import { useField } from 'react-final-form';
import FormMarshaler from 'utils/FormMarshaler';

export default (config, formContext) => {
  const {
    name,
    nestedPbj = null,
    pbjName = null,
    validator = null,
    withPbjParse = false
  } = config;

  let required = !!config.required;
  const { pbj } = formContext;
  const schema = nestedPbj ? nestedPbj.schema() : pbj?.schema();
  const pbjField = schema ? schema.hasField(pbjName || name) && schema.getField(pbjName || name) : null;

  if (pbjField && pbjField.isRequired()) {
    required = true;
  }

  const field = useField(name, config);
  field.pbjField = pbjField;

  config.validate = async (value, allValues, meta) => {
    const isEmptyIsh = value === undefined || value === null || !`${value}`.length;
    if (required && isEmptyIsh) {
      return 'Required';
    }

    if (pbjField && !isEmptyIsh) {
      const vals = isArray(value) ? value : [value];
      for (const val of vals) {
        try {
          pbjField.guardValue(await pbjField.getType().decode(val, pbjField, FormMarshaler));
        } catch (e) {
          return e.message.split(' :: ').pop();
        }
      }
    }

    return isFunction(validator) ? validator(value, allValues, meta) : undefined;
  };

  if (pbjField && !config.parse && withPbjParse) {
    config.parse = value => pbjField.getType().encode(value, pbjField);
  }

  return field;
};
