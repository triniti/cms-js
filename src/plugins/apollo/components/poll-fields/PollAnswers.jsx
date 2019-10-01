import PropTypes from 'prop-types';
import React from 'react';
import Sortable from 'sortablejs';
import { Field, FormSection } from 'redux-form';
import TextField from '@triniti/cms/components/text-field';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import UuidIdentifier from '@gdbots/pbj/well-known/UuidIdentifier';
import { Button, Col, FormGroup, Icon, ListGroupItem } from '@triniti/admin-ui-plugin/components';

export default class PollAnswers extends React.Component {
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
    this.handleMoveDown = this.handleMoveDown.bind(this);
    this.handleMoveUp = this.handleMoveUp.bind(this);
  }

  componentDidMount() {
    this.sortable = Sortable.create(this.sortableListRef, {
      animation: 150,
      chosenClass: 'active',
      draggable: '.sortable-answers',
      filter: '.js-remove',
      handle: '.sort-handle',
      onUpdate: () => {
        const { fields } = this.props;
        const newAnswerOrder = this.sortable.toArray();
        fields.removeAll();
        newAnswerOrder.forEach((answer) => {
          try {
            fields.push(JSON.parse(answer));
          } catch (e) {
            fields.push();
          }
        });
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
    const { fields, readOnly, borderClass } = this.props;

    return (
      <ul className="list-group list-group-flush" ref={(el) => { this.sortableListRef = el; }}>
        <ListGroupItem className="p-0 pb-2">
          {!readOnly && (
            <Button color="primary" onClick={() => fields.push({ _id: UuidIdentifier.generate() })}>
              <Icon imgSrc="plus" alt="+" className="mr-1" />Add an Answer
            </Button>
          )}
        </ListGroupItem>

        {fields.getAll().map((answer, index) => (
          <ListGroupItem
            className="p-0 pt-3 sortable-answers"
            data-id={JSON.stringify(answer)}
            // eslint-disable-next-line no-underscore-dangle
            key={answer._id}
          >
            <FormSection
              className="justify-content-between align-items-start"
              name={`answers[${index}]`}
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
                  <Col xs="12" md="9" xl="10">
                    <Field
                      name="title"
                      type="text"
                      placeholder={`Answer #${index + 1}`}
                      component={TextField}
                      readOnly={readOnly}
                      label="Answer"
                      size="sm"
                    />
                  </Col>
                  <Col xs="6" md="3" xl="2">
                    <Field
                      name="initialVotes"
                      type="text"
                      placeholder={`for #${index + 1}`}
                      component={TextField}
                      readOnly={readOnly}
                      label="Initial Votes"
                      size="sm"
                    />
                  </Col>
                  <Col xs="12" sm="12">
                    <Field
                      name="url"
                      type="text"
                      placeholder={`Answer #${index + 1} link`}
                      component={TextField}
                      readOnly={readOnly}
                      label="Answer Link"
                      size="sm"
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
