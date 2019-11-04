import { components } from 'react-select';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import SelectThumbnail from './SelectThumbnail';
import damUrl from '../../../dam/utils/damUrl';

const Option = (props) => {
  const { children, data, isFocused, isSelected } = props;
  const thumbnailStyle = {
    borderRadius: 3,
    display: 'inline-block',
    marginRight: 10,
    position: 'relative',
    top: -2,
    verticalAlign: 'middle',
  };
  return (
    <components.Option {...props}>
      <div // eslint-disable-line jsx-a11y/click-events-have-key-events
        role="button"
        tabIndex="-1"
        className={classNames('select__option select__option-inner', { 'is-focused': isFocused }, { 'is-selected': isSelected })}
        title={data.node.get('title')}
      >
        {data.node.has('image_ref')
        && (
          <SelectThumbnail
            alt={data.node.get('title')}
            style={thumbnailStyle}
            path={damUrl(data.node.get('image_ref'))}
          />
        )}
        { children }
      </div>
    </components.Option>
  );
};

Option.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  isFocused: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  selectProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default Option;
