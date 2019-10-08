import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Message from '@gdbots/pbj/Message';
import {
  Checkbox,
  DatePicker,
  FormGroup,
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
} from '@triniti/admin-ui-plugin/components';
import PollBlockPreview from '@triniti/cms/plugins/blocksmith/components/poll-block-preview';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';

const CustomizeOptions = ({
  aside,
  block,
  hasUpdatedDate,
  onChangeCheckBox: handleChangeCheckbox,
  onChangeDate: handleChangeDate,
  onChangeTime: handleChangeTime,
  updatedDate,
}) => (
  <div className="modal-body-blocksmith">
    <PollBlockPreview block={block} />
    <FormGroup inline className="d-flex justify-content-center form-group-mobile px-3 mb-2">
      <FormGroup className="mr-4">
        <Checkbox size="sd" id="hasUpdatedDate" checked={hasUpdatedDate} onChange={handleChangeCheckbox}>
          Is update
        </Checkbox>
        <Checkbox size="sd" id="aside" checked={aside} onChange={handleChangeCheckbox} className="ml-3">
          Aside
        </Checkbox>
        <Icon imgSrc="info-outline" id="aside-tooltip" size="xs" className="ml-1" />
        <UncontrolledTooltip target="aside-tooltip">Is only indirectly related to the main content.</UncontrolledTooltip>
      </FormGroup>
    </FormGroup>
    {
      hasUpdatedDate
      && (
        <FormGroup>
          <Label>
            Updated Time: {updatedDate.format('YYYY-MM-DD hh:mm A')}
          </Label>
          <FormGroup className="mb-3 mt-1 shadow-none">
            <DatePicker
              onChange={handleChangeDate}
              selected={updatedDate}
              shouldCloseOnSelect={false}
              inline
            />
            <InputGroup style={{ width: '15rem', margin: 'auto' }}>
              <InputGroupAddon addonType="prepend" className="text-dark">
                <InputGroupText>
                  <Icon imgSrc="clock-outline" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type="time"
                onChange={handleChangeTime}
                defaultValue={updatedDate.format('HH:mm')}
              />
            </InputGroup>
          </FormGroup>
        </FormGroup>
      )
    }
  </div>
);

CustomizeOptions.propTypes = {
  aside: PropTypes.bool.isRequired,
  block: PropTypes.instanceOf(Message).isRequired,
  hasUpdatedDate: PropTypes.bool.isRequired,
  onChangeCheckBox: PropTypes.func.isRequired,
  onChangeDate: PropTypes.func.isRequired,
  onChangeTime: PropTypes.func.isRequired,
  updatedDate: PropTypes.instanceOf(moment).isRequired,
};

export default CustomizeOptions;
