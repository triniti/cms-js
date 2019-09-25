// fixme:: this file need refactor
import React from 'react';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import trim from 'lodash/trim';
import startCase from 'lodash/startCase';

function stringifyAndShrink(value) {
  if (value === null) {
    return 'null';
  }

  const str = JSON.stringify(value);
  if (typeof str === 'undefined') {
    return 'undefined';
  }

  return str.length > 22 ? `${str.substr(0, 15)}…${str.substr(-5)}` : str;
}

function renderSpan(name, body, className) {
  return <span key={name} className={`${className} pl-2 pr-2`}>{trim(body, '"')}</span>;
}

function getChangeDetails(value) {
  let content = null;

  switch (value.length) {
    case 1: // Add
      return { label: 'Added', content: renderSpan('diffAdd', stringifyAndShrink(value[0]), 'bg-success') };

    case 2: // Update [0]old => [1]new
      content = (
        <span>
          <del>{renderSpan('diffUpdateFrom', stringifyAndShrink(value[0]), 'bg-danger')}</del>
          {renderSpan('diffUpdateTo', stringifyAndShrink(value[1]), 'bg-success')}
        </span>
      );

      return { label: 'Updated', content };

    case 3: // Delete ["old", 0, 0] // 0 -> magical number for value deleted in Delta
      return ({
        label: 'Deleted',
        content: <del>{renderSpan('diffRemove', stringifyAndShrink(value[0]), 'bg-danger')}</del>,
      });

    default:
      return null;
  }
}

function handleObjectDelta(objDelta) {
  const res = [];
  Object.keys(objDelta).forEach((key) => {
    if (key !== '_t') {
      if (key[0] === '_' && !objDelta[key.substr(1)]) {
        res[key.substr(1)] = objDelta[key];
      } else if (objDelta[`_${key}`]) {
        res[key] = [objDelta[`_${key}`][0], objDelta[key][0]];
      } else if (!objDelta[`_${key}`] && key[0] !== '_') {
        res[key] = objDelta[key];
      }
    }
  });

  return res;
}

export default function prepareDelta(delta, nodeKey = null) {
  return Object.entries(delta).map(([key, value]) => {
    if (isArray(value)) {
      const changes = getChangeDetails(value);
      if (nodeKey) {
        return (
          <div className="ml-2" key={key}>
            <strong>
              <span className="mr-1">{changes.label} Item #{parseInt(key, 10) + 1}</span>
              <div className="text-white">{changes.content}</div>
            </strong>
          </div>
        );
      }

      return (
        <div key={key}>
          <strong>
            <p>{startCase(key)}</p>
            <div className="text-white">{changes.content}</div>
          </strong>
        </div>
      );
    } if (isObject(value)) {
      if (value && value._t === 'a') { // eslint-disable-line no-underscore-dangle
        return (
          <div key={key}>
            <strong>
              <p>{startCase(key)}</p>
              {prepareDelta(handleObjectDelta(value), key)}
            </strong>
          </div>
        );
      }

      return prepareDelta(value);
    }

    return undefined;
  });
}
