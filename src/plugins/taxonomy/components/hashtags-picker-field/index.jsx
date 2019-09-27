import { connect } from 'react-redux';
import { FormGroup, FormText, Label, Select } from '@triniti/admin-ui-plugin/components';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import Message from '@gdbots/pbj/Message';
import PropTypes from 'prop-types';
import React from 'react';
import delegateFactory from './delegate';
import selector from './selector';
import './style.scss';

const HashtagsPickerField = ({
  delegate,
  input,
  label,
  isEditMode,
  meta: { error },
  placeholder,
  response,
  ...rest
}) => {
  const options = (!response ? [] : response.get('hashtags', [])).map((hashtag) => ({
    label: `#${hashtag}`,
    value: hashtag,
  }));

  /**
   * Called when a new tag is going to be added to the input.
   * Contains logic on manipulating displayed prompt messages
   * before adding the new hashtag.
   *
   * @param {String} hashtag
   * @param {Array} selectedOptions hashtags in object form { label: '#mytag', value: 'mytag' }
   * @return {String}
   */
  const handlePromptTextCreator = (hashtag, selectedOptions) => {
    const selectedValues = (selectedOptions || []).map((opt) => opt.value);
    const availableOptions = options.filter((option) => !selectedValues.includes(option.value));

    if (availableOptions.length) {
      return `${availableOptions.length} suggestion${(availableOptions.length > 1 ? 's' : '')} found.`;
    }

    return `Press Enter or Tab to add "${hashtag}"`;
  };

  const handleRenderValue = (option) => {
    if (option.label === option.value && !option.label.trim()) {
      return false;
    }

    return `#${option.value}`;
  };

  return (
    <FormGroup>
      <Label>{label}</Label>
      <Select
        autoload={false}
        cache={false}
        className="hidden-options-toggle"
        closeOnSelect={false}
        creatable
        isDisabled={!isEditMode}
        filterOptions={(o) => o.filter((opt) => opt.className !== 'Select-create-option-placeholder')}
        loadingPlaceholder=""
        isMulti
        name={input.name}
        noResultsText="No hashtags found."
        onBlur={() => input.onBlur(input.value)}
        onChange={input.onChange}
        onInputChange={delegate.handleSuggestHashtags}
        options={options}
        placeholder={placeholder}
        formatCreateLabel={(hashtag) => handlePromptTextCreator(hashtag, input.value)}
        searchPromptText="Note: You can select or create multiple hashtags."
        value={input.value || []}
        valueRenderer={handleRenderValue}
        {...rest}
      />
      {error && <FormText key="error" color="danger" className="ml-1">{error}</FormText>}
    </FormGroup>
  );
};

HashtagsPickerField.propTypes = {
  delegate: PropTypes.shape({
    handleSuggestHashtags: PropTypes.func,
  }).isRequired,
  input: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  isEditMode: PropTypes.bool,
  label: PropTypes.string,
  meta: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  placeholder: PropTypes.string,
  response: PropTypes.instanceOf(Message),
};

HashtagsPickerField.defaultProps = {
  isEditMode: false,
  label: 'hashtags',
  placeholder: 'Start typing.....',
  response: null,
};

export default connect(selector, createDelegateFactory(delegateFactory))(HashtagsPickerField);
