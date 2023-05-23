import React from 'react';
import classNames from 'classnames';
import { Loading } from 'components';
import useNode from 'plugins/ncr/components/useNode';
import './preview.scss';


const PollBlockPreview = ({ className = '', nodeRef }) => {
  const { node, pbjxError } = useNode(nodeRef, false);

  return (
    <>
      {(!node || pbjxError) && <Loading error={pbjxError} />}
      {node && (
        <div className={classNames(className, 'poll-preview', 'mb-6')} role="presentation">
          <h3>{node.get('question')}</h3>
          <div className="poll">
            <ul>
              {
                node.has('answers') ? node.get('answers').map((answer) => (
                  <li key={answer.get('_id')} className="options">
                    <input type="checkbox" name="answer" value={answer.get('_id')} />
                    <span />
                    {answer.get('title')}
                  </li>
                )) : 'No answers available'
              }
            </ul>
            <button value="VOTE">VOTE</button>
          </div>
        </div>
      )}
    </>
  )
};

export default PollBlockPreview;