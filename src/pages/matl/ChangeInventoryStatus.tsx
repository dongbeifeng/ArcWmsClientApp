import React, { useEffect, useRef } from 'react';
import { Form, Input, Button, Card, Spin, AutoComplete, Select, Affix, Row, Col, Alert } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useState } from 'react';
import type { IBizTypeInfo, IChangeInventoryStatusUnitloadItemInfo, IGetUnitloadItemsToChangeInventoryStatusArgs, IMaterialInfo, IUnitloadItemListArgs } from '@/models/matl';
import { debounce, first, join, sumBy } from 'lodash';
import { changeInventoryStatus, getBatchOptions, getBizTypes, getMaterialOptions, getUnitloadItemsToChangeInventoryStatus } from '@/services/matl';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { handleAction } from '@/utils/myUtils';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const formTailLayout = {
  wrapperCol: { offset: 8 },
};

export default () => {

  const [form] = Form.useForm<IGetUnitloadItemsToChangeInventoryStatusArgs>();

  const [loading, setLoading] = useState(false);
  const [materialOptions, setMaterialOptions] = useState<IMaterialInfo[]>([]);
  const [bizTypes, setBizTypes] = useState<IBizTypeInfo[]>([]);
  const [batchOptions, setBatchOptions] = useState<{ value: string }[]>([]);
  const actionRef = useRef<ActionType>();
  const [dataSource, setDataSource] = useState<IChangeInventoryStatusUnitloadItemInfo[]>([]);
  const [selectedItems, setSelectedItems] = useState<IChangeInventoryStatusUnitloadItemInfo[]>([]);



  const loadItemsToChangeInventoryStatus = async (values: any) => {
    setLoading(true);
    try {
      const res = await getUnitloadItemsToChangeInventoryStatus(values);
      setDataSource(res.data ?? []);
      if (actionRef.current?.clearSelected) {
        actionRef.current.clearSelected();
      }
    } finally {
      setLoading(false);
    }
  }

  const loadMaterialOptions = debounce(async (keyword: string) => {
    const res = await getMaterialOptions({
      keyword,
      limit: 10,
      inStockOnly: true,
      materialType: ''
    });
    setMaterialOptions(res.data || []);
  }, 300);


  const loadBatchOptions = debounce(async (val: any) => {
    const fvalue = form.getFieldsValue();
    const res = await getBatchOptions({
      keyword: val,
      materialCode: fvalue.materialCode ?? '',
      inventoryStatus: bizTypes.find(x => x.bizType === fvalue?.bizType)?.issuingInventoryStatus,
      limit: 10
    });
    setBatchOptions(res.data?.map(x => { return { value: x } }) || []);
  }, 300);

  useEffect(() => {
    getBizTypes('StatusChanging').then(res => {
      setBizTypes(res.data || []);
    });
  }, []);

  const columns: ProColumns<IChangeInventoryStatusUnitloadItemInfo>[] = [
    {
      title: '?????????',
      dataIndex: 'palletCode',
      copyable: true,
      search: false,
    },
    {
      title: '????????????',
      dataIndex: 'locationCode',
      search: false,
      renderText: (_, record) => join([record.locationCode, record.streetletCode].filter(x => !!x), ', '),
    },


    {
      title: '????????????',
      dataIndex: 'inventoryStatus',
      search: false,
    },
    {
      title: '??????',
      dataIndex: 'quantity',
      search: false,
    },
    {
      title: '??????',
      dataIndex: 'uom',
      search: false,
    },
    {
      title: '????????????',
      dataIndex: 'reasonWhyInventoryStatusCannotBeChanged',
      search: false,
    },
  ];

  return (
    <PageContainer>
      <Card bordered={false}>
        <Spin spinning={loading}>
          <Row gutter={24}>
            <Col span={10}>

              <Form
                {...formItemLayout}
                form={form}
                name="??????????????????"
                onFinish={loadItemsToChangeInventoryStatus}
                autoComplete="off"
                initialValues={{
                  requestType: '',
                  locationCode: '',
                  palletCode: '',
                  weight: 0,
                  height: 0,
                  additionalInfo: [],
                }}
              >
                <Affix offsetTop={24}>


                  <Form.Item
                    name="bizType"
                    label="????????????"
                    rules={[{ required: true, message: '?????????????????????' }]}
                  >
                    <Select allowClear={true}>
                      {
                        bizTypes.map(x => (
                          <Select.Option
                            key={x.bizType}
                            value={x.bizType}>
                            {x.displayName}
                          </Select.Option>
                        ))
                      }
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="materialCode"
                    label="????????????"
                    rules={[{ required: true, message: '?????????????????????' }]}
                  >
                    <AutoComplete placeholder="?????????????????????"
                      options={materialOptions.map(x => ({ value: x.materialCode }))}
                      onChange={async val => {
                        const materialInfo = materialOptions.find(x => x.materialCode === val);
                        if (materialInfo) {
                          form.setFieldsValue({
                            description: materialInfo.description,
                            specification: materialInfo.specification,
                            materialCode: materialInfo.materialCode,
                            materialType: materialInfo.materialType,
                          })
                        }
                        else {
                          form.setFieldsValue({
                            description: '',
                            specification: '',
                            materialType: '',
                            // materialCode: '',
                          })
                        }

                      }}
                      onFocus={() => loadMaterialOptions('')}
                      onSearch={loadMaterialOptions}
                    />
                  </Form.Item>

                  <Form.Item
                    name="materialType"
                    label="????????????"
                  >
                    <Input disabled />
                  </Form.Item>

                  <Form.Item
                    name="description"
                    label="??????"
                  >
                    <Input disabled />
                  </Form.Item>

                  <Form.Item
                    name="specification"
                    label="??????"
                  >
                    <Input disabled />
                  </Form.Item>

                  <Form.Item
                    name="batch"
                    label="??????"
                    rules={[{ required: true, message: '???????????????' }]}
                  >
                    <AutoComplete
                      options={batchOptions}
                      onFocus={() => { loadBatchOptions('') }}
                      onSearch={(val) => { loadBatchOptions(val) }}
                      placeholder="??????"
                    />
                  </Form.Item>

                  <Form.Item
                    {...formTailLayout}
                  >


                    <Button type="primary" loading={loading} htmlType="submit">
                      ??????
                    </Button>

                    <Button type="primary"
                      style={{ marginLeft: 8 }}
                      loading={loading}
                      htmlType="submit"
                      disabled={selectedItems.length <= 0}
                      onClick={async () => {
                        const values = form.getFieldsValue();
                        const success = await handleAction(() => changeInventoryStatus({
                          unitloadItemIds: selectedItems.map(x => x.unitloadItemId),
                          bizType: values.bizType,
                        }));
                        if (success) {
                          await loadItemsToChangeInventoryStatus(values);
                        }
                      }}
                    >
                      ??????
                  </Button>

                  </Form.Item>


                  <Form.Item {...formTailLayout}>
                    <Alert message={
                      (() => {
                        let msg = `??? ${dataSource.length} ???`;
                        if (dataSource.length > 0) {
                          msg += '???';
                          if (selectedItems.length > 0) {
                            msg += `????????? ${selectedItems.length} ???????????? ${sumBy(selectedItems, x => x.quantity).toFixed(2)} ${first(selectedItems.map(x => x.uom))}`;

                          } else {
                            msg += '??????????????????';
                          }
                        }
                        return msg;
                      })()
                    } type="info" />
                  </Form.Item>


                </Affix>
              </Form>

            </Col>

            <Col span={14}>


              <ProTable<IChangeInventoryStatusUnitloadItemInfo, IUnitloadItemListArgs>
                rowSelection={{
                  onChange: (key, record) => {
                    setSelectedItems(record)
                  },
                  getCheckboxProps: record => ({
                    disabled: !record.canChangeInventoryStatus
                  })
                }}
                tableAlertRender={false}
                tableAlertOptionRender={false}
                headerTitle="??????"
                actionRef={actionRef}
                rowKey='unitloadItemId'
                search={false}
                toolBarRender={false}
                dataSource={dataSource}
                columns={columns}
                pagination={false}

              />
            </Col>
          </Row>
        </Spin>
      </Card>
    </PageContainer>
  );
};
