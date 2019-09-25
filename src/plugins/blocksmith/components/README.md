# Toolbar Buttons

The toolbar buttons are the buttons in the inline toolbar (the one that appears when you highlight text).

Simple (non-modal) buttons are created using [draft-js-buttons](https://github.com/draft-js-plugins/draft-js-plugins/tree/master/draft-js-buttons).

Inline style buttons (eg bold, italic, etc.) use [createInlineStyleButton](https://github.com/draft-js-plugins/draft-js-plugins/blob/master/draft-js-buttons/src/utils/createInlineStyleButton.js). Bold, italic, and underline are supported out of the box, while striketrhough are highlight require a [customStyleMap](https://draftjs.org/docs/advanced-topics-inline-styles.html) prop to be given to the Blocksmith `Editor` component. 

Block style buttons (eg ordered-list, unordered-list) use [createBlockStyleButton](https://github.com/draft-js-plugins/draft-js-plugins/blob/master/draft-js-buttons/src/utils/createBlockStyleButton.js). These toggle block types instead of styles.

Advanced buttons (eg link) are simply react components. See their READMEs for more details.

# Placeholders

The placeholders all wrap the GenericPlaceholder in `./generic-block-placeholder`, passing a config prop in for how they should render. Refer to the README in that component for more details. The config can be one of the following formats:

1. Single icon (uses admin-ui Icon)
```
const config = {
  icon: {
    imgSrc: 'code',
  },
  label: 'Code Block',
};
```

2. Double icon (uses admin-ui IconGroup)
```
const config = {
  iconGroup: {
    icons: {
      primary: {
        imgSrc: 'pencil',
      },
      secondary: {
        imgSrc: 'facebook',
      },
    },
  },
  label: 'Facebook Post Block',
};

```

3. Preview component.
```
const config = {
  preview: {
    component: ImageBlockPreview,
  },
};

```

# Sidebar Buttons

The sidebar buttons all wrap the GenericSidebarButton in `./generic-sidebar-button`, passing a config prop in for how they should render. Refer to the README in that component for more details. The config can be one of the following formats:

1. Single icon (uses admin-ui Icon)
```
const config = {
  icon: {
    imgSrc: 'code',
  },
  label: 'Code Block',
};
```

2. Double icon (uses admin-ui IconGroup)
```
const config = {
  iconGroup: {
    icons: {
      primary: {
        imgSrc: 'pencil',
      },
      secondary: {
        imgSrc: 'facebook',
      },
    },
  },
  label: 'Facebook Post Block',
};

```
