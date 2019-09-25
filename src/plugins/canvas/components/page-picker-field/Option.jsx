import { Media } from '@triniti/admin-ui-plugin/components';
import { selectActionTypes } from '@triniti/cms/plugins/ncr/constants';
import classNames from 'classnames';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import PropTypes from 'prop-types';
import React from 'react';

const statusColorMap = Object.values(NodeStatus).reduce((acc, cur) => {
  acc[cur.toString()] = cur.toString();
  return acc;
}, {});

const Option = ({ data: { node, value }, isSelected, selectProps }) => {
  const title = node.get('title');
  const status = node.get('status').toString();
  return (
    <section
      className={classNames('select__option', { 'is-selected': isSelected })}
      onClick={() => selectProps.onChange({ value }, { action: selectActionTypes.SELECT_OPTION })}
      role="presentation"
    >
      <Media>
        {node.has('image_ref')
        && (
        <Media left>
          <Media
            alt={`${title} primary image`}
            height="32"
            object
            src={damUrl(node.get('image_ref'), '1by1', 'sm')}
            width="32"
          />
        </Media>
        )}
        <Media body>
          <Media heading>
            <strong>{title}</strong>
            <small className={`text-uppercase status-copy ml-2 status-${statusColorMap[status]}`}>
              {status}
            </small>
          </Media>
          <em>{node.get('description')}</em>
        </Media>
      </Media>
    </section>
  );
};

Option.propTypes = {
  data: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  isSelected: PropTypes.bool.isRequired,
  selectProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default Option;
