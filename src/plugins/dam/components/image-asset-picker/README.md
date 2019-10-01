# ImageAssetPicker
This component renders an image picker ( the same with ImageAssetPickerFields ) but without using the Redux Form Fields.


### Required Props
+ `onSelectImage` - Function, this is where we write some codes that will be called after user selected an image. Examples are like "closing the modal", "display an alert", etc.
+ `onToggleAssetPickerModal` - Function, called when Asset Picker Modal is toggled either by opening or closing it.


### How to Use
```jsx harmony
import ImageAssetPicker from '@triniti/cms/plugins/dam/components/image-asset-picker';
<ImageAssetPicker 
  onSelectImage={() => console.log('an image is selected')} 
  onToggleAssetPickerModal={() => console.log('asset picker modal is toggled')} 
/>
```
