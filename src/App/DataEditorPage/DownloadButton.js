import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import {
  eventsSelector,
  eventTypesSelector,
  personsSelector,
  toponymsSelector,
} from 'selectors';

const DownloadButton = ({ filename = 'events.json' }) => {
  const events = useSelector(eventsSelector);
  const eventTypes = useSelector(eventTypesSelector);
  const persons = useSelector(personsSelector);
  const toponyms = useSelector(toponymsSelector);

  const content = JSON.stringify({
    events,
    eventTypes,
    toponyms,
    persons,
  });

  return (
    <Button
      data-id="export-button"
      download={filename}
      href={URL.createObjectURL(
        new Blob([content], { type: 'application/json' }),
      )}
    >
      <DownloadOutlined />
      Export to json
    </Button>
  );
};

export default DownloadButton;
