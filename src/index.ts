export default class SchemaChecker {
  private _mandatorySchema?: Record<string, any>;
  private _nonMandatorySchema?: Record<string, any>;

  constructor(
      mandatorySchema?: Record<string, any>,
      nonMandatorySchema?: Record<string, any>,
  ) {
    this._mandatorySchema = mandatorySchema;
    this._nonMandatorySchema = nonMandatorySchema;
  }

  isHavePayload(payload: any) {
    if (!payload) {
      throw new Error(`NO_PAYLOAD`);
    }
  }

  isPayloadHaveMandatoryField(payload: any) {
    if (!this._mandatorySchema) {
      return;
    }

    const fields = Object.keys(payload);
    Object.keys(this._mandatorySchema).forEach((mandatoryField) => {
      if (!fields.includes(mandatoryField)) {
        throw new Error('NOT_CONTAIN_MANDATORY_FIELD');
      }
    });
  }

  isPayloadHaveAppropriateSchema(payload: any) {
    this._checkMandatoryField(payload);
    this._checkNonMandatoryField(payload);
  }

  private _checkMandatoryField(payload: any) {
    if (!this._mandatorySchema) {
      return;
    }

    const schema = this._mandatorySchema;
    Object.keys(schema).forEach((field) => {
      const isCorrectType = this._isCorrectType(payload[field], schema[field]);
      const isCorrectInstance =
        this._isCorrectInstance(payload[field], schema[field]);

      if (!(isCorrectType || isCorrectInstance)) {
        throw new Error('DATA_TYPE_NOT_MATCH');
      }
    });
  }

  private _checkNonMandatoryField(payload: any) {
    if (!this._nonMandatorySchema) {
      return;
    }

    const schema = this._nonMandatorySchema;
    Object.keys(schema).forEach((field) => {
      const isCorrectType = this._isCorrectType(payload[field], schema[field]);
      const isCorrectInstance =
        this._isCorrectInstance(payload[field], schema[field]);
      const isUndefined = this._isUndefined(payload[field]);

      if (!(isCorrectType || isCorrectInstance || isUndefined)) {
        throw new Error('DATA_TYPE_NOT_MATCH');
      }
    });
  }

  private _isCorrectType(val: any, schema: any) {
    return typeof schema === 'string' && typeof val === schema;
  }

  private _isCorrectInstance(val: any, schema: any) {
    return typeof schema !== 'string' && val instanceof schema;
  }

  private _isUndefined(val: any) {
    return typeof val === 'undefined';
  }
}
