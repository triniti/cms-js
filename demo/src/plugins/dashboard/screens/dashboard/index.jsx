import React from 'react';
import PropTypes from 'prop-types';
import ActiveEdits from '@triniti/cms/plugins/raven/components/active-edits-table';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import { Col, Container, Row, Screen } from '@triniti/admin-ui-plugin/components';
import TopArticles from '../../components/top-articles';

const Dashboard = ({ location, match: { params: { tab } } }) => (
  <Screen
    tabs={[
      {
        to: 'news',
        text: 'news',
      },
      {
        to: 'active-edits',
        text: 'active edits',
      },
    ]}
    maxWidth="100%"
    title="Dashboard"
    // NOTE: temporary fix until admin-ui solution for no breadcrumbs
    breadcrumbs={{ length: null }}
    body={(
      <Container fluid className="dashboard">
        { tab === 'news'
             && (
             <Row>
               <Col lg="6">
                 <TopArticles
                   location={location}
                   title="Homepage Published"
                   search={{ count: 40, status: NodeStatus.PUBLISHED, slotting_key: 'home' }}
                 />
               </Col>
               <Col lg="6">
                 <TopArticles
                   location={location}
                   title="Homepage Draft"
                   search={{ count: 10, status: NodeStatus.DRAFT, q: '+is_homepage_news:true' }}
                 />
               </Col>
             </Row>
             )}
        {tab === 'active-edits'
             && (
             <Row>
               <Col lg="12">
                 <ActiveEdits title="Active Edits" />
               </Col>
             </Row>
             )}
      </Container>
      )}
  />
);
Dashboard.propTypes = {
  location: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  match: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default Dashboard;
