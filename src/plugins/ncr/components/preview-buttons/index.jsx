import PropTypes from 'prop-types';
import React from 'react';
import Message from '@gdbots/pbj/Message';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import { Button, Card, CardBody, Icon } from '@triniti/admin-ui-plugin/components';

const PreviewButtons = ({ node }) => {
  if (!node) {
    return null;
  }

  const canonical = pbjUrl(node, 'canonical');
  const preview = pbjUrl(node, 'preview');

  return (
    <Card>
      <CardBody>
        {canonical && (
          <a
            href={canonical}
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
            target="_blank"
          >
            <Button size="md" className="mb-0" color="primary">
              <Icon imgSrc="external" alt="external" className="mr-1" />
              <span>View Permalink</span>
            </Button>
          </a>
        )}
        {preview && (
          <a
            href={preview}
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
            target="_blank"
          >
            <Button size="md" className="mb-0 ml-2" color="secondary">
              <Icon imgSrc="external" alt="external" className="mr-1" />
              <span>Preview</span>
            </Button>
          </a>
        )}
      </CardBody>
    </Card>
  );
};

PreviewButtons.propTypes = {
  node: PropTypes.instanceOf(Message),
};

PreviewButtons.defaultProps = {
  node: null,
};

export default PreviewButtons;
