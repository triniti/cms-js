import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import AssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/asset/AssetV1Mixin';
import AssetId from '@triniti/schemas/triniti/dam/AssetId';

import AssetsTable from './index';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableRow from './TableRowImage';

const onSort = sinon.spy();
const onChangeAllRows = sinon.spy();
const onPlayerCommand = sinon.spy();
const onSelectRow = sinon.spy();
const sort = 'test';
const assetSchemas = AssetV1Mixin.findAll();
const imageAssetSchema = assetSchemas[4];

const assets = [];
for (let i = 0; i < 3; i += 1) {
  assets.push(imageAssetSchema
    .createMessage()
    .set('title', `asset${i}`)
    .set('_id', AssetId.fromString(`image_jpg_20151201_cb9c3c8c5c88453b960933a59ede650${i}`))
    .set('mime_type', 'image/jpeg'));
}

test('AssetsTable', (t) => {
  const mockSelectAssetHandler = sinon.spy();
  const wrapper = shallow(<AssetsTable
    onAssetSelect={mockSelectAssetHandler}
    nodes={[]}
    onSort={onSort}
    sort={sort}
  />);

  t.equal(wrapper.find(TableHeader).length, 1, 'it should have 1 TableHeader component');
  t.equal(wrapper.find(TableBody).length, 1, 'it should have 1 TableBody component');

  t.end();
});

test('AssetsTable:TableHeader', (t) => {
  const wrapper = shallow(<TableHeader
    onSort={onSort}
    areAllChecked={false}
    onChangeAllRows={onChangeAllRows}
    sort={sort}
  />);
  t.equal(wrapper.find('th').length, 7, 'it should have 7 head columns in the header');

  t.end();
});

test('AssetsTable:TableBody', (t) => {
  const wrapper = shallow(<TableBody
    assets={assets}
    onPlayerCommand={onPlayerCommand}
    onSelectRow={onSelectRow}
  />);

  t.equal(wrapper.find('tbody').length, 1, 'it should have one tbody in the jsx');
  t.equal(wrapper.find(TableRow).length, assets.length, `it should have ${assets.length} rows in the table body`);

  t.end();
});

test('AssetsTable:TableRow', (t) => {
  const assetIndex = Math.floor(Math.random() * assets.length);
  const asset = assets[assetIndex];
  const wrapper = shallow(<TableRow
    asset={asset}
    rowIndex={assetIndex + 1}
    onSelectRow={onSelectRow}
  />);

  t.equal(wrapper.find('tr').length, 1, 'it should render one row for tbody');
  t.equal(wrapper.find('th').length, 1, 'it should render one header cell in a row');
  t.equal(wrapper.find('td').length, 6, 'it should render six table data cell in a row');

  t.end();
});
