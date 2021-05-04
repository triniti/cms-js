import PropTypes from 'prop-types';
import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
} from '@triniti/admin-ui-plugin/components';

import './styles.scss';

class OuterErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
    window.onerror(error);
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    if (!hasError) {
      return children;
    }

    return (
      <Card>
        <CardHeader>
          Content
        </CardHeader>
        <CardBody indent>
          <div className="blocksmith-error-boundary outer">
            <p className="alert-danger">
              We recommend that you save, and continue working in a new tab.
              <strong>
                Please do not close this tab - support will want
                to examine it to investigate the error.
              </strong>
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default OuterErrorBoundary;
