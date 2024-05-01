import isUndefined from 'lodash-es/isUndefined';

const sizes = {
  'image-asset': {
    '16by9': 'Widescreen - 16:9',
    '5by4': 'Horizontal - 5:4',
    '4by3': 'Horizontal - 4:3',
    '3by2': 'Horizontal - 3:2',
    '1by1': 'Square - 1:1',
    '2by3': 'Vertical - 2:3',
    '3by4': 'Vertical - 3:4',
    '4by5': 'Vertical - 4:5',
    '5by6': 'Gallery - 5:6',
    '9by16': 'Long Vertical - 9:16',
  },
};

const quality = ['xl', 'lg', 'md', 'sm', 'xs', 'xxs'];

const hasVariants = (assetId) => !isUndefined(sizes[`${assetId.type}-asset`]);

export { quality, sizes, hasVariants };

export default sizes;
