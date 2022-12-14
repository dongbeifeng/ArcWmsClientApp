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
    <PageContainer content="??????????????????????????????????????????">
      <Card>
        <div style={{ paddingTop: 16, maxWidth: 600 }}>
          <Spin spinning={loading}>
            <Form {...formItemLayout} form={form} onFinish={handleFinish} >
              <Form.Item
                name="palletCode"
                label="????????????"
                validateTrigger='onBlur'
                rules={[{
                  required: true,
                  message: '?????????????????????'
                }, {
                  // ??????????????????????????????????????? debounce ??????
                  validator: (_, value) => validatePalletCode(value)
                }
                ]}
              >
                <Input placeholder="?????????" autoComplete='off' />
              </Form.Item>
              <Form.Item
                name="materialCode"
                label="????????????"
                rules={[{ required: true, message: '?????????????????????' }]}
              >
                <AutoComplete
                  placeholder="?????????????????????"
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

              <Form.Item name="batch" label="??????" rules={[{ required: true, message: '???????????????' }]}>
                <Input placeholder="?????????" disabled={!batchEnabled} />
              </Form.Item>
              <Form.Item
                name="inventoryStatus"
                label="????????????"
                rules={[{ required: true, message: '?????????????????????' }]}
              >
                <Select
                  showSearch
                  labelInValue
                  filterOption={false}
                  placeholder="????????????"
                  options={statusOptions} />

              </Form.Item>
              <Form.Item
                name="quantity"
                label="??????"

              //   rules={[{ required: true, message: '?????????????????????' }]}
              >
                <InputNumber min={1} max={999} />
              </Form.Item>
              <Form.Item
                name="uom"
                label="????????????"
                rules={[{ required: true, message: '?????????????????????' }]}
              >
                <Input placeholder="?????????" disabled />
              </Form.Item>
              <Form.Item
                {...formTailLayout}
              >
                <Button type="primary" loading={loading} htmlType='submit' style={{ marginRight: 8 }}>
                  ??????
                </Button>

              </Form.Item>

            </Form>
          </Spin>
        </div>
      </Card>
    </PageContainer>
  );
};

