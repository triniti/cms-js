import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import TvpgRating from '@triniti/schemas/triniti/ovp/enums/TvpgRating.js';
import {
  DatePickerField,
  EnumField,
  FlatArrayField,
  SwitchField,
  TextField,
  TrinaryField
} from '@triniti/cms/components/index.js';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field/index.js';

export default function SyndicationCard(props) {
  const { node } = props;
  const schema = node.schema();

  return (
    <Card>
      <CardHeader>Syndication</CardHeader>
      <CardBody>
        <PicklistField picklist="video-shows" name="show" label="Show" />
        <EnumField enumClass={TvpgRating} name="tvpg_rating" label="TV-PG Rating" />
        <DatePickerField name="original_air_date" label="Original Air Date" />
        <SwitchField name="is_full_episode" label="Is Full Episode" />
        <SwitchField name="is_promo" label="Is Promo" />
        <TrinaryField name="has_music" label="Has Music" />
        <TextField name="mpm" label="MPM" />
        {schema.hasField('episode_highlights') && (
          <FlatArrayField name="episode_highlights" label="Episode Highlights" component={TextField} />
        )}
        {schema.hasField('xumo_enabled') && (
          <SwitchField name="xumo_enabled" label="Xumo Enabled" />
        )}
      </CardBody>
    </Card>
  );
}
