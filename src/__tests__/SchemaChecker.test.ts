import SchemaChecker from '../index';

describe('Schema Checker', () => {
  /**
   * Test Cases:
   * - Should throw an error when no payload given
   * - Should throw an error when a payload doesn't have mandatory field
   * - Should throw an error when a payload doesn't meet the appropriate
   *   schema (data type)
   * - Should not throw an error when a payload have all mandatory field and
   *   have appropriate schema
   */
  class ContactPerson {
    private _name: string;
    private _phoneNumber: string;

    constructor(name: string, phoneNumber: string) {
      this._name = name;
      this._phoneNumber = phoneNumber;
    }

    get name(): string {
      return this._name;
    }

    get phoneNumber(): string {
      return this._phoneNumber;
    }
  }

  describe(`When the schema have mandatory field and
    non-mandatory field`, () => {
    const mandatorySchema = {
      username: 'string',
      password: 'string',
    };

    const nonMandatorySchema = {
      contactPerson: ContactPerson,
    };

    it('Should throw an error when no payload given', () => {
      const schemaChecker =
        new SchemaChecker(mandatorySchema, nonMandatorySchema);
      expect(() => schemaChecker.isHavePayload(null))
          .toThrowError('NO_PAYLOAD');
    });

    it(`Should throw an error when a payload doesn't have
      mandatory field`, () => {
      const payload = {
        username: 'bpkcongli',
      };

      const schemaChecker =
        new SchemaChecker(mandatorySchema, nonMandatorySchema);
      expect(() => schemaChecker.isHavePayload(payload))
          .not.toThrowError();
      expect(() => schemaChecker.isPayloadHaveMandatoryField(payload))
          .toThrowError('NOT_CONTAIN_MANDATORY_FIELD');
    });

    it(`Should throw an error when a mandatory field doesn't meet the 
      appropriate schema (data type)`, () => {
      const payload = {
        username: 'bpkcongli',
        password: 123456,
      };

      const schemaChecker =
        new SchemaChecker(mandatorySchema, nonMandatorySchema);
      expect(() => schemaChecker.isHavePayload(payload))
          .not.toThrowError();
      expect(() => schemaChecker.isPayloadHaveMandatoryField(payload))
          .not.toThrowError();
      expect(() => schemaChecker.isPayloadHaveAppropriateSchema(payload))
          .toThrowError('DATA_TYPE_NOT_MATCH');
    });

    it(`Should throw an error when a non-mandatory field doesn't meet the 
      appropriate schema (data type)`, () => {
      const payload = {
        username: 'bpkcongli',
        password: 'supersecret',
        contactPerson: {
          name: 'Andrian',
          phoneNumber: '081234567890',
        },
      };

      const schemaChecker =
        new SchemaChecker(mandatorySchema, nonMandatorySchema);
      expect(() => schemaChecker.isHavePayload(payload))
          .not.toThrowError();
      expect(() => schemaChecker.isPayloadHaveMandatoryField(payload))
          .not.toThrowError();
      expect(() => schemaChecker.isPayloadHaveAppropriateSchema(payload))
          .toThrowError('DATA_TYPE_NOT_MATCH');
    });

    it(`Should not throw an error when a payload have all mandatory field and
      have appropriate schema`, () => {
      const payload = {
        username: 'bpkcongli',
        password: 'supersecret',
        contactPerson: new ContactPerson('Andrian', '081234567890'),
      };

      const schemaChecker =
        new SchemaChecker(mandatorySchema, nonMandatorySchema);
      expect(() => schemaChecker.isHavePayload(payload))
          .not.toThrowError();
      expect(() => schemaChecker.isPayloadHaveMandatoryField(payload))
          .not.toThrowError();
      expect(() => schemaChecker.isPayloadHaveAppropriateSchema(payload))
          .not.toThrowError();
    });
  });

  describe(`When the schema doesn't have mandatory field, just have 
    non-mandatory field`, () => {
    const nonMandatorySchema = {
      username: 'string',
      password: 'string',
    };

    it(`Should not throw an error when a payload have 
      appropriate schema`, () => {
      const payload = {
        username: 'bpkcongli',
        password: 'supersecret',
      };

      const schemaChecker = new SchemaChecker(undefined, nonMandatorySchema);
      expect(() => schemaChecker.isHavePayload(payload))
          .not.toThrowError();
      expect(() => schemaChecker.isPayloadHaveMandatoryField(payload))
          .not.toThrowError();
      expect(() => schemaChecker.isPayloadHaveAppropriateSchema(payload))
          .not.toThrowError();
    });
  });

  describe(`When the schema just have mandatory field, doesn't have 
    non-mandatory field`, () => {
    const mandatorySchema = {
      username: 'string',
      password: 'string',
    };

    it(`Should not throw an error when a payload have all mandatory field and
      have appropriate schema`, () => {
      const payload = {
        username: 'bpkcongli',
        password: 'supersecret',
      };

      const schemaChecker = new SchemaChecker(mandatorySchema);
      expect(() => schemaChecker.isHavePayload(payload))
          .not.toThrowError();
      expect(() => schemaChecker.isPayloadHaveMandatoryField(payload))
          .not.toThrowError();
      expect(() => schemaChecker.isPayloadHaveAppropriateSchema(payload))
          .not.toThrowError();
    });
  });
});
