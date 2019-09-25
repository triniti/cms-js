import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import {
  Button,
  ButtonGroup,
  Icon,
} from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import createDelegateFactory from '@triniti/app/createDelegateFactory';

import delegateFactory from './delegate';
import selector from './selector';
import { searchViewTypes } from '../../constants';

const { CARD, TABLE } = searchViewTypes;

export const SearchViewButtons = ({
  className,
  delegate,
  view,
}) => (
  <>
    <ButtonGroup className={classNames('search-view-buttons', className)}>
      <Button
        size="sm"
        color="none"
        onClick={() => delegate.handleChangeView(CARD)}
        id="results-view-card"
        className={view === TABLE ? 'btn-outline-light' : 'btn-outline-light active'}
      >
        <Icon imgSrc="grid-two-up" className="mr-0" />
      </Button>
      <Button
        size="sm"
        color="none"
        onClick={() => delegate.handleChangeView(TABLE)}
        id="results-view-table"
        className={view === TABLE ? 'btn-outline-light active' : 'btn-outline-light'}
      >
        <Icon imgSrc="list" size="sd" className="mr-0" />
      </Button>
    </ButtonGroup>
    <UncontrolledTooltip placement="top" target="results-view-card">Card View</UncontrolledTooltip>
    <UncontrolledTooltip placement="top" target="results-view-table">Table View</UncontrolledTooltip>
  </>
);

SearchViewButtons.propTypes = {
  className: PropTypes.string,
  delegate: PropTypes.shape({
    handleChangeView: PropTypes.func.isRequired,
  }).isRequired,
  view: PropTypes.string,
};

SearchViewButtons.defaultProps = {
  className: null,
  view: TABLE,
};

export default connect(selector, createDelegateFactory(delegateFactory))(SearchViewButtons);
