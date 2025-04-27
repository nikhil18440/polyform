// schemas/schema.test.js

import { validateSchema } from '../app/validator.js';

describe("Schema Validator", () => {
  
  it("should validate a correct schema", () => {
    const validSchema = {
      type: "Form",
      props: {},
      children: [
        { type: "TextField", props: {}, children: [] },
        { type: "Button", props: {}, children: [] },
      ],
    };
    expect(() => validateSchema(validSchema)).not.toThrow();
  });

  it("should throw error if 'type' is missing", () => {
    const invalidSchema = {
      props: {},
      children: [],
    };
    expect(() => validateSchema(invalidSchema)).toThrow(/Missing or invalid "type"/);
  });

  it("should throw error if 'type' is unknown", () => {
    const invalidSchema = {
      type: "UnknownType",
      props: {},
      children: [],
    };
    expect(() => validateSchema(invalidSchema)).toThrow(/Unknown component type/);
  });

  it("should throw error if 'props' is missing", () => {
    const invalidSchema = {
      type: "Form",
      children: [],
    };
    expect(() => validateSchema(invalidSchema)).toThrow(/Missing or invalid "props"/);
  });

  it("should throw error if 'children' is not an array", () => {
    const invalidSchema = {
      type: "Form",
      props: {},
      children: { type: "TextField" }, // ❌ not an array
    };
    expect(() => validateSchema(invalidSchema)).toThrow(/"children" must be an array/);
  });

  it("should validate deeply nested valid schema", () => {
    const validSchema = {
      type: "Form",
      props: {},
      children: [
        {
          type: "Form",
          props: {},
          children: [
            { type: "TextField", props: {}, children: [] }
          ],
        },
      ],
    };
    expect(() => validateSchema(validSchema)).not.toThrow();
  });

});
