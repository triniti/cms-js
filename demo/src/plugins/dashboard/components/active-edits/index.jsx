import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Message from '@gdbots/pbj/Message';
import { STATUS_PENDING } from '@triniti/app/constants';
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
      contentType: PropTypes.string,
      handleRequestCollaborationNodes: PropTypes.func.isRequired,
      title: PropTypes.string.isRequired,
    };

    static defaultProps = {
      contentType: null,
    };

    constructor(props) {
      super(props);
      this.handleRequestCollaborationNodes = this.handleRequestCollaborationNodes.bind(this);
      this.state = { status: null };
    }

    componentDidMount() {
      this.handleRequestCollaborationNodes();
    }

    async handleRequestCollaborationNodes() {
      const { handleRequestCollaborationNodes, accessToken } = this.props;
      this.setState({ status: STATUS_PENDING });
      await handleRequestCollaborationNodes(accessToken);
      this.setState({ status: null });
    }

    render() {
      const { collaborationNodes, contentType, title } = this.props;
      const { status } = this.state;

      const { articleNodes, otherNodes } = collaborationNodes.reduce((acc, cur) => {
        if (cur.schema().getCurie().getMessage() === 'article') {
          acc.articleNodes.push(cur);
        } else {
          acc.otherNodes.push(cur);
        }
        return acc;
      }, { articleNodes: [], otherNodes: [] });

      return (
        <Card shadow>
          <CardHeader className="pr-2">
            {title}
            <Button size="sm">
              <Icon
                imgSrc="refresh"
                onClick={this.handleRequestCollaborationNodes}
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
                    {contentType === null && (<th>Type</th>)}
                    <th />
                    <th />

                  </tr>
                </thead>
                <tbody>
                  {contentType === 'articles' && (
                    <>
                      {!articleNodes.length && (<tr><td /><td>No Articles being collaborated on</td></tr>)}
                      {articleNodes.map((node, idx) => (
                        <TableRow contentType={contentType} node={node} idx={idx} key={node.get('_id')} />
                      ))}
                    </>
                  )}
                  {contentType === null && (
                    <>
                      {!otherNodes.length && (<tr><td /><td>No Other Content being collaborated on.</td></tr>)}
                      {otherNodes.map((node, idx) => (
                        <TableRow contentType={contentType} node={node} idx={idx} key={node.get('_id')} />
                      ))}
                    </>
                  )}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      );
    }
}

export default connect(selector, delegate)(ActiveEdits);
