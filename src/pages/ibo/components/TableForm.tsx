
import { randomString } from '@/utils/tool';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Table, message, InputNumber, Select, AutoComplete } from 'antd';
import type { FC, ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';

import styles from '../style.less';
import { getBatchOptions, getMaterialOptions, getInventoryStatus, valueForNoBatch } from '@/services/matl';

import type { IMaterialInfo } from '@/models/matl';
import type { IEditInboundLineInfo } from '@/models/ibo';

const { Option } = AutoComplete;

type IEditInboundLineInfoEx = IEditInboundLineInfo & {
  key: string;
  isNew?: boolean;
  editable?: boolean;
  description: string;
  batchEnabled: boolean;
  qty?: number;
};

interface TableFormProps {
  value?: IEditInboundLineInfoEx[];
  inboundOrderCode: string;
  onChange?: (value: IEditInboundLineInfoEx[]) => void;
  onIsEditingLineChanged: (value: boolean) => void;
}

const TableForm: FC<TableFormProps> = ({ value, onChange, onIsEditingLineChanged }) => {
  const [lines, setLines] = useState<IEditInboundLineInfoEx[]>(value || []);
  const [linesBackup, setLinesBackup] = useState<IEditInboundLineInfoEx[]>();

  const [materialOptions, setMaterialOptions] = useState<IMaterialInfo[]>([]);
  const [batchOptions, setBatchOptions] = useState<{ value: string }[]>([]);
  const [statusOptions, setStatusOptions] = useState<{ value: string, label: ReactNode }[]>([]);


  async function changeLine(lineToChange: IEditInboundLineInfoEx, props: Partial<IEditInboundLineInfoEx>) {
    const temp = {
      ...lineToChange,
      ...props,
    };
    const arr = lines.map(x => x === lineToChange ? temp : x);
    setLines(arr);

    return arr;
  }

  useEffect(() => {
    const one = lines?.some(x => x.editable);
    onIsEditingLineChanged(one);
  }, [lines, onIsEditingLineChanged]);

  useEffect(() => {
    setLines(value ?? [])
  }, [value]);

  const loadMaterialOptions = debounce(async (keyword: string) => {
    const res = await getMaterialOptions({
      keyword,
      limit: 10,
      inStockOnly: false,
      materialType: ''
    });
    setMaterialOptions(res.data || []);
  }, 300);

  const loadBatchOptions = debounce(async (val: any, record: IEditInboundLineInfo) => {
    const res = await getBatchOptions({
      keyword: val,
      materialCode: record.materialCode ?? '',
      inventoryStatus: record.inventoryStatus,
      limit: 10
    });
    setBatchOptions(res.data?.map(x => { return { value: x } }) || []);
  }, 300);

  const loadInventoryStatusOptions = debounce(async () => {
    const res = await getInventoryStatus();
    const tempOption = res.data?.map(x => { return { label: x.displayName, value: x.inventoryStatus } })
    setStatusOptions(tempOption || [])
  }, 300);

  useEffect(() => {
    loadInventoryStatusOptions()
  }, []);


  const deleteLine = async (line: IEditInboundLineInfoEx) => {
    let arr;
    if (line.inboundLineId && line.inboundLineId > 0) {
      arr = await changeLine(line, { op: 'delete' });
    }
    else {
      arr = lines.filter((item) => item !== line) as IEditInboundLineInfoEx[];
      setLines(arr);
    }

    if (onChange) {
      onChange(arr);
    }
  };
  const undeleteLine = async (line: IEditInboundLineInfoEx) => {
    // ?????????????????????edit??????
    const arr = await changeLine(line, { op: 'edit' });
    if (onChange) {
      onChange(arr);
    }
  }


  const acceptLine = async (lineToEdit: IEditInboundLineInfoEx) => {
    if (!lineToEdit.materialCode || !lineToEdit.inventoryStatus || !lineToEdit.uom || !lineToEdit.quantityExpected) {
      message.error('??????????????????????????????');
      return;
    }
    const newLines = await changeLine(lineToEdit, { isNew: undefined, editable: false });
    setLinesBackup(undefined);
    if (onChange) {
      onChange(newLines);
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'inboundLineId',
      key: 'inboundLineId',
      width: '3%',
    },
    {
      title: '????????????',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: '12%',
      render: (text: string, record: IEditInboundLineInfoEx) => {
        if (record.editable) {
          return (
            <AutoComplete
              disabled={!!record.inboundLineId}
              value={text}
              autoFocus
              filterOption={false}
              dropdownMatchSelectWidth={350}
              onFocus={() => loadMaterialOptions(record.materialCode || '')}
              onChange={async val => {
                const materialInfo = materialOptions.find(x => x.materialCode === val);
                await changeLine(record, {
                  materialCode: val,
                  description: materialInfo?.description || '',
                  batchEnabled: materialInfo?.batchEnabled,
                  batch: materialInfo?.batchEnabled ? '' : valueForNoBatch,
                  uom: materialInfo?.uom,
                });
              }}
              onSearch={loadMaterialOptions}
              placeholder="????????????"
            >
              {materialOptions.map(x => (
                <Option
                  key={x.materialId}
                  value={x.materialCode}>

                  <div>
                    ?????????{x.materialCode}
                  </div>
                  <div>
                    ?????????{x.description}
                  </div>
                  <div>
                    ?????????{x.specification}
                  </div>

                </Option>)
              )}
            </AutoComplete>
          );
        }
        if (record.op === 'delete') {
          return (<span className={styles.deleterow}>{text}</span>)
        }
        return text;
      },
    },
    {
      title: '????????????',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '??????',
      dataIndex: 'batch',
      key: 'batch',
      width: '10%',
      render: (text: string, record: IEditInboundLineInfoEx) => {
        if (record.editable) {
          return (
            <AutoComplete
              disabled={!!record.inboundLineId || !record.batchEnabled}
              options={batchOptions}
              value={text}
              onFocus={() => { loadBatchOptions(record.batch, record) }}
              onChange={async val => {
                await changeLine(record, { batch: val });
              }}
              onSearch={(val) => { loadBatchOptions(val, record) }}
              placeholder="??????????????????"
            />
          );
        }
        if (record.op === 'delete') {
          return (<span className={styles.deleterow}>{text}</span>)
        }
        return text;
      },
    },
    {
      title: '????????????',
      dataIndex: 'inventoryStatus',
      key: 'inventoryStatus',
      width: '8%',
      render: (text: string, record: IEditInboundLineInfoEx) => {
        if (record.editable) {
          return (
            <Select
              defaultValue={statusOptions.find(x => x.value === record.inventoryStatus)}
              showSearch
              disabled={!!record.inboundLineId}
              labelInValue
              filterOption={false}
              placeholder="????????????"
              onSearch={loadInventoryStatusOptions}
              onChange={async (val) => {
                await changeLine(record, { inventoryStatus: val.value });
              }}
              options={statusOptions} />
          );
        }
        if (record.op === 'delete') {
          return (<span className={styles.deleterow}>{text}</span>)
        }
        return text;
      },
    },
    {
      title: '????????????',
      dataIndex: 'uom',
      key: 'uom',
      width: '8%',
      render: (text: string, record: IEditInboundLineInfoEx) => {
        if (record.op === 'delete') {
          return (<span className={styles.deleterow}>{text}</span>)
        }
        return text;
      },
    },
    {
      title: '????????????',
      dataIndex: 'quantityExpected',
      key: 'quantityExpected',
      width: '10%',
      render: (text: number, record: IEditInboundLineInfoEx) => {
        if (record.editable) {
          return (
            <>
              <InputNumber
                value={text}
                min={0}
                onFocus={() => {
                  if (!record.qty) {
                    changeLine(record, {});
                  }
                }}
                onChange={(e) => changeLine(record, { quantityExpected: parseFloat(e?.toString() || '0') || 0 })}
                placeholder="????????????"
              />
            </>
          );
        }
        if (record.op === 'delete') {
          return (<span className={styles.deleterow}>{text}</span>)
        }
        return text;
      },
    },

    {
      title: '??????',
      dataIndex: 'comment',
      key: 'comment',
      width: '20%',
      render: (text: string, record: IEditInboundLineInfoEx) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={(e) => changeLine(record, { comment: e.target.value })}
              // onKeyPress={(e) => handleKeyPress(e, record.key)}
              placeholder="??????"
            />
          );
        }
        if (record.op === 'delete') {
          return (<span className={styles.deleterow}>{text}</span>)
        }
        return text;
      },
    },
    {
      title: '??????',
      key: 'action',
      render: (text: string, record: IEditInboundLineInfoEx) => {
        if (record.editable) {
          if (record.isNew) {
            return (
              <span>
                <a onClick={async () => await acceptLine(record)}>??????</a>
                <Divider type="vertical" />
                <a onClick={async () => deleteLine(record)}>??????</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={async () => await acceptLine(record)}>??????</a>
              <Divider type="vertical" />
              <a onClick={() => {
                setLines(linesBackup || []);
                setLinesBackup(undefined);
              }}>??????</a>
            </span>
          );
        }
        if (record.op === 'delete') {
          return (
            <span>
              <a onClick={async () => undeleteLine(record)}>????????????</a>

            </span>
          );
        }
        return (
          <span>
            <a onClick={() => {
              if (lines.filter(x => x.editable).length === 1) {
                message.warning('?????????????????????????????????');
                return;
              }
              setLinesBackup(lines);
              changeLine(record, { editable: true });
            }}>??????</a>
            <Divider type="vertical" />
            <a onClick={async () => deleteLine(record)}>??????</a>
          </span>
        );
      },
    },
  ];

  return (
    <>
      <Table<IEditInboundLineInfoEx>
        columns={columns}
        dataSource={lines}
        pagination={false}
        rowClassName={(record) => (record.editable ? styles.editable : '')}
      />
      {!lines.some(x => x.editable) &&
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={() => {
            const arr = lines.concat([{
              key: `NEW_TEMP_ID_${randomString(10)}`,
              op: 'add',
              inboundLineId: 0,
              materialCode: '',
              batch: '',
              inventoryStatus: '',
              uom: '',
              quantityExpected: 0,
              comment: '',
              editable: true,
              isNew: true,
              description: '',
              batchEnabled: true,
              qty: 0,
            }]);
            setLines(arr);
          }}
        >
          <PlusOutlined />
        ????????????
      </Button>
      }
    </>
  );
};

export default TableForm;
