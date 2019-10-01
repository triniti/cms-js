import React from 'react';
import startCase from 'lodash/startCase';
import trim from 'lodash/trim';

// eslint-disable-next-line no-unused-vars
export const jsonTreeLabelRenderer = ([key, ...parentKeys]) => <strong>{startCase(key)}</strong>;
export const jsonTreeValueRenderer = (raw, color) => {
  if (raw === 'true') {
    return <strong className={`${color} text-white pl-2 pr-2`}>Yes</strong>;
  }
  if (raw === 'false') {
    return <strong className={`${color} text-white pl-2 pr-2`}>No</strong>;
  }
  if (raw === 'null') {
    return undefined;
  }
  return <strong className={`${color} text-white pl-2 pr-2`}>{trim(raw, '"')}</strong>;
};
