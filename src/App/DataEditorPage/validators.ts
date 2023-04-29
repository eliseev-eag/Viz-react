import { isArray, isNil } from 'lodash-es';
import type { Moment } from 'moment';

type ValidatorFunc<
  T = unknown,
  A extends Record<string, unknown> = Record<string, unknown>,
> = (value: T, allValues: A) => string | undefined;

type ValidatorFuncGenerator<
  T = unknown,
  A extends Record<string, unknown> = Record<string, unknown>,
  V extends keyof A = string,
> = (fieldName: V, fieldLabel: string) => ValidatorFunc<T, A>;

export const required: ValidatorFunc = (value) =>
  isNil(value) || value === '' || (isArray(value) && value.length === 0)
    ? 'Поле обязательно'
    : undefined;

export const dateLessThanOrEqual: ValidatorFuncGenerator<Moment> =
  (fieldName, fieldLabel) => (value, allValues) =>
    value.isAfter(allValues[fieldName], 'day')
      ? `Значение поля должно быть меньше чем ${fieldLabel}`
      : undefined;

export const dateMoreThanOrEqual: ValidatorFuncGenerator<Moment> =
  (fieldName, fieldLabel) => (value, allValues) =>
    value.isBefore(allValues[fieldName], 'day')
      ? `Значение поля должно быть больше чем ${fieldLabel}`
      : undefined;

export const moreThanOrEqual: ValidatorFuncGenerator<Moment> =
  (fieldName, fieldLabel) => (value, allValues) =>
    value < allValues[fieldName]
      ? `Значение поля должно быть больше чем ${fieldLabel}`
      : undefined;

export const lessThanOrEqual: ValidatorFuncGenerator<Moment> =
  (fieldName, fieldLabel) => (value, allValues) =>
    value > allValues[fieldName]
      ? `Значение поля должно быть меньше чем ${fieldLabel}`
      : undefined;

export const composeValidators =
  <T = unknown, A extends Record<string, unknown> = Record<string, unknown>>(
    ...validators: ValidatorFunc<T, A>[]
  ): ValidatorFunc<T, A> =>
  (value, allValues) =>
    validators.reduce<string | undefined>(
      (error, validator) => error || validator(value, allValues),
      undefined,
    );
