import React from 'react';
import SelectField from 'components/select-field';

const options = new Map;
const nofilter = () => true;
const noformat = label => label;

export default function EnumField({ enumClass, cacheKey = '', filter = nofilter, format = noformat, ...rest }) {
  const key = `${enumClass.getEnumId()}${cacheKey}`;
  if (!options.has(key)) {
    options.set(key, Object.entries(enumClass.getValues())
      .map(item => ({ value: item[1], label: format(item[0], item[1]) }))
      .filter(filter)
    );
  }

  const className = 'select--' + enumClass.getEnumId().split(':')[2];
  return <SelectField className={className} {...rest} options={options.get(key)} ignoreUnknownOptions />;
}
