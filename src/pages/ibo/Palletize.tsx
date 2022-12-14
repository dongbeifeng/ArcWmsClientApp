import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Card, Spin, Select, } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { handleAction } from '@/utils/myUtils';
import { getInboundOrderDetail, palletize } from '@/services/ibo';
import type { IIboPalletizeArgs, IInboundLineInfo, IInboundOrderInfo } from '@/models/ibo';
import { uniqWith, isEqual } from "lodash";
import { validatePalletCode } from '@/services/matl';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const formTailLayout = {
  wrapperCol: { offset: 8 },
};

type IFormData = {
  inboundOrderCode?: string,
  palletCode?: string,
  materialCode?: string,
  description?: string,
  specification?: string,
  batch?: string,
  inventoryStatus?: string,
  quantity?: number,
  uom?: string,
};
const Palletize: FC<{ match: any }> = (props) => {
  const [form] = Form.useForm<IFormData>();
  const [inboundOrder, setInboundOrder] = useState<IInboundOrderInfo>();
  const [loading, setLoading] = useState(false);
  const [materialOptions, setMaterialOptions] = useState<{
    materialCode: string,
    description: string,
    materialType: string,
    specification: string,
  }[]>([]);
  const [batchOptions, setBatchOptions] = useState<string[]>([]);
  const [inventoryStatusOptions, setInventoryStatusOptions] = useState<string[]>([]);
  const [uomOptions, setUomOptions] = useState<string[]>([]);

  const {
    match: {
      params: { inboundOrderId },
    },
  } = props;

  const setOptions = (inboundOrderLines?: IInboundLineInfo[]) => {
    const inboundOrderLinesClone = inboundOrderLines ?? [];
    const newValues = {
      ...form.getFieldsValue(),
    };
    function filterThenUniqWith<T>(lines: IInboundLineInfo[], predicate: (x: IInboundLineInfo) => boolean, selector: (x: IInboundLineInfo) => T) {
      return uniqWith(lines.filter(predicate).map(selector), isEqual);
    }
    if (newValues.materialCode) {
      newValues.description = materialOptions.find(x => x.materialCode === newValues.materialCode)?.description;
      newValues.specification = materialOptions.find(x => x.materialCode === newValues.materialCode)?.specification;
    }

    if (materialOptions.length === 0) {
      const arr = filterThenUniqWith(
        inboundOrderLinesClone,
        () => true,
        x => ({
          materialCode: x.materialCode,
          description: x.description,
          materialType: x.materialType,
          specification: x.specification,
        }));
      setMaterialOptions(arr);
      setBatchOptions([]);
      setInventoryStatusOptions([]);
      setUomOptions([]);

      newValues.materialCode = arr.length === 1 ? arr[0].materialCode : undefined;
      newValues.description = arr.length === 1 ? arr[0].description : undefined;
      newValues.specification = arr.length === 1 ? arr[0].specification : undefined;
    }

    // ?????????????????????????????????????????????????????????????????????
    if (newValues.materialCode) {
      const arr = filterThenUniqWith(
        inboundOrderLinesClone,
        x => (x.materialCode === newValues.materialCode || !newValues.materialCode),
        x => x.batch);
      setBatchOptions(arr);
      setInventoryStatusOptions([]);
      setUomOptions([]);

      newValues.batch = arr.length === 1 ? arr[0] : undefined;
    }

    // ???????????????????????????????????????????????????????????????
    if (newValues.batch) {
      const arr = filterThenUniqWith(
        inboundOrderLinesClone,
        x => (x.materialCode === newValues.materialCode || !newValues.materialCode)
          && (x.batch === newValues.batch || !newValues.batch),
        x => x.inventoryStatus);
      setInventoryStatusOptions(arr);
      setUomOptions([]);

      newValues.inventoryStatus = arr.length === 1 ? arr[0] : undefined;
    }

    // ??????????????????????????????????????????????????????
    if (newValues.inventoryStatus) {
      const arr = filterThenUniqWith(
        inboundOrderLinesClone,
        x => (x.materialCode === newValues.materialCode || !newValues.materialCode)
          && (x.batch === newValues.batch || !newValues.batch)
          && (x.inventoryStatus === newValues.inventoryStatus || !newValues.inventoryStatus),
        x => x.uom);

      setUomOptions(arr);
      newValues.uom = arr.length === 1 ? arr[0] : undefined;
    }

    form.setFieldsValue(newValues);
  }


  async function loadInboundOrder() {
    setLoading(true);
    const v = await getInboundOrderDetail(inboundOrderId);
    setInboundOrder(v.data);
    form.setFieldsValue({
      inboundOrderCode: v.data?.inboundOrderCode,
    });
    setOptions(v.data?.lines);
    setLoading(false);
  }

  useEffect(() => {
    loadInboundOrder();
  }, []);


  const handleFinish = async (values: any) => {
    const args: IIboPalletizeArgs = {
      palletCode: values.palletCode,
      ...values
    };
    setLoading(true);
    const success = await handleAction(() => palletize(args));
    if (success) {
      await loadInboundOrder();
    }
    setLoading(false);
  };

  return (
    <PageContainer>
      <Card>
        <div style={{ paddingTop: 16, maxWidth: 600 }}>
          <Spin spinning={loading}>
            <Form
              {...formItemLayout}
              form={form}
              onFinish={handleFinish}
              onValuesChange={() => setOptions(inboundOrder?.lines)}
            >
              <Form.Item
                name="inboundOrderCode"
                label="???????????????"
              >
                <Input placeholder="?????????" readOnly />
              </Form.Item>

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
                <Select placeholder="???????????????">
                  {
                    materialOptions.map(x => (
                      <Select.Option
                        key={x.materialCode}
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
                      </Select.Option>
                    ))
                  }
                </Select>
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
                rules={[{ required: true, message: '???????????????' }]}>
                <Select placeholder="?????????">
                  {
                    batchOptions.map(x => (
                      <Select.Option
                        key={x}
                        value={x}>
                        {x}
                      </Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
              <Form.Item
                name="inventoryStatus"
                label="????????????"
                rules={[{ required: true, message: '?????????????????????' }]}>
                <Select placeholder="?????????">
                  {
                    inventoryStatusOptions.map(x => (
                      <Select.Option
                        key={x}
                        value={x}>
                        {x}
                      </Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
              <Form.Item
                name="quantity"
                label="??????"
                rules={[() => ({
                  validator(_, value) {
                    if (value && value > 0) {
                      return Promise.resolve();
                    }
                    // eslint-disable-next-line prefer-promise-reject-errors
                    return Promise.reject('??????????????? 0 ?????????');
                  },
                }),]}
              >
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item
                name="uom"
                label="????????????"
                rules={[{ required: true, message: '?????????????????????' }]}
              >
                <Select placeholder="?????????">
                  {
                    uomOptions.map(x => (
                      <Select.Option
                        key={x}
                        value={x}>
                        {x}
                      </Select.Option>
                    ))
                  }
                </Select>

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

export default Palletize;
