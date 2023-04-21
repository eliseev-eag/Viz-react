import { useCallback, useState } from 'react';
import { debounce, identity } from 'lodash-es';
import { Field } from 'react-final-form';
import { Form, Input } from 'antd';
import { DateBox } from './DateBox';
import { SelectBox } from './SelectBox';
import { LazySelectSearch } from './LazySelectSearch';

const wrapIntoField =
  (Component) =>
  ({
    name,
    label,
    validate,
    allowNull = true,
    format = identity,
    parse = identity,
    ...otherProps
  }) => {
    return (
      <Field
        name={name}
        format={format}
        parse={parse}
        allowNull={allowNull}
        validate={validate}
      >
        {({
          input: { value, onChange, onBlur, onFocus },
          meta: { invalid, touched, error },
        }) => (
          <Form.Item
            label={label}
            validateStatus={touched && invalid ? 'error' : 'success'}
            help={touched && invalid ? error : undefined}
          >
            <Component
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              onFocus={onFocus}
              {...otherProps}
            />
          </Form.Item>
        )}
      </Field>
    );
  };

const wrapIntoDebouncedInput =
  (Component) =>
  ({
    debounceTimeout = 300,
    onChange: onChangeFormProps,
    value,
    ...otherProps
  }) => {
    const [viewValue, setViewValue] = useState(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onChangeDebounced = useCallback(
      debounce((updatedValue) => {
        onChangeFormProps(updatedValue);
      }, debounceTimeout),
      [],
    );

    const onChange = useCallback(
      ({ target: { value: newValue } }) => {
        setViewValue(newValue);
        onChangeDebounced(newValue);
      },
      [onChangeDebounced],
    );

    return <Component value={viewValue} onChange={onChange} {...otherProps} />;
  };

const WrappedInput = wrapIntoField(wrapIntoDebouncedInput(Input));

const WrappedTextArea = wrapIntoField(wrapIntoDebouncedInput(Input.TextArea));

const WrappedDateBox = wrapIntoField(DateBox);

const WrappedSelectBox = wrapIntoField(SelectBox);

const WrappedLazySelectSearch = wrapIntoField(LazySelectSearch);

export {
  WrappedInput as Input,
  WrappedTextArea as TextArea,
  WrappedDateBox as DateBox,
  WrappedSelectBox as SelectBox,
  WrappedLazySelectSearch as LazySelectSearch,
};
