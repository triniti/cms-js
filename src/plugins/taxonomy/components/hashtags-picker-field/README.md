# Hashtags Picker Field
This component is used as component prop inside of a Redux Form field. This will render an input where 
users can enter hashtags of a node (ex. Articles). The main behavior of this component is the auto-suggest
capability where as the user types, suggested hashtags will be displayed on a dropdown and available for his/her picking.

### Props
+ `label` - type String. This is optional and defaults to "hashtag".
+ `placeholder` - type String. This is optional and defaults to "Start typing...". This will be shown when there's nothing entered yet.
+ `isEditMode` - type Boolean. This is optional and defaults to `false`. If false, the component is in disabled/read-only state and vice-versa if true.


                   
### How to Use?
Example usage

```jsx harmony
import HashtagsPickerField from '@triniti/cms/plugins/taxonomy/components/hashtags-picker-field';
<Card>
    <CardHeader>Demo</CardHeader>
    <CardBody indent>
      { schemas.node.hasMixin('triniti:taxonomy:mixin:hashtaggable') &&
        <Field name="hashtags" component={HashtagsPickerField} disabled={!isEditMode} />
      }
      <Field name="relatedPeople" component={SelectField} disabled={!isEditMode} label="Related People" multi closeOnSelect={false} />
    </CardBody>
</Card>
```
