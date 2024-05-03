import React from 'react';

let localizationMap = new Map();

export const configure = (map) => {
  localizationMap = map;
};

// simple string transformer - to be used directly by delegates, sagas, etc.
export const localize = (key) => (localizationMap.has(key) ? localizationMap.get(key) : key);

// higher order component to be used only by unconnected components. connected components should
// use localize fn in their delegateFactory
export const withLocalize = (Component) => (props) => <Component {...props} localize={localize} />;
