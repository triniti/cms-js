import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, Card, CardBody, CardTitle, Icon } from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';

export default class PostPreview extends React.Component {
  static propTypes = {
    formName: PropTypes.string.isRequired,
    previewModal: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      previewTab: 'mobile',
    };
    this.handleToggleModal = this.handleToggleModal.bind(this);
  }

  handleToggleModal(tab) {
    this.setState(({ isModalOpen }) => ({
      isModalOpen: !isModalOpen,
      previewTab: tab || 'mobile',
    }));
  }

  render() {
    const { formName, previewModal: PreviewModal } = this.props;
    const { isModalOpen, previewTab } = this.state;

    return (
      <Card>
        <CardBody>
          <CardTitle section>Preview Article</CardTitle>
          <ButtonGroup>
            <Button
              color="text-secondary"
              id="button-mobile"
              key="button-mobile"
              onClick={() => this.handleToggleModal('mobile')}
              outline
              size="md"
            >
              <Icon imgSrc="phone-mobile" size="md" />
            </Button>
            <UncontrolledTooltip placement="top" target="button-mobile">Phone</UncontrolledTooltip>
            <Button
              color="text-secondary"
              id="button-tablet"
              key="button-tablet"
              onClick={() => this.handleToggleModal('tablet')}
              outline
              size="md"
            >
              <Icon imgSrc="tablet" size="md" style={{ transform: 'rotate(-90deg)' }} />
            </Button>
            <UncontrolledTooltip placement="top" target="button-tablet">Tablet</UncontrolledTooltip>
            <Button
              color="text-secondary"
              id="button-desktop"
              key="button-desktop"
              onClick={() => this.handleToggleModal('desktop')}
              outline
              size="md"
            >
              <Icon imgSrc="desktop" size="md" />
            </Button>
            <UncontrolledTooltip placement="top" target="button-desktop">Desktop</UncontrolledTooltip>
          </ButtonGroup>
          {
            isModalOpen
            && (
              <PreviewModal
                activeTab={previewTab}
                formName={formName}
                isOpen={isModalOpen}
                key="previewModal"
                toggle={this.handleToggleModal} // fyi arrow func here will cause constant re-render
              />
            )
          }
        </CardBody>
      </Card>
    );
  }
}
