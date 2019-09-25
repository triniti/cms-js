import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Message from '@gdbots/pbj/Message';
import selector from './selector';
import './styles.scss';

const PollBlockPreview = ({ className, pollNode }) => (
  <div className={classNames(className, 'poll-preview')} role="presentation">
    <h3>{pollNode.get('question')}</h3>
    <div className="poll">
      <ul>
        {
          pollNode.has('answers') ? pollNode.get('answers').map((answer) => (
            <li key={answer.get('_id')} className="options">
              <input type="checkbox" name="answer" value={answer.get('_id')} />
              <span />
              {answer.get('title')}
            </li>
          )) : 'No answers available'
        }
      </ul>
      {/* eslint-disable-next-line react/button-has-type */}
      <button value="VOTE">VOTE</button>
    </div>
  </div>
);

PollBlockPreview.propTypes = {
  className: PropTypes.string,
  pollNode: PropTypes.instanceOf(Message).isRequired,
};

PollBlockPreview.defaultProps = {
  className: '',
};

export default connect(selector)(PollBlockPreview);
