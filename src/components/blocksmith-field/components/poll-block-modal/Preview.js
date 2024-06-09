import React from 'react';
import classNames from 'classnames';
import { Loading } from '@triniti/cms/components/index.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import '@triniti/cms/components/blocksmith-field/components/poll-block-modal/preview.scss';


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
