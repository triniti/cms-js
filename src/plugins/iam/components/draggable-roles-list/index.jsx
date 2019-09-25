import React from 'react';
import PropTypes from 'prop-types';
import Sortable from 'sortablejs';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import './styles.scss';

class DraggableRolesList extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
    onAdd: PropTypes.func,
  };

  static defaultProps = {
    title: '',
    roles: [],
    onAdd: () => {},
  };

  componentDidMount() {
    const { onAdd: onAddRole } = this.props;
    const groupOpts = {
      name: 'rolesList',
      pull: true,
      put: true,
    };

    Sortable.create(this.ul, {
      sort: false,
      draggable: '.draggable-roles-list-group-item-action',
      dragClass: 'active',
      chosenClass: 'active',
      group: groupOpts,
      animation: 150,
      onAdd(evt) {
        // console.log('onAdd:', [evt.from, evt.item.dataset.noderef, evt.to]);
        onAddRole(evt);
      },
    });
  }

  render() {
    const { roles, title } = this.props;
    const dragItem = roles.map((role) => (
      <li
        key={role.id}
        className="draggable-roles-list-group-item draggable-roles-list-group-item-action"
        data-noderef={role}
      >
        <h5 className="draggable-roles-list-group-item-title">{role.id}</h5>
      </li>
    ));

    return (
      <div className="draggable-roles-list">
        <h3 className="draggable-roles-title">{title}</h3>
        <ul className="list-group draggable-roles-list-group" ref={(ul) => { this.ul = ul; }}>
          {dragItem}
        </ul>
      </div>
    );
  }
}

export default DraggableRolesList;
