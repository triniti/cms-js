import PropTypes from 'prop-types';
import React from 'react';
import Sortable from 'sortablejs';
import { Field, FieldArray, FormSection } from 'redux-form';
import TextField from '@triniti/cms/components/text-field';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import humanizeEnums from '@triniti/cms/utils/humanizeEnums';
import SelectField from '@triniti/cms/components/select-field';
import { Button, Col, FormGroup, Icon, ListGroupItem } from '@triniti/admin-ui-plugin/components';
import WidgetPickerField from '@triniti/cms/plugins/curator/components/widget-picker-field';
import SlotRendering from '@triniti/schemas/triniti/curator/enums/SlotRendering';

const renderingOptions = humanizeEnums(SlotRendering, { format: 'map', except: [SlotRendering.UNKNOWN] });

export default class Slots extends React.Component {
  static propTypes = {
    borderClass: PropTypes.string,
    fields: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    readOnly: PropTypes.bool,
  };

  static defaultProps = {
    borderClass: null,
    readOnly: false,
  };

  constructor(props) {
    super(props);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleMoveDown = this.handleMoveDown.bind(this);
    this.handleMoveUp = this.handleMoveUp.bind(this);
  }

  componentDidMount() {
    this.sortable = Sortable.create(this.sortableListRef, {
      animation: 150,
      chosenClass: 'active',
      draggable: '.sortable-slots',
      filter: '.js-remove',
      handle: '.sort-handle',
      onUpdate: () => {
        const { fields } = this.props;
        const newSlotOrder = this.sortable.toArray();
        fields.removeAll();
        newSlotOrder.forEach((slot) => {
          try {
            fields.push(JSON.parse(slot));
          } catch (e) {
            fields.push();
          }
        });
      },
    });
  }

  handleAdd() {
    const { fields } = this.props;
    fields.push({ name: "" });

    if (fields.length < 1) {
      return;
    }

    this.scrollToSlot(this.sortableListRef.scrollHeight + 300);
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

  scrollToSlot(offset) {
    const screenBody = document.getElementsByClassName('screen-body')[0];
    screenBody.scrollTo({ top: offset, behavior: 'smooth' });
  }

  render() {
    const { fields, readOnly, borderClass } = this.props;

    return (
      <ul className="list-group list-group-flush" ref={(el) => { this.sortableListRef = el; }}>
        <ListGroupItem className="p-0 pb-2">
          {!readOnly && (
            <Button color="primary" onClick={() => this.handleAdd()}>
              <Icon imgSrc="plus" alt="+" className="mr-1" />Add a Slot
            </Button>
          )}
        </ListGroupItem>

        {fields.getAll().map((slot, index) => (
          <ListGroupItem
            style={{"z-index": String(99 - index)}}
            className="pt-3 sortable-slots"
            data-id={JSON.stringify(slot)}
            key={index}
          >
            <FormSection
              className="justify-content-between align-items-start"
              name={`slots[${index}]`}
            >
              <FormGroup className={`d-flex justify-content-between m-0 ${borderClass}`}>
                {!readOnly && (
                <div className="d-inline-flex align-items-center flex-column disabled-hidden">
                  <Button
                    className="mt-3 m-0"
                    color="icon-hover-bg"
                    disabled={index === 0}
                    id={`btn-sort-up-${index}`}
                    onClick={() => this.handleMoveUp(index)}
                    radius="circle"
                    size="xs"
                  >
                    <Icon imgSrc="arrow-up" size="xs" />
                  </Button>
                  <UncontrolledTooltip
                    placement="top"
                    target={`btn-sort-up-${index}`}
                  >
                    Move Up
                  </UncontrolledTooltip>
                  <Button
                    className="mt-3 m-0 sort-handle"
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
                    className="mt-3 m-0"
                    color="icon-hover-bg"
                    disabled={index === fields.length - 1}
                    id={`btn-sort-down-${index}`}
                    onClick={() => this.handleMoveDown(index)}
                    radius="circle"
                    size="xs"
                  >
                    <Icon imgSrc="arrow-down" size="xs" />
                  </Button>
                  <UncontrolledTooltip placement="bottom" target={`btn-sort-down-${index}`}>
                    Move Down
                  </UncontrolledTooltip>
                </div>
                )}
                <FormGroup row className="m-0 gutter-sm" style={{ flex: '1 1 auto' }}>
                  <Col xs="12" sm="12">
                    <Field
                      name="name"
                      type="text"
                      placeholder="location-slug"
                      component={TextField}
                      readOnly={readOnly}
                      label="Name"
                      size="sm"
                    />
                    <Field
                      name="rendering"
                      component={SelectField}
                      disabled={readOnly}
                      label="Rendering"
                      options={renderingOptions}
                    />
                    <FieldArray
                      component={WidgetPickerField}
                      isEditMode={!readOnly}
                      isMulti={false}
                      name="widgetRef"
                    />
                  </Col>
                </FormGroup>
                {!readOnly && (
                  <span>
                    <Button
                      className="mt-4"
                      color="icon-hover-bg"
                      id={`btn-sort-trash-${index}`}
                      onClick={() => fields.remove(index)}
                      radius="circle"
                    >
                      <Icon imgSrc="trash" className="mr-0" />
                    </Button>
                    <UncontrolledTooltip
                      placement="right"
                      target={`btn-sort-trash-${index}`}
                    >
                      Trash
                    </UncontrolledTooltip>
                  </span>
                )}
              </FormGroup>
            </FormSection>
          </ListGroupItem>
        ))}
      </ul>
    );
  }
}
