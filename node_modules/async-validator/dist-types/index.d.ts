// Type definitions for async-validator 3.0.4
// Project: http://github.com/yiminghe/async-validator
// Definitions by: iamdhj <https://github.com/iamdhj>
// TypeScript Version: 3.6.2

export default class {
  constructor(rule: Rules);

  /**
   * Validate source
   * @param source The object to validate (required)
   * @param options An object describing processing options for the validation
   * @param callback A callback function to invoke when validation completes
   * @returns Promise
   */
  validate(
    source: ValidateSource,
    options?: ValidateOption,
    callback?: (errors: ErrorList, fields: FieldErrorList) => void,
  ): Promise<void>;
}

export type RuleType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'method'
  | 'regexp'
  | 'integer'
  | 'float'
  | 'array'
  | 'object'
  | 'enum'
  | 'date'
  | 'url'
  | 'hex'
  | 'email'
  | 'any';

export interface RuleItem {
  type?: RuleType; // default type is 'string'
  required?: boolean;
  pattern?: RegExp | string;
  min?: number; // Range of type 'string' and 'array'
  max?: number; // Range of type 'string' and 'array'
  len?: number; // Length of type 'string' and 'array'
  enum?: Array<string | number | boolean | null | undefined>; // possible values of type 'enum'
  whitespace?: boolean;
  fields?: Rules; // ignore when without required
  options?: ValidateOption;
  defaultField?: RuleItem; // 'object' or 'array' containing validation rules
  transform?: (value: any) => any;
  message?: string | (() => string);
  asyncValidator?: (
    rule: Rules,
    value: any,
    callback: (error: string | string[] | void) => void,
    source: ValidateSource,
    options: ValidateOption,
  ) => void | Promise<void>;
  validator?: (
    rule: Rules,
    value: any,
    callback: (error: string | string[] | void) => void,
    source: ValidateSource,
    options: ValidateOption,
  ) => boolean | Error | Error[];
}

export interface Rules {
  [field: string]: RuleItem | RuleItem[];
}

export interface ValidateSource {
  [field: string]: any;
}

export interface ValidateOption {
  // whether to suppress internal warning
  suppressWarning?: boolean;

  // when the first validation rule generates an error stop processed
  first?: boolean;

  // when the first validation rule of the specified field generates an error stop the field processed, 'true' means all fields.
  firstFields?: boolean | string[];
}

export interface ValidateError {
  message: string;
  field: string;
}

export type ErrorList = ValidateError[];
export interface FieldErrorList {
  [field: string]: ValidateError[];
}
