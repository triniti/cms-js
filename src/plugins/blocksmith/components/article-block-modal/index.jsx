import { connect } from 'react-redux';
import ArticlesTable from '@triniti/cms/plugins/news/components/articles-table';
import classNames from 'classnames';
import createDelegateFactory from '@triniti/app/createDelegateFactory';
import inflection from 'inflection';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import PropTypes from 'prop-types';
import React from 'react';
import SearchArticlesSort from '@triniti/schemas/triniti/news/enums/SearchArticlesSort';
import {
  Modal,
  ModalBody,
  ScrollableContainer,
  Spinner,
} from '@triniti/admin-ui-plugin/components';

import changedDate from '../../utils/changedDate';
import changedTime from '../../utils/changedTime';
import CustomizeOptions from './CustomizeOptions';
import delegateFactory from './delegate';
import Footer from './Footer';
import Header from './Header';
import SearchBar from '../search-bar';
import selector from './selector';

const ARTICLE = 'article';
const IMAGE = 'image';

class ArticleBlockModal extends React.Component {
  static propTypes = {
    articleNode: PropTypes.instanceOf(Message),
    articleNodes: PropTypes.arrayOf(PropTypes.instanceOf(Message)).isRequired,
    articleSort: PropTypes.string,
    block: PropTypes.instanceOf(Message).isRequired,
    delegate: PropTypes.shape({
      handleClearArticleChannel: PropTypes.func.isRequired,
      handleSearchArticles: PropTypes.func.isRequired,
    }).isRequired,
    getNode: PropTypes.func.isRequired,
    imageRef: PropTypes.instanceOf(NodeRef),
    isArticleRequestFulfilled: PropTypes.bool.isRequired,
    isFreshBlock: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool,
    node: PropTypes.instanceOf(Message),
    onAddBlock: PropTypes.func.isRequired,
    onEditBlock: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
  };

  static defaultProps = {
    articleNode: null,
    articleSort: SearchArticlesSort.CREATED_AT_DESC.getValue(),
    imageRef: null,
    isOpen: false,
    node: null,
  };

  constructor(props) {
    super(props);
    const { block, imageRef, articleNode } = props;
    this.state = {
      articleQ: '',
      activeStep: 0,
      hasUpdatedDate: block.has('updated_date'),
      isAssetPickerModalOpen: false,
      isReadyToDisplay: false,
      linkText: block.get('link_text') || '',
      selectedArticleNode: articleNode || null,
      selectedImageRef: imageRef || null,
      showImage: block.get('show_image'),
      aside: block.get('aside'),
      updatedDate: block.get('updated_date', new Date()),
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeLinkText = this.handleChangeLinkText.bind(this);
    this.handleChangeQ = this.handleChangeQ.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleClearImage = this.handleClearImage.bind(this);
    this.handleDecrementStep = this.handleDecrementStep.bind(this);
    this.handleEditBlock = this.handleEditBlock.bind(this);
    this.handleIncrementStep = this.handleIncrementStep.bind(this);
    this.handleSearchArticles = this.handleSearchArticles.bind(this);
    this.handleSelectArticle = this.handleSelectArticle.bind(this);
    this.handleSelectImage = this.handleSelectImage.bind(this);
    this.handleToggleAssetPickerModal = this.handleToggleAssetPickerModal.bind(this);
  }

  componentDidMount() {
    this.handleSearchArticles();
  }

  UNSAFE_componentWillReceiveProps({ isArticleRequestFulfilled }) {
    const { isReadyToDisplay } = this.state;
    if (!isReadyToDisplay && isArticleRequestFulfilled) {
      this.setState({ isReadyToDisplay: true });
    }
  }

  componentWillUnmount() {
    const { delegate } = this.props;
    delegate.handleClearArticleChannel();
  }

  setBlock() {
    const {
      aside,
      hasUpdatedDate,
      linkText,
      selectedArticleNode,
      selectedImageRef,
      showImage,
      updatedDate,
    } = this.state;
    const { block } = this.props;
    return block.schema().createMessage()
      .set('node_ref', NodeRef.fromNode(selectedArticleNode))
      .set('show_image', !!showImage)
      .set('updated_date', hasUpdatedDate ? updatedDate : null)
      .set('image_ref', selectedImageRef || null)
      .set('link_text', linkText || null)
      .set('aside', aside);
  }

  handleAddBlock() {
    const { onAddBlock, toggle } = this.props;
    onAddBlock(this.setBlock());
    toggle();
  }

  handleChangeCheckbox({ target: { id, checked } }) {
    this.setState({ [id]: checked });
  }

  handleChangeDate(date) {
    this.setState(changedDate(date));
  }

  handleChangeLinkText({ target: { value: linkText } }) {
    this.setState({ linkText });
  }

  handleChangeQ({ target: { value: articleQ } }) {
    this.setState({ articleQ }, this.handleSearchArticles);
  }

  handleChangeTime({ target: { value: time } }) {
    this.setState(changedTime(time));
  }

  handleEditBlock() {
    const { onEditBlock, toggle } = this.props;
    onEditBlock(this.setBlock());
    toggle();
  }

  handleDecrementStep() {
    this.setState(({ activeStep }) => ({ activeStep: activeStep - 1 }));
  }

  handleIncrementStep() {
    this.setState(({ activeStep }, { block }) => ({
      activeStep: activeStep + 1,
      showImage: block.get('show_image'),
    }));
  }

  // eslint-disable-next-line react/destructuring-assignment
  handleSearchArticles(sort = this.props.articleSort) {
    const { articleQ } = this.state;
    const { delegate } = this.props;
    this.setState({ isReadyToDisplay: false }, () => {
      delegate.handleSearchArticles({ q: articleQ, sort });
    });
  }

  // nested prop is causing the lint to crash, no matter how tempting it is to remove the articleNode const declaration - don't do it yet. still confused? check out this link - https://github.com/yannickcr/eslint-plugin-react/issues/2123
  handleSelectArticle(nodeRef) {
    this.setState((prevState, { getNode }) => {
      const articleNode = getNode(nodeRef);

      return {
        selectedArticleNode: articleNode,
        selectedImageRef: articleNode.has('image_ref')
          ? articleNode.get('image_ref')
          : null,
      };
    });
  }

  handleClearImage() {
    this.setState({ selectedImageRef: null }, this.refocusModal);
  }

  handleSelectImage(selectedImageNode) {
    this.setState({ selectedImageRef: NodeRef.fromNode(selectedImageNode) });
  }

  handleToggleAssetPickerModal() {
    this.setState(({ isAssetPickerModalOpen }) => ({
      isAssetPickerModalOpen: !isAssetPickerModalOpen,
    }), () => {
      const { isAssetPickerModalOpen } = this.state;
      if (!isAssetPickerModalOpen) {
        this.refocusModal();
      }
    });
  }

  /**
   * Needs to return the focus to an element else pressing "ESC" to close the modal won't work
   */
  refocusModal() {
    this.button.focus();
  }

  render() {
    const {
      activeStep,
      articleQ,
      aside,
      hasUpdatedDate,
      isAssetPickerModalOpen,
      isReadyToDisplay,
      linkText,
      selectedArticleNode,
      selectedImageRef,
      showImage,
      updatedDate,
    } = this.state;
    const {
      articleNodes,
      articleSort,
      isFreshBlock,
      isOpen,
      node,
      toggle,
    } = this.props;

    const type = activeStep === 0 ? ARTICLE : IMAGE;

    return (
      <Modal
        autoFocus={false}
        centered
        isOpen={isOpen}
        toggle={toggle}
        size="xxl"
        keyboard={!isAssetPickerModalOpen}
      >
        <Header
          activeStep={activeStep}
          isFreshBlock={isFreshBlock}
          toggle={toggle}
        />
        <ModalBody className="p-0">
          {activeStep === 0 && (
          <SearchBar
            onChangeQ={this.handleChangeQ}
            onClick={this.handleSearchArticles}
            placeholder={`Search ${inflection.pluralize(type)}...`}
            value={articleQ}
          />
          )}
          <ScrollableContainer
            className="bg-gray-400"
            style={{ height: `calc(100vh - ${activeStep === 0 ? 212 : 167}px)` }}
          >
            {activeStep === 0 && isReadyToDisplay && !!articleNodes.length
              && (
                <ArticlesTable
                  hasCheckboxes={false}
                  nodes={articleNodes}
                  onSelectRow={this.handleSelectArticle}
                  onSort={(newSort) => this.handleSearchArticles(newSort)}
                  options={{
                    edit: false,
                    view: false,
                    openInNewTab: true,
                  }}
                  selectedRows={selectedArticleNode ? [NodeRef.fromNode(selectedArticleNode)] : []}
                  sort={articleSort}
                  striped
                />
              )}
            {activeStep === 1
              && (
                <CustomizeOptions
                  aside={aside}
                  isAssetPickerModalOpen={isAssetPickerModalOpen}
                  node={node}
                  onClearImage={this.handleClearImage}
                  onSelectImage={this.handleSelectImage}
                  onToggleAssetPickerModal={this.handleToggleAssetPickerModal}
                  onChangeDate={this.handleChangeDate}
                  onChangeTime={this.handleChangeTime}
                  hasUpdatedDate={hasUpdatedDate}
                  isImageSelected={!!selectedImageRef}
                  isArticleStep={activeStep === 0}
                  linkText={linkText}
                  block={this.setBlock()}
                  onChangeCheckBox={this.handleChangeCheckbox}
                  onChangeLinkText={this.handleChangeLinkText}
                  showImage={showImage}
                  updatedDate={updatedDate}
                />
              )}
            {isReadyToDisplay && activeStep === 0 && !articleNodes.length
              && (
                <div className="not-found-message">
                  <p>No articles found that match your search.</p>
                </div>
              )}
            {!isReadyToDisplay && activeStep === 0
              && (
                <Spinner
                  centered
                  className={classNames({ 'mt-3': activeStep === 1 })}
                  style={activeStep === 1 ? { height: 'auto' } : {}}
                />
              )}
          </ScrollableContainer>
        </ModalBody>
        <Footer
          activeStep={activeStep}
          node={node}
          innerRef={(el) => { this.button = el; }}
          onCloseUploader={this.handleCloseUploader}
          toggle={toggle}
          onDecrementStep={this.handleDecrementStep}
          onIncrementStep={this.handleIncrementStep}
          isNextButtonDisabled={(activeStep === 0 && !selectedArticleNode) || activeStep === 1}
          onAddBlock={this.handleAddBlock}
          onEditBlock={this.handleEditBlock}
          isFreshBlock={isFreshBlock}
        />
      </Modal>
    );
  }
}

export default connect(selector, createDelegateFactory(delegateFactory))(ArticleBlockModal);
