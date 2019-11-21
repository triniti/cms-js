import { connect } from 'react-redux';
import addDateToSlug from '@gdbots/common/addDateToSlug';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import createSlug from '@gdbots/common/createSlug';
import isValidSlug from '@gdbots/common/isValidSlug';
import normalizeUnfinishedSlug from '@triniti/cms/utils/normalizeUnfinishedSlug';
import PropTypes from 'prop-types';
import React from 'react';
import slugContainsDate from '@gdbots/common/slugContainsDate';
import {
  Button,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@triniti/admin-ui-plugin/components';

import delegateFactory from './delegate';
import selector from './selector';

class SlugEditor extends React.Component {
  static propTypes = {
    canRename: PropTypes.bool,
    delegate: PropTypes.shape({
      getSluggableConfig: PropTypes.func.isRequired,
      handleRename: PropTypes.func.isRequired,
    }).isRequired,
    formName: PropTypes.string.isRequired,
    initialSlug: PropTypes.string,
  };

  static defaultProps = {
    canRename: false,
    initialSlug: '',
  };

  constructor(props) {
    super(props);
    this.addDate = this.addDate.bind(this);
    this.applySlug = this.applySlug.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRename = this.handleRename.bind(this);
    this.handleToggleModal = this.handleToggleModal.bind(this);
    this.validateSlug = this.validateSlug.bind(this);

    const { initialSlug } = props;
    this.state = {
      error: '',
      isOpen: false,
      slug: initialSlug,
      touched: false,
    };
  }

  applySlug() {
    this.setState(({ slug }) => ({ slug: createSlug(slug) }), this.validateSlug);
  }

  validateSlug() {
    const { slug } = this.state;
    const { delegate, formName } = this.props;
    const isDatedSlug = delegate.getSluggableConfig(formName);
    let error = '';

    if (!slug.trim()) {
      // check if slug is empty
      error = 'slug can\'t be empty';
    } else if (!isValidSlug(slug.trim(), isDatedSlug)) {
      // slug format check, provide a suggestion if there is no date in slug
      let helpText = '';
      if (isDatedSlug) {
        helpText = 'Invalid slug format - this slug cannot start or end with a dash or slash and can only contain lowercase alphanumeric characters, dashes, or slashes.';
      } else {
        helpText = 'Invalid slug format - this slug cannot start or end with a dash and can only contain lowercase alphanumeric characters or dashes.';
      }
      error = (
        <span>
          {helpText}
          {!isDatedSlug && ' Here\'s a suggestion, click Apply to update:'}
          {!isDatedSlug && <span className="text-info"><br />{createSlug(slug)}</span>}
        </span>
      );
    } else if (isDatedSlug && !slugContainsDate(slug)) {
      // check if slug contains date, only if datedSlug config is set to true
      error = (
        <span>Slug should contain date, use Add Date to add today&quot;s date</span>
      );
    }

    this.setState({ error });
  }

  handleBlur() {
    const { delegate, formName, initialSlug } = this.props;
    const { slug } = this.state;

    this.setState(() => ({
      slug: normalizeUnfinishedSlug(slug, slug, delegate.getSluggableConfig(formName)),
    }), this.validateSlug);
  }

  handleChange({ target: { value: slug } }) {
    this.setState((prevState, { initialSlug }) => ({
      slug,
      touched: slug !== initialSlug,
    }));
  }

  addDate() {
    this.setState(({ slug }, { initialSlug }) => {
      const DATE_REGEX = /^\d{1,4}\/?(\d{1,2}\/?(\d{1,2}\/?)?)?/;
      let newSlug = slug.replace(DATE_REGEX, '');
      newSlug = addDateToSlug(newSlug);
      return {
        error: '',
        slug: newSlug,
        touched: newSlug !== initialSlug,
      };
    });
  }

  handleRename() {
    const { delegate, initialSlug } = this.props;
    const { slug } = this.state;

    // if (slug === initialSlug) {
    //   this.setState({ touched: false });
    //   return;
    // }

    if (slug) {
      delegate.handleRename(initialSlug, slug);
    }

    this.handleToggleModal();
    this.setState({ touched: false });
  }

  handleCancel() {
    this.setState((state, { initialSlug }) => ({
      error: '',
      slug: initialSlug,
      touched: false,
    }));
    this.handleToggleModal();
  }

  handleToggleModal() {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  }

  render() {
    const {
      canRename, initialSlug, delegate, formName,
    } = this.props;
    const { error, isOpen, slug, touched } = this.state;
    const valid = touched ? (
      !error && normalizeUnfinishedSlug(slug, slug, delegate.getSluggableConfig(formName)) !== initialSlug
    ) : null;
    const isDatedSlug = delegate.getSluggableConfig(formName);

    return (
      <FormGroup>
        <Label>Slug</Label>
        <Input name="slug" readOnly value={initialSlug} />
        {
          canRename
          && ([
            <Button onClick={this.handleToggleModal} key="a">rename</Button>,
            <Modal isOpen={isOpen} toggle={this.handleToggleModal} key="b">
              <ModalHeader>Rename Slug</ModalHeader>
              <ModalBody>
                <FormGroup>
                  <InputGroup>
                    <Input
                      onBlur={this.handleBlur}
                      onChange={this.handleChange}
                      placeholder={initialSlug}
                      valid={valid}
                      value={slug}
                    />
                    {isDatedSlug && !slugContainsDate(slug)
                      && (
                        <InputGroupAddon addonType="append">
                          <Button outline color="secondary" onClick={this.addDate}>Add Date</Button>
                        </InputGroupAddon>
                      )}
                  </InputGroup>
                  {error && <FormText key="tips" color="danger" tag="span">{error}</FormText>}
                  {
                    !isDatedSlug
                    && (
                      <FormText key="btn" color="primary" onClick={this.applySlug} tag="a">
                        Apply
                      </FormText>
                    )
                  }
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                <Button color="link-bg" onClick={this.handleCancel}>Cancel</Button>
                <Button color="primary" onClick={this.handleRename} disabled={!valid}>Rename</Button>
              </ModalFooter>
            </Modal>,
          ])
        }
      </FormGroup>
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(SlugEditor);
