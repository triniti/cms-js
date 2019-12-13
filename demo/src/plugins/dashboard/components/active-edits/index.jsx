import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Icon,
  Table,
} from '@triniti/admin-ui-plugin/components';
import delegate from './delegate';
import selector from './selector';
import TableRow from './TableRow';

class ActiveEdits extends React.Component {
    static propTypes = {
      accessToken: PropTypes.string.isRequired, // eslint-disable-line react/forbid-prop-types
      collaborationNodes: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
      handleRequestCollaborationNodes: PropTypes.func.isRequired,
      location: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
      title: PropTypes.oneOf(['Articles', 'Non-Article Nodes']).isRequired,
    };

    constructor(props) {
      super(props);
      this.handleRequestCollabNodes = this.handleRequestCollabNodes.bind(this);
    }

    componentDidMount() {
      this.handleRequestCollabNodes();
    }

    componentDidUpdate(prevProps) {
      const { location } = this.props;
      const { location: prevLocation } = prevProps;
      /**
         * If user clicks same nav item they are already on (same pathname but different key)
         * search again to refresh results.
         */
      if (
        prevLocation.pathname === location.pathname
            && prevLocation.key !== location.key
      ) {
        this.handleRequestCollabNodes();
      }
    }

    handleRequestCollabNodes() {
      const { handleRequestCollaborationNodes, accessToken } = this.props;
      handleRequestCollaborationNodes(accessToken);
    }

    render() {
      const { collaborationNodes, title } = this.props;
      const nodeType = collaborationNodes.map((node) => node.schema().getCurie().getMessage());

      return (
        <Card shadow>
          <CardHeader className="pr-2">
            {title}
            <Button size="sm">
              <Icon
                imgSrc="refresh"
                onClick={this.handleRequestCollabNodes}
                noborder
              />
            </Button>
          </CardHeader>
          <CardBody className="pl-0 pr-0 pt-0 pb-0">
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
                {title === 'Articles' && (
                  <>
                    {nodeType.filter((n) => n === 'article').length === 0 && (<tr><td /><td>No Article Nodes Found</td></tr>)}
                    {collaborationNodes
                      .filter((node) => node.schema().getCurie().getMessage() === 'article').map((node, idx) => (
                        <TableRow node={node} idx={idx} key={node.get('_id')} />
                      ))}
                  </>
                )}
                {title === 'Non-Article Nodes' && (
                  <>
                    {nodeType.filter((n) => n !== 'article').length === 0 && (<tr><td /><td>No Non-Article Nodes Found</td></tr>)}
                    {collaborationNodes.filter((node) => node.schema().getCurie().getMessage() !== 'article').map((node, idx) => (
                      <TableRow node={node} idx={idx} key={node.get('_id')} />
                    ))}
                  </>
                )}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      );
    }
}

export default connect(selector, delegate)(ActiveEdits);
