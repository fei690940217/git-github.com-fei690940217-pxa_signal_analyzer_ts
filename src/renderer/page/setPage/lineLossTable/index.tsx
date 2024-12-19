import { Button, Popconfirm, InputNumber, Tooltip, message, Card } from 'antd';
import { useState, useEffect } from 'react';
import './index.scss';
import {
  DeleteOutlined,
  PlusOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import { nanoid } from 'nanoid';
import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';
import {
  electronStoreSet,
  electronStoreGetAsync,
} from '@src/renderer/utils/electronStore';
import { logError } from '@src/renderer/utils/logLevel';
import {
  LineLossInterface,
  TableList,
  ValueChangeFunction,
  LineLossKey,
} from './types';
const { ipcRenderer } = window.myApi;

const TableRow = ({
  item,
  valueChange,
  handleDelete,
}: {
  item: LineLossInterface;
  valueChange: ValueChangeFunction;
  handleDelete: (id: string) => void;
}) => {
  const { id } = item;
  return (
    <tr>
      <td>
        <InputNumber
          controls={false}
          variant="borderless"
          style={{
            width: '100%',
          }}
          value={item?.frequency}
          onChange={(value) => valueChange(value, LineLossKey.Frequency, id)}
        />
      </td>
      <td>
        <InputNumber
          controls={false}
          variant="borderless"
          style={{
            width: '100%',
          }}
          value={item?.lineLoss}
          onChange={(value) => valueChange(value, LineLossKey.LineLoss, id)}
        />
      </td>
      <td style={{ textAlign: 'center' }}>
        <Popconfirm
          title="确定删除本条数据?"
          onConfirm={() => handleDelete(id)}
        >
          <DeleteOutlined style={{ color: '#F56C6C' }} />
        </Popconfirm>
      </td>
    </tr>
  );
};
const App = () => {
  const { t, i18n } = useTranslation('setPage');
  const [messageApi, messageContextHolder] = message.useMessage();
  const [tableList, setTableList] = useState<TableList>([]);
  const init_fn = async () => {
    try {
      const tempList = await electronStoreGetAsync('spectrumLineLoss');
      if (tempList?.length) {
        setTableList(tempList);
      } else {
        setTableList([
          {
            id: nanoid(8),
            frequency: null,
            lineLoss: null,
          },
        ]);
      }
    } catch (error: any) {
      setTableList([
        {
          id: nanoid(8),
          frequency: null,
          lineLoss: null,
        },
      ]);
      logError(error.toString());
    }
  };
  useEffect(() => {
    init_fn();
  }, []);
  const handleDelete = (id: string) => {
    const newData = tableList.filter((item) => item.id !== id);
    setTableList(newData);
    electronStoreSet('spectrumLineLoss', newData);
  };
  const valueChange: ValueChangeFunction = (value, key, id) => {
    let tempList: TableList = cloneDeep(tableList);
    tempList.forEach((obj) => {
      if (obj.id === id) {
        obj[key] = value;
      }
    });
    setTableList(tempList);
    electronStoreSet('spectrumLineLoss', tempList);
  };
  //添加条目
  const handleAdd = () => {
    const newData = {
      id: nanoid(8),
      frequency: null,
      lineLoss: null,
    };
    let tempList = [...tableList, newData];
    setTableList(tempList);
    electronStoreSet('spectrumLineLoss', tempList);
  };
  //上传线损表
  const uploadLineLoss = async () => {
    let rst = await ipcRenderer.invoke('showOpenDialog');
    const { type, value, msg } = rst;
    if (type === 'success') {
      if (value?.length) {
        //找到基站线损表,表格sheetList
        const findItem = value.find((item: any) => {
          return item.name === '频谱线损';
        });
        const { data } = findItem;
        const filterData = data.filter((_item: any, index: number) => {
          return index > 0;
        });
        const reg = /^(\-|\+)?\d+(\.\d+)?$/;
        const flag = filterData.every((sup: any) => {
          return sup.every((sub: any) => {
            return reg.test(sub);
          });
        });
        if (flag) {
          const result = filterData.map(
            ([frequency, lineLoss]: [number, number]) => {
              return {
                id: nanoid(8),
                frequency: parseFloat(frequency.toFixed(2)),
                lineLoss: parseFloat(lineLoss.toFixed(2)),
              };
            },
          );
          setTableList(result);
          electronStoreSet('spectrumLineLoss', result);
        } else {
          messageApi.warning(t('formatError'));
        }
      } else {
        messageApi.warning('No Data');
      }
    } else if (type === 'error') {
      messageApi.error(msg);
    }
  };
  return (
    <Card
      className="spectrum-config-wrapper"
      styles={{
        header: {
          minHeight: 36,
          lineHeight: '36px',
        },
      }}
      title="频谱线损"
      extra={
        <Button
          size="small"
          type="link"
          icon={<CloudUploadOutlined />}
          onClick={uploadLineLoss}
        >
          {/* 上传线损表 */}
          {t('uploadLineLossTable')}
        </Button>
      }
    >
      <div className="spectrum-line-loss-wrapper">
        {messageContextHolder}
        <table border={1} style={{ width: '100%' }} className="line-loss-table">
          <thead>
            <tr>
              <th>{`${t('frequency')} (MHz)`}</th>
              <th>{`${t('lineLoss')} (dB)`}</th>
              <th style={{ width: 60, textAlign: 'center' }}>del</th>
            </tr>
          </thead>
          <tbody>
            {tableList.map((item) => {
              return (
                <TableRow
                  item={item}
                  key={item.id}
                  handleDelete={handleDelete}
                  valueChange={valueChange}
                ></TableRow>
              );
            })}
          </tbody>
        </table>
        <div>
          <Tooltip title={t('insert')}>
            <Button
              onClick={handleAdd}
              type="link"
              icon={<PlusOutlined />}
            ></Button>
          </Tooltip>
        </div>
      </div>
    </Card>
  );
};
export default App;
