import PropTypes from 'prop-types';
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
import TableRow from './TableRow';

class ActiveEdits extends React.Component {
    static propTypes = {
      accessToken: PropTypes.string.isRequired,
      collaborationNodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
      handleUpdateCollaborations: PropTypes.func.isRequired,
      title: PropTypes.string.isRequired,
    };

    constructor(props) {
      super(props);
      this.handleRefresh = this.handleRefresh.bind(this);
      this.state = { intervalId: null, status: null };
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

    async handleRefresh() {
      const { handleUpdateCollaborations, accessToken } = this.props;
      this.setState({ status: STATUS_PENDING });
      await handleUpdateCollaborations(accessToken);
      this.setState({ status: STATUS_FULFILLED });
    }

    render() {
      const { collaborationNodes, title } = this.props;
      const { status } = this.state;

      return (
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
            {status === STATUS_PENDING ? <StatusMessage status={status} /> : (
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
                <tbody>
                  {!collaborationNodes.length && (<tr><td /><td>No Content being collaborated on.</td></tr>)}
                  {collaborationNodes.sort((a, b) => (a.schema().getCurie().getMessage() > b.schema().getCurie().getMessage() ? 1 : -1)).map((node, idx) => (
                    <TableRow node={node} idx={idx} key={node.get('_id')} />
                  ))}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      );
    }
}

export default connect(selector, delegate)(ActiveEdits);
