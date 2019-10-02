import React from 'react';
import { Field } from 'redux-form';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field';


export default (props) => (<Field name="targetRef" multi={false} component={ImageAssetPickerField} {...props} />);
