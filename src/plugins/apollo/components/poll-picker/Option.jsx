import { Media } from '@triniti/admin-ui-plugin/components';
import classNames from 'classnames';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import PropTypes from 'prop-types';
import React from 'react';

const statusColorMap = Object.values(NodeStatus).reduce((acc, cur) => {
  acc[cur.toString()] = cur.toString();
  return acc;
}, {});

const Option = ({ className, data: { label, node, value }, onPick, selectedPolls }) => {
  const status = node.get('status');
  return (
    <section
      className={classNames(className, 'select__option select__option-inner', { 'is-selected': !!selectedPolls.find((poll) => poll.equals(value)) })}
      onClick={() => onPick(value)}
      role="presentation"
    >
      <Media>
        <Media body>
          <Media heading>
            <strong>{label}</strong>
            <small className={`text-uppercase status-copy ml-2 status-${statusColorMap[status]}`}>
              {status.toString()}
            </small>
          </Media>
        </Media>
      </Media>
    </section>
  );
};

Option.propTypes = {
  className: PropTypes.string,
  selectedPolls: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)).isRequired,
};

Option.defaultProps = {
  className: '',
};

export default Option;
