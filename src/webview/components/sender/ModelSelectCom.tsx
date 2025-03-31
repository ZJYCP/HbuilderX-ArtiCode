import { useRequest } from 'ahooks';
import request from '../../utils/request';
import { Select, SelectItem } from '@heroui/react';
import { useSystemStore } from '../../store';

interface ModelItem {
  id: string;
  displayName: string;
  modelName: string;
}

export default function ModelSelectCom() {
  const { providerId, setProviderId } = useSystemStore();
  const { data, loading } = useRequest(async () => {
    const res = await request({
      url: '/model-provider/simple',
    });
    console.log(res.data);
    return res.data || [];
  });

  const handleChange = (e) => {
    setProviderId(e.target.value);
  };

  return loading ? (
    <span></span>
  ) : (
    <Select
      aria-label="model-select"
      selectedKeys={[providerId]}
      onChange={handleChange}
      placeholder="选择模型"
      className="w-36"
      selectorIcon={<></>}
      classNames={{
        trigger:
          'bg-primary-600 hover:!bg-primary-800 min-h-0 h-3/2 rounded-lg',
        mainWrapper: 'border border-primary-700 rounded-lg',
        popoverContent: 'bg-primary-600 hover:!bg-primary-800',
      }}
    >
      {data?.map((model: ModelItem) => (
        <SelectItem key={model.id}>{model.displayName}</SelectItem>
      ))}
    </Select>
  );
}
