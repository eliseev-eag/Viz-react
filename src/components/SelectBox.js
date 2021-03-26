import { Select } from 'antd';
import { ID_FACTORY, NAME_FACTORY } from './constants';

const OPTIONS_DEFAULT_VALUE = [];

const SelectBox = ({
  options = OPTIONS_DEFAULT_VALUE,
  optionKeyFactory = ID_FACTORY,
  optionValueFactory = ID_FACTORY,
  optionNameFactory = NAME_FACTORY,
  ...otherProps
}) => (
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
export default SelectBox;
