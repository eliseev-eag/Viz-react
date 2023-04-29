import { DatePicker } from 'antd';

const DEFAULT_DATE_FORMAT = 'DD.MM.YYYY';

export const DateBox = ({
  dateFormat = DEFAULT_DATE_FORMAT,
  ...otherProps
}) => <DatePicker format={dateFormat} {...otherProps} />;
