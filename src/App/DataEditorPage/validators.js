import { isArray, isNil } from 'lodash-es';

export const required = (value) =>
  isNil(value) || value === '' || (isArray(value) && value.length === 0)
    ? 'Поле обязательно'
    : undefined;

export const dateLessThanOrEqual = (fieldName, fieldLabel) => (
  value,
  allValues,
) =>
  value.isAfter(allValues[fieldName], 'day')
    ? `Значение поля должно быть меньше чем ${fieldLabel}`
    : undefined;

export const dateMoreThanOrEqual = (fieldName, fieldLabel) => (
  value,
  allValues,
) =>
  value.isBefore(allValues[fieldName], 'day')
    ? `Значение поля должно быть больше чем ${fieldLabel}`
    : undefined;

export const moreThanOrEqual = (fieldName, fieldLabel) => (value, allValues) =>
  value < allValues[fieldName]
    ? `Значение поля должно быть больше чем ${fieldLabel}`
    : undefined;

export const lessThanOrEqual = (fieldName, fieldLabel) => (value, allValues) =>
  value > allValues[fieldName]
    ? `Значение поля должно быть меньше чем ${fieldLabel}`
    : undefined;

export const composeValidators = (...validators) => (value, allValues, meta) =>
  validators.reduce(
    (error, validator) => error || validator(value, allValues, meta),
    undefined,
  );
