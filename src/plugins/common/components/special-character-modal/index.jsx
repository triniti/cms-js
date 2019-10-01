import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from '@triniti/admin-ui-plugin/components';
import classNames from 'classnames'; import React from 'react';
import PropTypes from 'prop-types';
import emojis from 'config/emojis'; // eslint-disable-line import/no-unresolved
import './styles.scss';

export default class SpecialCharacterModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func.isRequired,
    onSelectSpecialCharacter: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isOpen: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeEmojiName: null,
      selectedEmojiName: null,
    };
    this.handleMouseEnterEmoji = this.handleMouseEnterEmoji.bind(this);
    this.handleMouseLeaveEmoji = this.handleMouseLeaveEmoji.bind(this);
    this.handleSelectEmoji = this.handleSelectEmoji.bind(this);
    this.handleSelectSpecialCharacter = this.handleSelectSpecialCharacter.bind(this);
  }

  handleMouseEnterEmoji(emojiName) {
    this.setState(() => ({ activeEmojiName: emojiName }));
  }

  handleMouseLeaveEmoji() {
    this.setState(() => ({ activeEmojiName: null }));
  }

  handleSelectEmoji(emojiName) {
    this.setState(({ selectedEmojiName }) => ({
      activeEmojiName: emojiName,
      selectedEmojiName: emojiName === selectedEmojiName ? null : emojiName,
    }));
  }

  handleSelectSpecialCharacter() {
    const { onSelectSpecialCharacter, toggle } = this.props;
    const { selectedEmojiName } = this.state;
    onSelectSpecialCharacter(emojis[selectedEmojiName]);
    toggle();
  }

  render() {
    const { activeEmojiName, selectedEmojiName } = this.state;
    const { isOpen, toggle } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Insert Special Character</ModalHeader>
        <ModalBody>
          <div className="emoji-option-wrapper pt-3 pl-3 pr-3">
            {Object.entries(emojis).map(([name, emoji]) => (
              <div
                className={classNames('emoji-option ml-1 mr-1 pl-2 pr-2', { selected: name === selectedEmojiName })}
                key={name}
                onClick={() => this.handleSelectEmoji(name)}
                onMouseEnter={() => this.handleMouseEnterEmoji(name)}
                onMouseLeave={() => this.handleMouseLeaveEmoji(name)}
                role="presentation"
              >
                {emoji}
              </div>
            ))}
          </div>
          <div className="emoji-info-wrapper pl-3 pr-3">
            <div className="emoji-info p-3">
              {(activeEmojiName || selectedEmojiName) && (
                <span className="mr-2">{emojis[activeEmojiName || selectedEmojiName]}</span>
              )}
              <span className="emoji-info--name">{activeEmojiName || selectedEmojiName || 'none selected'}</span>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={toggle}>Cancel</Button>
          <Button
            disabled={!selectedEmojiName}
            onClick={this.handleSelectSpecialCharacter}
          >
          Add
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
