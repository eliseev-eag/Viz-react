// @ts-nocheck
import { useCallback, useMemo, useState } from 'react';
import { debounce, uniq } from 'lodash-es';
import { Select } from 'antd';
import { ID_FACTORY, NAME_FACTORY } from './constants';

const DEFAULT_VALUE = [];

export const LazySelectSearch = ({
  allOptions,
  value = DEFAULT_VALUE,
  onChange,
  placeholder,
  count = 5,
  optionKeyFactory = ID_FACTORY,
  optionValueFactory = ID_FACTORY,
  optionNameFactory = NAME_FACTORY,
  ...selectProps
}) => {
  const [filteredOptions, setFilteredOptions] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSearch = useCallback(
    debounce((inputValue) => {
      setFilteredOptions(
        allOptions.filter((option) =>
          optionNameFactory(option)
            .toLowerCase()
            .includes(inputValue.toLocaleLowerCase()),
        ),
      );
    }, 300),
    [allOptions],
  );

  const onBlur = useCallback(() => {
    setFilteredOptions([]);
  }, []);

  const onChangeHandler = useCallback(
    (newValue) => {
      setFilteredOptions([]);
      onChange(newValue);
    },
    [onChange],
  );

  const mappedValues = useMemo(
    () => value.map((v) => allOptions.find((p) => optionValueFactory(p) === v)),
    [allOptions, value, optionValueFactory],
  );

  const options = useMemo(
    () =>
      filteredOptions.length
        ? filteredOptions.slice(0, count)
        : uniq([...allOptions.slice(0, count), ...mappedValues]),
    [allOptions, count, filteredOptions, mappedValues],
  );
  const hidedOptionsCount = useMemo(
    () =>
      filteredOptions.length
        ? filteredOptions.length - count
        : allOptions.length - options.length,
    [allOptions, count, filteredOptions, options.length],
  );

  return (
    <Select
      {...selectProps}
      placeholder={placeholder}
      mode="multiple"
      filterOption={false}
      onSearch={onSearch}
      onChange={onChangeHandler}
      onBlur={onBlur}
      value={value}
    >
      {options.map((option) => (
        <Select.Option
          key={optionKeyFactory(option)}
          value={optionValueFactory(option)}
        >
          {optionNameFactory(option)}
        </Select.Option>
      ))}
      {hidedOptionsCount > 0 && (
        <Select.Option
          key="__hidedOptionsCount__"
          value="__hidedOptionsCount__"
          disabled
        >
          Еще {hidedOptionsCount} вариантов
        </Select.Option>
      )}
    </Select>
  );
};
