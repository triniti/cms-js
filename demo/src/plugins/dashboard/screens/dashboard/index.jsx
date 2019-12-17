import React from 'react';
import PropTypes from 'prop-types';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import { Col, Container, Row, Screen } from '@triniti/admin-ui-plugin/components';
import TopArticles from '../../components/top-articles';
import ActiveEdits from '../../components/active-edits';

const Dashboard = ({ location, match: { params: { tab } } }) => {
  const tabs = [
    {
      to: 'news',
      text: 'news',
    },
    {
      to: 'active',
      text: 'active',
    },
  ];


  return (
    <Screen
      tabs={tabs}
      maxWidth="100%"
      title="Dashboard"
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
          {tab === 'active'
             && (
             <Row>
               <Col lg="12">
                 <ActiveEdits
                   title="Articles"
                   contentType="articles"
                 />
               </Col>
               <Col lg="12">
                 <ActiveEdits
                   title="Non-Article Nodes"
                 />
               </Col>
             </Row>
             )}
        </Container>
      )}
    />
  );
};


Dashboard.propTypes = {
  location: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Dashboard;
