import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Card, Spin, Select, } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { getMaterialOptions, getInventoryStatus, palletizeStandalonely, validatePalletCode, valueForNoBatch } from '@/services/matl';
import { handleAction } from '@/utils/myUtils';
import type { IMaterialInfo, IPalletizeStandalonelyArgs } from '@/models/matl';

import { debounce } from 'lodash';
import { AutoComplete } from 'antd';

const { Option } = AutoComplete;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const formTailLayout = {
  wrapperCol: { offset: 8 },
};

export default () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [materialOptions, setMaterialOptions] = useState<IMaterialInfo[]>([]);
  const [statusOptions, setStatusOptions] = useState<{ value: string, label: ReactNode }[]>([]);
  const [batchEnabled, setBatchEnabled] = useState(true);

  useEffect(() => {
    getInventoryStatus().then(res => {
      setStatusOptions(res.data?.map(x => ({
        label: x.displayName,
        value: x.inventoryStatus
      })) || []);
    })
  }, []);

  const handleFinish = async (values: any) => {
    const args: IPalletizeStandalonelyArgs = {
      palletCode: values.palletCode,
      ...values,
      inventoryStatus: values.inventoryStatus.value
    };
    setLoading(true);
    const success = await handleAction(() => palletizeStandalonely(args));
    if (success) {
      form.setFieldsValue({
        palletCode: undefined,
        materialCode: '',
        description: undefined,
        specification: undefined,
        batch: undefined,
        inventoryStatus: undefined,
        quantity: undefined,
        uom: undefined,
      });
      setBatchEnabled(true);
    }
    setLoading(false);
  };

  const loadMaterialOptions = debounce(async (keyword: string) => {
    const res = await getMaterialOptions({
      keyword,
      limit: 10,
      inStockOnly: false,
      materialType: ''
    });
    setMaterialOptions(res.data || []);
  }, 300);

  return (
    <PageContainer content="在没有单据的情况下独立组盘。">
      <Card>
        <div style={{ paddingTop: 16, maxWidth: 600 }}>
          <Spin spinning={loading}>
            <Form {...formItemLayout} form={form} onFinish={handleFinish} >
              <Form.Item
                name="palletCode"
                label="托盘编码"
                validateTrigger='onBlur'
                rules={[{
                  required: true,
                  message: '请输入托盘编码'
                }, {
                  // 注意验证是直接触发，无法用 debounce 节流
                  validator: (_, value) => validatePalletCode(value)
                }
                ]}
              >
                <Input placeholder="请输入" autoComplete='off' />
              </Form.Item>
              <Form.Item
                name="materialCode"
                label="物料编号"
                rules={[{ required: true, message: '请输入物料编号' }]}
              >
                <AutoComplete
                  placeholder="请输入物料编号"
                  onChange={async val => {
                    const materialInfo = materialOptions.find(x => x.materialCode === val);
                    if (materialInfo) {
                      form.setFieldsValue({
                        description: materialInfo.description,
                        specification: materialInfo.specification,
                        materialCode: materialInfo.materialCode,
                        uom: materialInfo.uom,
                      });

                      setBatchEnabled(materialInfo.batchEnabled);
                      form.setFieldsValue({
                        batch: materialInfo.batchEnabled ? undefined : valueForNoBatch
                      })
                    } else {
                      setBatchEnabled(true);
                      form.setFieldsValue({
                        description: '',
                        specification: '',
                        uom: '',
                      })
                    }

                  }}
                  onFocus={() => loadMaterialOptions('')}
                  onSearch={loadMaterialOptions}
                >
                  {materialOptions.map(x => (
                    <Option key={x.materialId} value={x.materialCode}>
                      <div>
                        编码：{x.materialCode}
                      </div>
                      <div>
                        描述：{x.description}
                      </div>
                      <div>
                        规格：{x.specification}
                      </div>
                    </Option>)
                  )}
                </AutoComplete>
              </Form.Item>

              <Form.Item
                name="description"
                label="描述"
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                name="specification"
                label="规格"
              >
                <Input disabled />
              </Form.Item>

              <Form.Item name="batch" label="批次" rules={[{ required: true, message: '请输入批次' }]}>
                <Input placeholder="请输入" disabled={!batchEnabled} />
              </Form.Item>
              <Form.Item
                name="inventoryStatus"
                label="库存状态"
                rules={[{ required: true, message: '请选择库存状态' }]}
              >
                <Select
                  showSearch
                  labelInValue
                  filterOption={false}
                  placeholder="库存状态"
                  options={statusOptions} />

              </Form.Item>
              <Form.Item
                name="quantity"
                label="数量"

              //   rules={[{ required: true, message: '请输入最大入站' }]}
              >
                <InputNumber min={1} max={999} />
              </Form.Item>
              <Form.Item
                name="uom"
                label="计量单位"
                rules={[{ required: true, message: '请输入计量单位' }]}
              >
                <Input placeholder="请输入" disabled />
              </Form.Item>
              <Form.Item
                {...formTailLayout}
              >
                <Button type="primary" loading={loading} htmlType='submit' style={{ marginRight: 8 }}>
                  提交
                </Button>

              </Form.Item>

            </Form>
          </Spin>
        </div>
      </Card>
    </PageContainer>
  );
};

