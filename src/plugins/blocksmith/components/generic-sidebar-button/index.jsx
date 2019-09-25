import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, IconGroup } from '@triniti/admin-ui-plugin/components';
import './styles.scss';

const GenericSidebarButton = ({
  config,
  message,
  onClick: handleClick,
  replaceRegEx,
}) => (
  <div role="presentation" onMouseDown={(e) => e.preventDefault()}>
    <Button outline onClick={handleClick}>
      <span className="icon-holder">
        {[
          config.icon
          && (
          <Icon
            alert
            alt={message.replace(/-/g, ' ')}
            border
            className="mt-2 mb-1"
            color="black"
            imgSrc={config.icon.imgSrc}
            key="icon"
            src={config.icon.src}
            radius="rounded"
            size="xxl"
          />
          ),
          config.iconGroup
          && (
          <IconGroup left key="iconGroup" className="mt-2 mb-1">
            <Icon
              alert
              border
              imgSrc={config.iconGroup.icons.primary.imgSrc}
              radius="rounded"
              size="xxl"
              src={config.iconGroup.icons.primary.src}
            />
            <Icon
              imgSrc={config.iconGroup.icons.secondary.imgSrc}
              alert
              size="xs"
              src={config.iconGroup.icons.secondary.src}
            />
          </IconGroup>
          ),
        ]}
      </span>
      <span> { message.replace(replaceRegEx, '').replace(/(-|\s+)/g, ' ') } </span>
    </Button>
  </div>
);

GenericSidebarButton.propTypes = {
  config: PropTypes.oneOfType([
    PropTypes.shape({
      icon: PropTypes.shape({
        imgSrc: PropTypes.string,
      }),
      label: PropTypes.string,
    }),
    PropTypes.shape({
      iconGroup: PropTypes.shape({
        icons: PropTypes.shape({
          primary: PropTypes.shape({
            imgSrc: PropTypes.string,
          }),
          secondary: PropTypes.shape({
            imgSrc: PropTypes.string,
          }),
        }),
      }),
      label: PropTypes.string,
    }),
    PropTypes.shape({
      preview: PropTypes.func,
    }),
  ]),
  message: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  replaceRegEx: PropTypes.instanceOf(RegExp).isRequired,
};

GenericSidebarButton.defaultProps = {
  config: {
    icon: {
      imgSrc: 'full-screen',
    },
  },
};

export default GenericSidebarButton;
