import React from 'react';
import PropTypes from 'prop-types';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import { Col, Container, Row, Screen } from '@triniti/admin-ui-plugin/components';
import TopArticles from '../../components/top-articles';

const Dashboard = ({ location }) => (
  <Screen
    header="Dashboard"
    maxWidth="100%"
    title="Dashboard"
    body={(
      <Container fluid className="dashboard">
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
      </Container>
    )}
  />
);

Dashboard.propTypes = {
  location: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default Dashboard;
