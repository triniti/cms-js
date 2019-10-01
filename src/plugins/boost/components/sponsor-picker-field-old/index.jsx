import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';

import createDelegateFactory from '@triniti/app/createDelegateFactory';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { FormGroup, Label, Select } from '@triniti/admin-ui-plugin/components';

import delegateFactory from './delegate';
import selector from './selector';

class SponsorPickerField extends React.Component {
  static propTypes = {
    delegate: PropTypes.shape({
      handleSearch: PropTypes.func,
    }).isRequired,
    getSponsor: PropTypes.func.isRequired,
    input: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    isEditMode: PropTypes.bool,
    label: PropTypes.string,
    multi: PropTypes.bool,
  };

  static defaultProps = {
    isEditMode: false,
    label: 'Sponsor',
    multi: false,
  };

  constructor(props) {
    super(props);

    this.getSponsors = debounce(this.getSponsors.bind(this), 500);
    this.renderValue = this.renderValue.bind(this);
  }

  getSponsors(input, callback) {
    const { delegate } = this.props;
    delegate.handleSearch(input)
      .then((result) => {
        const options = result.pbj.get('nodes', [])
          .map((node) => ({
            label: node.get('title'),
            value: node.get('_id').toNodeRef().toString(),
          }));

        callback(null, { options });
      })
      .catch((e) => { callback(e, null); });
  }

  renderValue(option) {
    const { getSponsor } = this.props;

    if (option instanceof NodeRef) {
      return getSponsor(option).get('title');
    }

    if (option.label === option.value) {
      const sponsor = getSponsor(option.label);
      return sponsor ? sponsor.get('title') : '';
    }

    return option.label;
  }

  render() {
    const { input, isEditMode, label, multi, ...rest } = this.props;
    return (
      <FormGroup>
        <Label>{label}</Label>
        <Select
          async
          autoload={false}
          closeOnSelect={false}
          isDisabled={!isEditMode}
          filterOptions={(options) => options}
          loadOptions={this.getSponsors}
          multi={multi}
          name={input.name}
          noResultsText="no sponsors found"
          onChange={(selected) => input.onChange(selected)}
          onBlur={() => input.onBlur(input.value)}
          onMenuOpen={() => this.selectorRef.loadOptions('')}
          forwardRef={(el) => { this.selectorRef = el; }}
          value={input.value || ''}
          valueRenderer={this.renderValue}
          {...rest}
        />
      </FormGroup>
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(SponsorPickerField);
