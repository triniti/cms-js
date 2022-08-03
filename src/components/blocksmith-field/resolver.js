import { lazy } from 'react';

/**
 * Gets the modal for a specific block type.
 *
 * @param {String} message - A triniti curie message e.g. code-block
 *
 * @returns {?Component} a React component that is intended to go inside a Modal
 */
export const getModalComponent = (message) => lazy(() => import(`./components/${message}-modal`));
