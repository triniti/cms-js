import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_HIGH,
} from 'lexical';
import { TOGGLE_LINK_COMMAND, $isLinkNode } from '@lexical/link';
import CustomLinkNode, { $createCustomLinkNode } from '@triniti/cms/blocksmith/nodes/CustomLinkNode.js';
import { mergeRegister } from '@lexical/utils';

/**
 * Removes link from selected nodes, intelligently splitting when needed.
 */
function removeLink(nodes) {
  const linkSet = new Set();
  
  // Collect all unique link parents
  nodes.forEach((node) => {
    const parent = node.getParent();
    if ($isLinkNode(parent)) {
      linkSet.add(parent);
    }
  });

  // Process each link
  linkSet.forEach((link) => {
    const linkChildren = link.getChildren();
    const selectedInLink = nodes.filter((n) => link.isParentOf(n));
    
    // If all children selected, remove entire link
    if (linkChildren.length === selectedInLink.length) {
      linkChildren.forEach((child) => link.insertBefore(child));
      link.remove();
      return;
    }
    
    // Partial selection - determine position and split accordingly
    const selectedKeys = new Set(selectedInLink.map(n => n.getKey()));
    const firstSelectedIndex = linkChildren.findIndex(child => selectedKeys.has(child.getKey()));
    const lastSelectedIndex = linkChildren.findLastIndex(child => selectedKeys.has(child.getKey()));
    
    const isAtStart = firstSelectedIndex === 0;
    const isAtEnd = lastSelectedIndex === linkChildren.length - 1;
    
    if (isAtStart && isAtEnd) {
      // All selected (edge case)
      linkChildren.forEach((child) => link.insertBefore(child));
      link.remove();
    } else if (isAtStart) {
      // Selection at start
      selectedInLink.forEach((child) => link.insertBefore(child));
    } else if (isAtEnd) {
      // Selection at end
      for (let i = selectedInLink.length - 1; i >= 0; i--) {
        link.insertAfter(selectedInLink[i]);
      }
    } else {
      // Selection in middle - split into two links
      const trailingNodes = linkChildren.slice(lastSelectedIndex + 1);
      
      if (trailingNodes.length > 0) {
        const newLink = $createCustomLinkNode(link.getURL(), {
          target: link.getTarget(),
          rel: link.getRel(),
          title: link.getTitle(),
        });
        
        link.insertAfter(newLink);
        trailingNodes.forEach((child) => newLink.append(child));
      }
      
      selectedInLink.forEach((child) => link.insertAfter(child));
    }
  });
}

/**
 * Updates an existing link's properties.
 */
function updateLink(linkNode, urlData) {
  linkNode.setURL(urlData.url);
  if (urlData.target !== undefined) {
    linkNode.setTarget(urlData.target);
  }
  if (urlData.rel !== undefined) {
    linkNode.setRel(urlData.rel);
  }
  if (urlData.title !== undefined) {
    linkNode.setTitle(urlData.title);
  }
}

/**
 * Creates new link nodes for the selected nodes.
 */
function createLink(nodes, urlData) {
  let prevParent = null;
  let linkNode = null;

  nodes.forEach((node) => {
    const parent = node.getParent();

    // Skip if already processed or invalid
    if (
      parent === linkNode ||
      parent === null ||
      ($isElementNode(node) && !node.isInline())
    ) {
      return;
    }

    // Update existing link parent
    if ($isLinkNode(parent)) {
      linkNode = parent;
      updateLink(parent, urlData);
      return;
    }

    // Create new link node if parent changed
    if (!parent.is(prevParent)) {
      prevParent = parent;
      linkNode = $createCustomLinkNode(urlData.url, {
        rel: urlData.rel,
        target: urlData.target,
        title: urlData.title,
      });

      if ($isLinkNode(parent)) {
        if (node.getPreviousSibling() === null) {
          parent.insertBefore(linkNode);
        } else {
          parent.insertAfter(linkNode);
        }
      } else {
        node.insertBefore(linkNode);
      }
    }

    // Handle nested links
    if ($isLinkNode(node)) {
      if (node.is(linkNode)) {
        return;
      }
      if (linkNode !== null) {
        const children = node.getChildren();
        for (let i = 0; i < children.length; i++) {
          linkNode.append(children[i]);
        }
      }
      node.remove();
      return;
    }

    // Append node to link
    if (linkNode !== null) {
      linkNode.append(node);
    }
  });
}

/**
 * Finds the nearest link ancestor of a node.
 */
function getLinkAncestor(node) {
  let parent = node;
  while (parent !== null && parent.getParent() !== null) {
    if ($isLinkNode(parent)) {
      return parent;
    }
    parent = parent.getParent();
  }
  return null;
}

/**
 * Custom link plugin that handles link creation and removal with intelligent splitting.
 * Creates CustomLinkNode instances which properly handle partial link selections.
 */
export default function CustomLinkPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      // Clean up empty links automatically
      editor.registerNodeTransform(CustomLinkNode, (node) => {
        const children = node.getChildren();
        
        if (children.length === 0) {
          node.remove();
          return;
        }
        
        const hasContent = children.some((child) => {
          if ($isTextNode(child)) {
            return child.getTextContent().length > 0;
          }
          return true;
        });
        
        if (!hasContent) {
          children.forEach((child) => node.insertBefore(child));
          node.remove();
        }
      }),
      
      // Handle link creation and removal
      editor.registerCommand(
        TOGGLE_LINK_COMMAND,
        (payload) => {
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) {
              return;
            }

            const nodes = selection.extract();

            if (payload === null) {
              removeLink(nodes);
            } else {
              const urlData = typeof payload === 'string' 
                ? { url: payload } 
                : payload;

              // Try to update existing link if only one node selected
              if (nodes.length === 1) {
                const linkNode = $isLinkNode(nodes[0])
                  ? nodes[0]
                  : getLinkAncestor(nodes[0]);
                  
                if (linkNode !== null) {
                  updateLink(linkNode, urlData);
                  return;
                }
              }

              createLink(nodes, urlData);
            }
          });
          
          return true;
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [editor]);

  return null;
}
