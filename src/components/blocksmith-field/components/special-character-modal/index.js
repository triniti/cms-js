import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import classNames from 'classnames';
import React, { useState } from 'react';
import emojis from '@triniti/app/config/emojis.js';
import '@triniti/cms/components/blocksmith-field/components/special-character-modal/styles.scss';

export default function SpecialCharacterModal(props) {
  const { isOpen, onSelectSpecialCharacter, toggle } = props;

  const [activeEmojiName, setActiveEmojiName] = useState(null);
  const [selectedEmojiName, setSelectedEmojiName] = useState(null);

  const handleSelectEmoji = (emojiName) => {
    setActiveEmojiName(emojiName);
    setSelectedEmojiName(emojiName === selectedEmojiName ? null : emojiName);
  };

  const handleSelectSpecialCharacter = () => {
    onSelectSpecialCharacter(emojis[selectedEmojiName]);
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Insert Special Character</ModalHeader>
      <div className="modal-scrollable">
        <ModalBody>
          <div className="emoji-option-wrapper">
            {Object.entries(emojis).map(([name, emoji]) => (
              <div
                className={classNames('emoji-option', { selected: name === selectedEmojiName })}
                key={name}
                onClick={() => handleSelectEmoji(name)}
                onMouseEnter={() => setActiveEmojiName(name)}
                onMouseLeave={() => setActiveEmojiName(null)}
                role="presentation"
              >
                {emoji}
              </div>
            ))}
          </div>
          <div className="emoji-info-wrapper ps-3 pe-3">
            <div className="emoji-info p-3">
              {(activeEmojiName || selectedEmojiName) && (
                <span className="me-2">{emojis[activeEmojiName || selectedEmojiName]}</span>
              )}
              <span className="emoji-info--name">{activeEmojiName || selectedEmojiName || 'none selected'}</span>
            </div>
          </div>
        </ModalBody>
      </div>
      <ModalFooter>
        <Button
          onClick={toggle}
          color="light"
        >
          Cancel
        </Button>
        <Button
          disabled={!selectedEmojiName}
          onClick={handleSelectSpecialCharacter}
          color="success"
        >
          Add
        </Button>
      </ModalFooter>
    </Modal>
  );
}
