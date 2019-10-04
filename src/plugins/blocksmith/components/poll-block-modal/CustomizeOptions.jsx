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
  UncontrolledTooltip,
} from '@triniti/admin-ui-plugin/components';
import PollBlockPreview from '@triniti/cms/plugins/blocksmith/components/poll-block-preview';

const CustomizeOptions = ({
  block,
  hasUpdatedDate,
  onChangeDate: handleChangeDate,
  onChangeHasUpdatedDAte: handleChangeHasUpdatedDate,
  onChangeAside: handleChangeAside,
  onChangeTime: handleChangeTime,
  updatedDate,
  aside,
}) => (
  <div className="modal-body-blocksmith">
    <PollBlockPreview block={block} />
    <FormGroup inline className="d-flex justify-content-center form-group-mobile px-3 mb-2">
      <FormGroup className="mr-4">
        <Checkbox size="sd" checked={hasUpdatedDate} onChange={handleChangeHasUpdatedDate}>
          Is update
        </Checkbox>
        <Checkbox size="sd" checked={aside} onChange={handleChangeAside} className="ml-3">
          Aside
        </Checkbox>
        <Icon imgSrc="info-outline" id="aside-tooltip" size="xs" style={{ marginLeft: '0.3rem' }} />
        <UncontrolledTooltip key="tooltip" placement="bottom" target="aside-tooltip">Is only indirectly related to the main content.</UncontrolledTooltip>
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
  block: PropTypes.instanceOf(Message).isRequired,
  hasUpdatedDate: PropTypes.bool.isRequired,
  onChangeDate: PropTypes.func.isRequired,
  onChangeHasUpdatedDAte: PropTypes.func.isRequired,
  onChangeAside: PropTypes.func.isRequired,
  onChangeTime: PropTypes.func.isRequired,
  updatedDate: PropTypes.instanceOf(moment).isRequired,
  aside: PropTypes.bool.isRequired,
};

export default CustomizeOptions;
