import React from 'react';
import PropTypes from 'prop-types';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import { Col, Container, Row, Screen } from '@triniti/admin-ui-plugin/components';
import TopArticles from '../../components/top-articles';
import ActiveEdits from '../../components/active-edits';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.renderTabs = this.renderTabs.bind(this);
  }

  renderTabs() {
    const tabs = [
      'news',
      'active',
    ];

    return tabs
      .map((tabItem) => ({
        to: `${tabItem}`,
        text: (tabItem).replace(/-/g, ' '),
      }));
  }

  render() {
    const { location } = this.props;
    const { match: { params: { tab } } } = this.props;

    return (
      <Screen
        header="Dashboard"
        tabs={this.renderTabs()}
        maxWidth="100%"
        title="Dashboard"
        getTab={this.getTab}
        body={(
          <Container fluid className="dashboard">
            {tab !== 'active'
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
               <Col lg="6">
                 <ActiveEdits
                   location={location}
                   title="Articles"
                 />
               </Col>
               <Col lg="6">
                 <ActiveEdits
                   location={location}
                   title="Non-Article Nodes"
                 />
               </Col>
             </Row>
             )}
          </Container>
        )}
      />
    );
  }
}

Dashboard.propTypes = {
  location: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Dashboard;
