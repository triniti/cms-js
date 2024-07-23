import isArray from 'lodash-es/isArray.js';
import ObjectSerializer from '@gdbots/pbj/serializers/ObjectSerializer.js';
import AssertionFailed from '@gdbots/pbj/exceptions/AssertionFailed.js';
import InvalidResolvedSchema from '@gdbots/pbj/exceptions/InvalidResolvedSchema.js';
import MessageResolver from '@gdbots/pbj/MessageResolver.js';
import { PBJ_FIELD_NAME } from '@gdbots/pbj/Schema.js';
import SchemaId from '@gdbots/pbj/SchemaId.js';

let opt = {};

export default class FormMarshaler extends ObjectSerializer {
  /**
   * @param {Message} message
   * @param {Object}  options
   *
   * @returns {Object}
   *
   * @throws {GdbotsPbjException}
   */
  static marshal(message, options = {}) {
    opt = options;
    const schema = message.schema();
    if (!opt.skipValidation) {
      message.validate();
    }
    const payload = {};

    for (const field of schema.getFields()) {
      const fieldName = field.getName();
      const type = field.getType();

      if (!message.has(fieldName)) {
        //payload[fieldName] = null;
        continue;
      }

      const value = message.get(fieldName);

      if (field.isASingleValue()) {
        payload[fieldName] = type.encode(value, field, this);
        continue;
      }

      if (field.isAMap()) {
        payload[fieldName] = [];
        for (const k of Object.keys(value)) {
          payload[fieldName].push({ key: k, value: type.encode(value[k], field, this) });
        }
        continue;
      }

      payload[fieldName] = value.map(v => type.encode(v, field, this)).filter(v => v !== null & v !== undefined);
    }

    // Headline fragments
    if (schema.hasMixin('triniti:news:mixin:headline-fragments')) {
      if (!payload.hf) {
        payload.hf = (new Array(3)).fill('');
        payload.hf_styles = ['uppercase', 'uppercase', 'uppercase'];
        payload.hf_sizes = [3, 1, 1];
      }
    }

    return payload;
  }

  /**
   * @param {Object} obj
   * @param {Object} options
   *
   * @returns {Message}
   *
   * @throws {GdbotsPbjException}
   */
  static async unmarshal(obj, options = {}) {
    opt = options;
    const schemaId = SchemaId.fromString(obj[PBJ_FIELD_NAME]);
    const message = opt.message || new (await MessageResolver.resolveId(schemaId));
    if (opt.message) {
      delete opt.message;
    }

    const schema = message.schema();

    if (schema.getCurieMajor() !== schemaId.getCurieMajor()) {
      throw new InvalidResolvedSchema(schema, schemaId);
    }

    // Headline fragments
    if (schema.hasMixin('triniti:news:mixin:headline-fragments')) {
      obj.hf = obj.hf.map((item) => {
        if (!item) {
          return '';
        }
        return item;
      });
    }

    for (const fieldName of Object.keys(obj)) {
      if (!schema.hasField(fieldName)) {
        continue;
      }

      const value = obj[fieldName];
      if (value === undefined || value === null) {
        message.clear(fieldName);
        continue;
      }

      const field = schema.getField(fieldName);
      const type = field.getType();

      if (field.isASingleValue()) {
        message.set(fieldName, await type.decode(value, field, this));
        continue;
      }

      if (field.isASet() || field.isAList()) {
        if (!isArray(value)) {
          throw new AssertionFailed(`Field [${fieldName}] must be an array.`);
        }

        const values = [];
        for (const v of value) {
          if (v === undefined || v === null) {
            continue;
          }
          values.push(await type.decode(v, field, this));
        }

        if (field.isASet()) {
          message.addToSet(fieldName, values);
        } else {
          message.addToList(fieldName, values);
        }

        continue;
      }

      for (const v of value) {
        message.addToMap(fieldName, v.key, await type.decode(v.value, field, this));
      }
    }

    return message.set(PBJ_FIELD_NAME, schema.getId().toString()).populateDefaults();
  }

  /**
   * @param {Message} message
   * @param {Field} field
   *
   * @returns {Object}
   */
  static encodeMessage(message, field) {
    return this.marshal(message, opt);
  }

  /**
   * @param {Object} value
   * @param {Field} field
   *
   * @returns {Message}
   */
  static async decodeMessage(value, field) {
    return this.unmarshal(value, opt);
  }
}
