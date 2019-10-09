import PropTypes from 'prop-types';
import React from 'react';
import Sortable from 'sortablejs';

import {
  Button,
  ButtonToolbar,
  FormGroup,
  Icon,
  Media,
  Row,
} from '@triniti/admin-ui-plugin/components';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';

const DRAGGABLE_CLASSNAME = 'sortable-nodes';
const FILTER_CLASSNAME = 'js-remove';
const HANDLE_CLASSNAME = 'sort-handle';

export default class SortableList extends React.Component {
  static propTypes = {
    getNode: PropTypes.func.isRequired,
    multi: PropTypes.bool,
    onFilter: PropTypes.func.isRequired,
    onMoveDown: PropTypes.func.isRequired,
    onMoveUp: PropTypes.func.isRequired,
    onSort: PropTypes.func.isRequired,
    nodeRefs: PropTypes.arrayOf(PropTypes.instanceOf(NodeRef)),
    readOnly: PropTypes.bool,
  };

  static defaultProps = {
    multi: true,
    nodeRefs: [],
    readOnly: false,
  };

  componentDidMount() {
    const { onFilter, onSort } = this.props;

    Sortable.create(this.sortableListRef, {
      animation: 150,
      chosenClass: 'active',
      draggable: `.${DRAGGABLE_CLASSNAME}`,
      filter: `.${FILTER_CLASSNAME}`,
      handle: `.${HANDLE_CLASSNAME}`,
      onFilter: (evt) => onFilter(evt.oldIndex),
      onUpdate: (evt) => onSort(evt.oldIndex, evt.newIndex),
    });
  }

  render() {
    const {
      getNode,
      multi,
      onMoveDown,
      onMoveUp,
      nodeRefs,
      readOnly,
    } = this.props;

    return (
      <FormGroup className="px-4 py-2">
        <h3 className="mb-2">
          {`${multi ? 'Order Polls' : 'Selected Poll'}`}
        </h3>
        <Row>
          <div ref={(el) => { this.sortableListRef = el; }} className="col">
            {nodeRefs.map((nodeRef, index) => {
              const nodeData = getNode(nodeRef);
              if (!nodeData) {
                return (
                  <Media key={nodeRef.toString()} className={`align-items-center mb-3 ${DRAGGABLE_CLASSNAME}`}>
                    <Media heading className="mb-0">
                      Poll {nodeRef.toString()} not found
                    </Media>
                    {!readOnly
                    && (
                      <Button color="icon-hover-bg" radius="circle" className={`mb-0 ${FILTER_CLASSNAME}`}>
                        <Icon imgSrc="trash" />
                      </Button>
                    )}
                  </Media>
                );
              }

              const href = pbjUrl(nodeData, 'cms');

              return (
                <Media
                  key={nodeRef.toString()}
                  className={`align-items-center mb-3 ${DRAGGABLE_CLASSNAME}`}
                >
                  {!readOnly && multi && (
                    <ButtonToolbar className="d-inline-flex align-items-center flex-column mr-2">
                      <Button
                        color="icon-hover-bg"
                        disabled={index === 0}
                        id={`btn-move-up-${index}`}
                        onClick={() => onMoveUp(index)}
                        radius="circle"
                        size="xs"
                      >
                        <Icon imgSrc="arrow-up" size="xs" />
                      </Button>
                      <UncontrolledTooltip
                        placement="top"
                        target={`btn-move-up-${index}`}
                      >
                        Move Up
                      </UncontrolledTooltip>
                      <Button
                        className={`${HANDLE_CLASSNAME}`}
                        color="icon-hover-bg"
                        id={`btn-sort-${index}`}
                        radius="circle"
                      >
                        <Icon imgSrc="sort" />
                      </Button>
                      <UncontrolledTooltip
                        placement="left"
                        target={`btn-sort-${index}`}
                      >
                        Reorder
                      </UncontrolledTooltip>
                      <Button
                        className="mr-2"
                        color="icon-hover-bg"
                        disabled={index === nodeRefs.length - 1}
                        id={`btn-move-down-${index}`}
                        onClick={() => onMoveDown(index)}
                        radius="circle"
                        size="xs"
                      >
                        <Icon imgSrc="arrow-down" size="xs" />
                      </Button>
                      <UncontrolledTooltip
                        placement="bottom"
                        target={`btn-move-down-${index}`}
                      >
                        Move Down
                      </UncontrolledTooltip>
                    </ButtonToolbar>
                  )}
                  <Media body>
                    <Media heading className="mb-0">
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {nodeData ? nodeData.get('title') : ''}
                      </a>
                      <small className={`text-uppercase ml-2 status-copy status-${nodeData.get('status')}`}>
                        {nodeData ? nodeData.get('status').toString() : 'draft'}
                      </small>
                    </Media>
                  </Media>
                  {!readOnly
                  && (
                  <Button
                    className={`mb-0 ${FILTER_CLASSNAME}`}
                    color="icon-hover-bg"
                    id={`btn-delete-${index}`}
                    radius="circle"
                  >
                    <Icon imgSrc="trash" />
                    <UncontrolledTooltip
                      placement="right"
                      target={`btn-delete-${index}`}
                    >
                      Delete
                    </UncontrolledTooltip>
                  </Button>
                  )}
                </Media>
              );
            })}
          </div>
        </Row>
      </FormGroup>
    );
  }
}
