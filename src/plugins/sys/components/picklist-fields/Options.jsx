import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import TextField from '@triniti/cms/components/text-field';
import {
  Button,
  Card,
  FormGroup,
  Icon,
  InputGroup,
  Label,
  ScrollableContainer,
} from '@triniti/admin-ui-plugin/components';

class Options extends React.Component {
  componentDidUpdate(prevProps) {
    const { fields } = this.props;
    const currLen = fields.length || 0;
    const prevLen = prevProps.fields.length || 0;

    if (currLen > 4 && currLen > prevLen) {
      const elems = this.wrapper.firstChild.childNodes;
      elems[currLen - 1].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }
  }

  render() {
    const { fields, label, meta: { error, submitFailed, touched }, isEditMode } = this.props;
    return (
      <div className="mb-4 mt-4">
        <FormGroup>
          <Label for={fields.name}>{label}</Label>
          <Card border className="rounded mb-0">
            {!!fields.length
            && (
              <div ref={(el) => { this.wrapper = el; }}>
                <ScrollableContainer className="p-3" style={{ maxHeight: '280px' }}>
                  {fields.map((field, index) => (
                    <InputGroup key={`${fields.name}-${index + 1}`} className="d-flex">
                      <Field
                        className="flex-grow-1 mb-0"
                        component={TextField}
                        readOnly={!isEditMode}
                        name={field}
                        placeholder="enter an option..."
                        inline
                      />
                      {isEditMode && (
                        <Button
                          className="align-self-start mr-0 pr-1 flex-shrink-0 flex-grow-0"
                          disabled={!isEditMode}
                          onClick={() => fields.remove(index)}
                          color="hover"
                        >
                          <Icon imgSrc="trash" alt="remove option" />
                        </Button>
                      )}
                    </InputGroup>
                  ))}
                  {touched && error && <span>{error.message}</span>}
                </ScrollableContainer>
              </div>
            )}
          </Card>
          {submitFailed && error && <span className="text-danger">{error}</span>}
        </FormGroup>

        <Button onClick={() => fields.push()} color="primary" disabled={!isEditMode}>Add Option</Button>
      </div>
    );
  }
}

Options.propTypes = {
  fields: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  isEditMode: PropTypes.bool,
  label: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
    submitFailed: PropTypes.bool,
    touched: PropTypes.bool,
  }).isRequired,
};

Options.defaultProps = {
  isEditMode: false,
};

export default Options;
