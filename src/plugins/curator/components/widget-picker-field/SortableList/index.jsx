import { connect } from 'react-redux';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import PropTypes from 'prop-types';
import React from 'react';
import Sortable from 'sortablejs';
import {
  Button,
  ButtonToolbar,
  FormGroup,
  Icon,
  Label,
  Media,
  Row,
} from '@triniti/admin-ui-plugin/components';
import selector from './selector';

class SortableList extends React.Component {
  static propTypes = {
    fields: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    getNode: PropTypes.func.isRequired,
    isMulti: PropTypes.bool,
    readOnly: PropTypes.bool,
  };

  static defaultProps = {
    isMulti: true,
    readOnly: false,
  };

  constructor(props) {
    super(props);

    this.handleMoveDown = this.handleMoveDown.bind(this);
    this.handleMoveUp = this.handleMoveUp.bind(this);
  }

  componentDidMount() {
    const { fields } = this.props;
    Sortable.create(this.sortableListRef, {
      animation: 150,
      chosenClass: 'active',
      draggable: '.sortable-articles',
      filter: '.js-remove',
      handle: '.sort-handle',
      onFilter: (evt) => {
        fields.remove(evt.oldIndex);
      },
      onUpdate: (evt) => {
        fields.move(evt.oldIndex, evt.newIndex);
      },
    });
  }

  handleMoveDown(index) {
    const { fields } = this.props;
    if (index === fields.length - 1) {
      return;
    }
    fields.move(index, index + 1);
  }

  handleMoveUp(index) {
    const { fields } = this.props;
    if (index === 0) {
      return;
    }
    fields.move(index, index - 1);
  }

  render() {
    const { fields, getNode, isMulti, readOnly } = this.props;
    let label = isMulti ? 'order widgets' : 'selected widget';
    if (readOnly) {
      label = isMulti ? 'related widgets' : 'related widget';
    }

    return (
      <FormGroup>
        <Label className="mb-2">{label}</Label>
        <Row>
          <div ref={(el) => { this.sortableListRef = el; }} className="col">
            {fields.getAll().map((widgetRef, i) => {
              const widget = getNode(widgetRef);
              if (!widget) {
                return (
                  <Media key={widgetRef} className="align-items-center sortable-articles mb-3">
                    <Media heading className="mb-0">
                      <strong>{`${widgetRef}`}</strong> did not load or is not found
                    </Media>
                    {
                      !readOnly && (
                      <Button color="icon-hover-bg" radius="circle" className="ml-auto js-remove">
                        <Icon imgSrc="trash" />
                      </Button>
                      )
                    }
                  </Media>
                );
              }

              const link = pbjUrl(widget, 'cms');

              return (
                <Media key={widgetRef} className="align-items-center sortable-articles mb-3">
                  {!readOnly && isMulti && (
                    <ButtonToolbar className="d-inline-flex align-items-center flex-column mr-2">
                      <Button
                        color="icon-hover-bg"
                        disabled={i === 0}
                        onClick={() => this.handleMoveUp(i)}
                        radius="circle"
                        size="xs"
                      >
                        <Icon imgSrc="arrow-up" size="xs" />
                      </Button>
                      <Button color="icon-hover-bg" radius="circle" className="sort-handle">
                        <Icon imgSrc="sort" />
                      </Button>
                      <Button
                        color="icon-hover-bg"
                        className="mr-2"
                        disabled={i === fields.length - 1}
                        onClick={() => this.handleMoveDown(i)}
                        radius="circle"
                        size="xs"
                      >
                        <Icon imgSrc="arrow-down" size="xs" />
                      </Button>
                    </ButtonToolbar>
                  )}
                  {widget.has('image_ref') && (
                    <Media left href={link} hoverOutline target="_blank">
                      <Media
                        alt="primary image"
                        height="50"
                        object
                        src={damUrl(widget.get('image_ref'))}
                        width="50"
                      />
                    </Media>
                  )}
                  <Media body>
                    <Media heading className="mb-0">
                      <a
                        href={link}
                        rel="noopener noreferrer"
                        style={{ color: '#067eb7' }}
                        target="_blank"
                      >
                        {widget.get('title')}
                      </a>
                      <small
                        className={`text-uppercase ml-2 status-copy status-${widget.get('status')}`}
                      >
                        {`${widget.get('status')}`}
                      </small>
                    </Media>
                    {widget.get('description')}
                  </Media>
                  {!readOnly
                  && (
                    <Button color="icon-hover-bg" radius="circle" className="ml-auto js-remove">
                      <Icon imgSrc="trash" />
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

export default connect(selector)(SortableList);
