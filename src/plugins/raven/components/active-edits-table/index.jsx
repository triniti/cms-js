import PropTypes from 'prop-types';
import noop from 'lodash-es/noop';
import React from 'react';
import { connect } from 'react-redux';
import Message from '@gdbots/pbj/Message';
import { STATUS_FULFILLED, STATUS_PENDING } from '@triniti/app/constants';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Icon,
  StatusMessage,
  Table,
} from '@triniti/admin-ui-plugin/components';
import delegate from './delegate';
import selector from './selector';
import TableBody from './TableBody';

class ActiveEditsTable extends React.Component {
    static propTypes = {
      accessToken: PropTypes.string.isRequired,
      collaborationNodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
      handleUpdateCollaborations: PropTypes.func.isRequired,
      title: PropTypes.string,
    };

    static defaultProps = {
      title: 'Active Edits',
    }

    constructor(props) {
      super(props);
      this.handleMouseLeave = this.handleMouseLeave.bind(this);
      this.handleMouseOver = this.handleMouseOver.bind(this);
      this.handleRefresh = this.handleRefresh.bind(this);
      this.state = { intervalId: null, isHover: false, status: null };
    }

    componentDidMount() {
      const { handleUpdateCollaborations, accessToken } = this.props;
      handleUpdateCollaborations(accessToken);
      const intervalId = setInterval(() => {
        handleUpdateCollaborations(accessToken);
      }, 5000);
      this.setState({ intervalId });
    }

    componentWillUnmount() {
      const { intervalId } = this.state;
      clearInterval(intervalId);
    }

    handleMouseLeave() {
      this.setState({ isHover: false });
    }

    handleMouseOver() {
      this.setState({ isHover: true });
    }

    async handleRefresh() {
      const { handleUpdateCollaborations, accessToken } = this.props;
      this.setState({ status: STATUS_PENDING });
      await handleUpdateCollaborations(accessToken);
      this.setState({ status: STATUS_FULFILLED });
    }

    render() {
      const { collaborationNodes, title } = this.props;
      const { isHover, status } = this.state;

      return (
        <div
          onFocus={noop}
          onMouseLeave={this.handleMouseLeave}
          onMouseOver={this.handleMouseOver}
        >
          <Card shadow>
            <CardHeader className="pr-2">
              {title}
              <Button size="sm">
                <Icon
                  imgSrc="refresh"
                  onClick={this.handleRefresh}
                  noborder
                />
              </Button>
            </CardHeader>
            <CardBody className="pl-0 pr-0 pt-0 pb-0">
              {status === STATUS_PENDING && <StatusMessage status={status} />}
              <Table className="table-stretch table-sm" borderless hover responsive>
                <thead>
                  <tr>
                    <th style={{ width: '1px' }} />
                    <th>Title</th>
                    <th />
                    <th>Type</th>
                    <th />
                  </tr>
                </thead>
                <TableBody isHover={isHover} nodes={collaborationNodes} status={status} />
              </Table>
            </CardBody>
          </Card>
        </div>
      );
    }
}

export default connect(selector, delegate)(ActiveEditsTable);
