import { Button, Card, Input, Form, Spin } from 'antd';
import { useState } from 'react';
import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { IChangeUnitloadLocationArgs } from '@/models/tsk';
import { changeUnitloadLocation } from '@/services/tsk';
import { handleAction } from '@/utils/myUtils';

const FormItem = Form.Item;

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


  const onFinish = async (values: any) => {
    setLoading(true);
    const success = await handleAction(() => changeUnitloadLocation(values));
    if (success) {
      form.resetFields();
    }
    setLoading(false);
  };

  return (
    <PageContainer content="此功能仅更改数据，不会下发任务，用于修正实物与数据不一致。">
      <Card>
        <div style={{ paddingTop: 16, maxWidth: 600 }}>

          <Spin spinning={loading}>
            <Form
              {...formItemLayout}
              form={form}
              onFinish={onFinish}
            >
              <FormItem
                label="托盘编码"
                name="palletCode"
                rules={[
                  {
                    required: true,
                    message: '请输入托盘编码',
                  },
                ]}
              >
                <Input placeholder="托盘编码" />
              </FormItem>
              <FormItem
                label="移动到"
                name="destinationLocationCode"
                rules={[
                  {
                    required: true,
                    message: '请输入目标位置',
                  },
                ]}
              >
                <Input placeholder="目标位置" />
              </FormItem>
              <FormItem
                label="备注"
                name="comment"
              >
                <Input placeholder="备注" />
              </FormItem>

              <FormItem
                {...formTailLayout}
              >
                <Button type="primary" htmlType="submit" loading={loading}>
                  提交
                </Button>

              </FormItem>
            </Form>
          </Spin>

        </div>
      </Card>
    </PageContainer>
  );
};
