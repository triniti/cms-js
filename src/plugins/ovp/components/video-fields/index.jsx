import { Card, CardBody, CardHeader, FormGroup } from '@triniti/admin-ui-plugin/components';
import { connect } from 'react-redux';
import { Field, FieldArray } from 'redux-form';
import CaptionUrlsField from '@triniti/cms/plugins/ovp/components/caption-urls-field';
import CheckboxField from '@triniti/cms/components/checkbox-field';
import DatePickerField from '@triniti/cms/components/date-picker-field';
import DocumentAssetPickerField from '@triniti/cms/plugins/dam/components/document-asset-picker-field';
import ImageAssetPickerField from '@triniti/cms/plugins/dam/components/image-asset-picker-field';
import Message from '@gdbots/pbj/Message';
import NumberField from '@triniti/cms/components/number-field';
import PicklistPickerField from '@triniti/cms/plugins/sys/components/picklist-picker-field';
import PropTypes from 'prop-types';
import React from 'react';
import Schema from '@gdbots/pbj/Schema';
import SelectField from '@triniti/cms/components/select-field';
import SlugEditor from '@triniti/cms/plugins/ncr/components/slug-editor';
import SponsorPickerField from '@triniti/cms/plugins/boost/components/sponsor-picker-field';
import TextareaField from '@triniti/cms/components/textarea-field';
import TextField from '@triniti/cms/components/text-field';
import TrinaryField from '@triniti/cms/components/trinary-field';
import TvpgRating from '@triniti/schemas/triniti/ovp/enums/TvpgRating';
import VideoAssetPickerField from '@triniti/cms/plugins/dam/components/video-asset-picker-field';
import VideoPicker from '@triniti/cms/plugins/ovp/components/video-picker-field';
import selector from './selector';

import './styles.scss';

const options = Object
  .entries(TvpgRating.getValues())
  .map((arr) => ({ label: arr[1], value: arr[0] }));

const VideoFields = ({ formName, isEditMode, schemas, mezzanine, video }) => (
  <>
    <Card>
      {!mezzanine || !mezzanine.schema().hasMixin('triniti:ovp:mixin:transcodeable')
        ? <CardHeader className="pr-2">Details</CardHeader>
        : (() => {
          const status = mezzanine.has('transcoding_status')
            ? mezzanine.get('transcoding_status').getValue()
            : 'unknown';
          return (
            <CardHeader className="pr-2 video-details-card">
              Details
              <div>
                <small className="text-uppercase status-copy mr-0 pr-0">
                  Transcoding Status:
                </small>
                <small className={`text-uppercase status-copy mr-2 transcoding-status-${status}`}>
                  {status}
                </small>
              </div>
            </CardHeader>
          );
        })()}
      <CardBody indent>
        <Field
          component={TextField}
          label="Title"
          name="title"
          placeholder="enter title"
          readOnly={!isEditMode}
          size="xlg"
        />
        <SlugEditor
          formName={formName}
          initialSlug={video.get('slug')}
          isEditMode={isEditMode}
          nodeRef={video.get('_id').toNodeRef()}
          schemas={schemas}
        />
        {schemas.node.hasMixin('triniti:curator:mixin:teaserable') && (
          <Field
            component={DatePickerField}
            label="Order Date"
            name="orderDate"
            readOnly={!isEditMode}
          />
        )}
        {schemas.node.hasMixin('gdbots:ncr:mixin:expirable') && (
          <Field
            component={DatePickerField}
            label="Expires At"
            name="expiresAt"
            readOnly={!isEditMode}
          />
        )}
        <Field
          component={TextareaField}
          label="Description"
          name="description"
          placeholder="enter description"
          readOnly={!isEditMode}
        />
        <Field
          component={ImageAssetPickerField}
          isEditMode={isEditMode}
          label="Primary Image"
          name="imageRef"
          node={video}
        />
        <Field
          component={TextField}
          label="Launch Text"
          name="launchText"
          placeholder="enter launch text"
          readOnly={!isEditMode}
        />
        <Field
          component={PicklistPickerField}
          isEditMode={isEditMode}
          label="Credit"
          name="credit"
          picklistId="video-credits"
        />
        {schemas.node.hasMixin('triniti:common:mixin:swipeable') && (
          <Field
            component={PicklistPickerField}
            isEditMode={isEditMode}
            label="Swipe"
            name="swipe"
            picklistId="video-swipes"
          />
        )}
        <Field
          component={SelectField}
          disabled={!isEditMode}
          isClearable
          label="TVPG Rating"
          name="tvpgRating"
          options={options}
        />
        <Field
          component={TextField}
          label="MPM"
          name="mpm"
          placeholder="enter MPM"
          readOnly={!isEditMode}
        />
        <Field
          component={ImageAssetPickerField}
          isEditMode={isEditMode}
          label="Poster Image"
          name="posterImageRef"
          node={video}
        />
        <Field
          component={NumberField}
          label="Duration"
          name="duration"
          placeholder="enter duration"
          readOnly={!isEditMode}
        />
        <Field
          component={TrinaryField}
          disabled={!isEditMode}
          falseText="False"
          label="Has Music"
          name="hasMusic"
          trueText="True"
        />
        <Field
          component={DocumentAssetPickerField}
          documentRef={video.get('caption_ref')}
          isEditMode={isEditMode}
          label="Caption"
          multiAssetErrorMessage="Invalid Action: Trying to upload more than one caption file."
          name="captionRef"
          node={video}
          searchDocumentsQ="-mime_type:application/pdf"
        />
        <Field
          component={CaptionUrlsField}
          label="Caption URLs"
          name="captionUrls"
          readOnly={!isEditMode}
        />
        <Field
          component={VideoAssetPickerField}
          label="Mezzanine Video Asset"
          name="mezzanineRef"
          isEditMode={isEditMode}
        />
        <Field
          component={TextField}
          label="Mezzanine URL"
          name="mezzanineUrl"
          placeholder="enter mezzanine url"
          readOnly={!isEditMode}
        />
        {!schemas.node.hasMixin('triniti:ovp.medialive:mixin:has-channel') && (
          <Field
            component={TextField}
            label="Live M3U8 URL"
            name="liveM3u8Url"
            placeholder="enter live m3u8 url"
            readOnly={!isEditMode}
          />
        )}
        <Field
          component={DatePickerField}
          label="Original Air Date"
          name="originalAirDate"
          readOnly={!isEditMode}
        />
        <div className="pb-1 d-md-inline-flex">
          <Field
            component={CheckboxField}
            name="isLive"
            label="Is Live"
            disabled={!isEditMode}
          />
          <Field
            component={CheckboxField}
            disabled={!isEditMode}
            label="Allow Comments"
            name="allowComments"
          />
          <Field
            component={CheckboxField}
            disabled={!isEditMode}
            label="Sharing Enabled"
            name="sharingEnabled"
          />
          <Field
            component={CheckboxField}
            disabled={!isEditMode}
            label="Is Full Episode"
            name="isFullEpisode"
          />
          <Field
            component={CheckboxField}
            disabled={!isEditMode}
            label="Is Promo"
            name="isPromo"
          />
        </div>
        {schemas.node.hasMixin('triniti:boost:mixin:sponsorable') && (
          <FieldArray name="sponsorRefs" component={SponsorPickerField} isEditMode={isEditMode} />
        )}
      </CardBody>
    </Card>
    <Card>
      <CardHeader>Related Videos</CardHeader>
      <CardBody indent>
        <Field
          component={CheckboxField}
          disabled={!isEditMode}
          label="Enable Recommendations"
          name="recommendationsEnabled"
        />
        <Field
          component={CheckboxField}
          disabled={!isEditMode}
          label="Show Related Videos"
          name="showRelatedVideos"
        />
        <Field
          component={TextField}
          label="Related Video Heading Override"
          name="relatedVideosHeading"
          placeholder="e.g: See also..."
          readOnly={!isEditMode}
        />
        <FormGroup>
          <FieldArray name="relatedVideoRefs" component={VideoPicker} isEditMode={isEditMode} />
        </FormGroup>
      </CardBody>
    </Card>
    <Card>
      <CardHeader>YouTube</CardHeader>
      <CardBody indent>
        <Field
          component={TextField}
          label="YouTube ID"
          name="youtubeVideoId"
          placeholder="enter youtube id..."
          readOnly={!isEditMode}
        />
        <Field
          component={TextField}
          label="Custom YouTube ID"
          name="youtubeCustomId"
          placeholder="enter custom youtube id..."
          readOnly={!isEditMode}
        />
      </CardBody>
    </Card>
  </>
);

VideoFields.propTypes = {
  formName: PropTypes.string.isRequired,
  isEditMode: PropTypes.bool,
  mezzanine: PropTypes.instanceOf(Message),
  schemas: PropTypes.objectOf(PropTypes.instanceOf(Schema)).isRequired,
  video: PropTypes.instanceOf(Message),
};

VideoFields.defaultProps = {
  isEditMode: true,
  mezzanine: null,
  video: null,
};

export default connect(selector)(VideoFields);
