import type { IEditOutboundLineInfo } from '@/models/obo';
import { randomString } from '@/utils/tool';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Table, message, InputNumber, Select, AutoComplete, Spin } from 'antd';
import type { FC, ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';

import styles from '../style.less';
import { getBatchOptions, getMaterialOptions, getInventoryStatus } from '@/services/matl';
import { getAvailableQuantity } from '@/services/obo';
import type { IMaterialInfo } from '@/models/matl';

const { Option } = AutoComplete;

interface TableFormProps {
  value?: IEditOutboundLineInfo[];
  outboundOrderCode: string;
  onChange?: (value: IEditOutboundLineInfo[]) => void;
  onIsEditingLineChanged: (value: boolean) => void;
}

const TableForm: FC<TableFormProps> = ({ value, outboundOrderCode, onChange, onIsEditingLineChanged }) => {
  const [loading, setLoading] = useState(false);
  const [lines, setLines] = useState<IEditOutboundLineInfo[]>(value || []);
  const [linesBackup, setLinesBackup] = useState<IEditOutboundLineInfo[]>();

  const [materialOptions, setMaterialOptions] = useState<IMaterialInfo[]>([]);
  const [batchOptions, setBatchOptions] = useState<{ value: string }[]>([]);
  const [statusOptions, setStatusOptions] = useState<{ value: string, label: ReactNode }[]>([]);


  async function changeLine(lineToChange: IEditOutboundLineInfo, props: Partial<IEditOutboundLineInfo>, loadQty: boolean) {
    const temp = {
      ...lineToChange,
      ...props,
    };
    let arr = lines.map(x => x === lineToChange ? temp : x);
    setLines(arr);

    if (loadQty) {
      const lineWithQty = await loadAvailableQuantity(temp);
      arr = arr.map(x => x === temp ? lineWithQty : x);
      setLines(arr);
    }

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
      inStockOnly: true,
      materialType: ''
    });
    setMaterialOptions(res.data || []);
  }, 300);

  const loadBatchOptions = debounce(async (val: any, record: IEditOutboundLineInfo) => {
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


  const deleteLine = async (line: IEditOutboundLineInfo) => {
    let arr;
    if (line.outboundLineId && line.outboundLineId > 0) {
      arr = await changeLine(line, { op: 'delete' }, false);
    }
    else {
      arr = lines.filter((item) => item !== line) as IEditOutboundLineInfo[];
      setLines(arr);
    }

    if (onChange) {
      onChange(arr);
    }
  };
  const undeleteLine = async (line: IEditOutboundLineInfo) => {
    // ?????????????????????edit??????
    const arr = await changeLine(line, { op: 'edit' }, false);
    if (onChange) {
      onChange(arr);
    }
  }

  async function loadAvailableQuantity(target: IEditOutboundLineInfo) {
    setLoading(true);
    const qty = await getAvailableQuantity({
      materialCode: target.materialCode,
      inventoryStatus: target.inventoryStatus,
      batch: target.batch,
      outboundOrderCode,
    });
    setLoading(false);
    return { ...target, qty: qty || 0 };
  }

  const acceptLine = async (lineToEdit: IEditOutboundLineInfo) => {
    if (!lineToEdit.materialCode || !lineToEdit.inventoryStatus || !lineToEdit.uom || !lineToEdit.quantityDemanded) {
      message.error('??????????????????????????????');
      return;
    }
    const newLines = await changeLine(lineToEdit, { isNew: undefined, editable: false }, false);
    setLinesBackup(undefined);
    if (onChange) {
      onChange(newLines);
    }
  }

  // const handleKeyPress = (e: React.KeyboardEvent, key: string) => {
  //   if (e.key === 'Enter') {
  //     accept(e, key);
  //   }
  // };


  const columns = [
    {
      title: 'ID',
      dataIndex: 'outboundLineId',
      key: 'outboundLineId',
      width: '3%',
    },
    {
      title: '????????????',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: '12%',
      render: (text: string, record: IEditOutboundLineInfo) => {
        if (record.editable) {
          return (
            <AutoComplete
              allowClear
              disabled={!!record.outboundLineId}
              value={text}
              autoFocus
              filterOption={false}
              onFocus={() => loadMaterialOptions(record.materialCode || '')}
              onChange={async val => {
                const materialInfo = materialOptions.find(x => x.materialCode === val);
                await changeLine(record, {
                  materialCode: val,
                  description: materialInfo?.description || '',
                  uom: materialInfo?.uom,
                }, true);
              }}
              onSearch={loadMaterialOptions}
              placeholder="????????????????????????"
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
      render: (text: string, record: IEditOutboundLineInfo) => {
        if (record.editable) {
          return (
            <AutoComplete
              disabled={!!record.outboundLineId}
              options={batchOptions}
              value={text}
              onFocus={() => { loadBatchOptions(record.batch, record) }}
              onChange={async val => {
                await changeLine(record, { batch: val }, true);
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
      render: (text: string, record: IEditOutboundLineInfo) => {
        if (record.editable) {
          return (
            <Select
              defaultValue={statusOptions.find(x => x.value === record.inventoryStatus)}
              showSearch
              disabled={!!record.outboundLineId}
              labelInValue
              filterOption={false}
              placeholder="????????????"
              onSearch={loadInventoryStatusOptions}
              onChange={async (val) => {
                await changeLine(record, { inventoryStatus: val.value }, true);
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
      render: (text: string, record: IEditOutboundLineInfo) => {
        if (record.op === 'delete') {
          return (<span className={styles.deleterow}>{text}</span>)
        }
        return text;
      },
    },
    {
      title: '????????????',
      dataIndex: 'quantityDemanded',
      key: 'quantityDemanded',
      width: '10%',
      render: (text: number, record: IEditOutboundLineInfo) => {
        if (record.editable) {
          return (
            <>
              <InputNumber
                value={text}
                min={0}
                onFocus={() => {
                  if (!record.qty) {
                    changeLine(record, {}, true);
                  }
                }}
                onChange={(e) => changeLine(record, { quantityDemanded: parseFloat(e?.toString() || '0') || 0 }, false)}
                // onKeyPress={(e) => handleKeyPress(e, record.key)}
                placeholder="????????????"
              />

              <Spin spinning={loading} size='small'>?????????{record.qty}</Spin>
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
      render: (text: string, record: IEditOutboundLineInfo) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={(e) => changeLine(record, { comment: e.target.value }, false)}
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
      render: (text: string, record: IEditOutboundLineInfo) => {
        if (!!record.editable && loading) {
          return null;
        }
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
              changeLine(record, { editable: true }, false);
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
      <Table<IEditOutboundLineInfo>
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
              outboundLineId: 0,
              materialCode: '',
              batch: '',
              inventoryStatus: '',
              uom: '',
              quantityDemanded: 0,
              comment: '',
              editable: true,
              isNew: true,
              description: '',
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
