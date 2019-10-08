import React from 'react';
import PropTypes from 'prop-types';
import Message from '@gdbots/pbj/Message';

const PreviewComponent = ({ node }) => (
  <div role="presentation" style={{ display: 'inline' }}>
    <h3 style={{ color: node.get('stroke_color') }}>{node.get('text')}</h3>
    <div
      className="bar"
      style={{
        height: '6px',
        width: '200px',
        margin: '10px 0px 10px 6px',
        borderTop: `5px ${node.get('stroke_style') || 'solid'} ${node.get('stroke_color') || 'black'}` }}
    />
  </div>
);

PreviewComponent.propTypes = {
  node: PropTypes.instanceOf(Message),
};

PreviewComponent.defaultProps = {
  node: null,
};

export default PreviewComponent;
