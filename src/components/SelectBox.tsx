import { Select, SelectProps } from 'antd';
import { ID_FACTORY, NAME_FACTORY } from './constants';

type SelectBoxProps<T extends object> = {
  options: T[];
  optionKeyFactory: (value: T) => string;
  optionValueFactory: (value: T) => string;
  optionNameFactory: (value: T) => string;
} & SelectProps;

export const SelectBox = <T extends object>({
  options = [],
  optionKeyFactory = ID_FACTORY,
  optionValueFactory = ID_FACTORY,
  optionNameFactory = NAME_FACTORY,
  ...otherProps
}: SelectBoxProps<T>) => (
  <Select {...otherProps}>
    {options.map((option) => (
      <Select.Option
        key={optionKeyFactory(option)}
        value={optionValueFactory(option)}
      >
        {optionNameFactory(option)}
      </Select.Option>
    ))}
  </Select>
);
