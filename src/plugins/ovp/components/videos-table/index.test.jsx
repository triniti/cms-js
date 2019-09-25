import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import VideoMixin from '@triniti/schemas/triniti/ovp/mixin/video/VideoV1Mixin';
import VideosTable from './index';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableRow from './TableRow';

const videoSchema = VideoMixin.findOne();

const videos = [];
for (let i = 0; i < 3; i += 1) {
  videos.push(videoSchema.createMessage().set('title', `video${i}`));
}

const onSelectRow = sinon.spy();
const onChangeAllRows = sinon.spy();
const onSort = sinon.spy();
const sort = 'fake-sort';

test('VideosTable', (t) => {
  const mockSelectVideoHandler = sinon.spy();
  const wrapper = shallow(<VideosTable
    onVideoSelect={mockSelectVideoHandler}
    onSelectRow={onSelectRow}
    onSort={onSort}
    onChangeAllRows={onChangeAllRows}
    sort={sort}
  />);

  t.equal(wrapper.find(TableHeader).length, 1, 'it should have 1 TableHeader component');
  t.equal(wrapper.find(TableBody).length, 1, 'it should have 1 TableBody component');

  t.end();
});

test('VideosTable:TableHeader', (t) => {
  const wrapper = shallow(<TableHeader
    onChangeAllRows={onChangeAllRows}
    onSort={onSort}
    sort={sort}
  />);

  t.equal(wrapper.find('th').length, 5, 'it should have 5 head columns in the header');

  t.end();
});

test('VideosTable:TableBody', (t) => {
  const selectVideoHandler = sinon.spy();
  const wrapper = shallow(<TableBody
    videos={videos}
    onVideoSelect={selectVideoHandler}
    onSelectRow={onSelectRow}
    onSort={onSort}
    onChangeAllRows={onChangeAllRows}
    sort={sort}
  />);
  t.equal(wrapper.find('tbody').length, 1, 'it should have one tbody in the jsx');
  t.equal(wrapper.find(TableRow).length, videos.length, `it should have ${videos.length} rows in the table body`);

  t.end();
});

test('VideosTable:TableRow', (t) => {
  const videoIndex = Math.floor(Math.random() * videos.length);
  const video = videos[videoIndex];
  const wrapper = shallow(<TableRow
    hasCheckboxes
    video={video}
    onSelectRow={onSelectRow}
    onChangeAllRows={onChangeAllRows}
  />);

  t.equal(wrapper.find('tr').length, 1, 'it should render one row for tbody');
  t.equal(wrapper.find('th').length, 1, 'it should render one header cell in a row');
  t.equal(wrapper.find('td').length, 4, 'it should render 4 table data cell in a row');

  t.end();
});
