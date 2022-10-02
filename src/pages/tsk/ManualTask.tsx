import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Card, Spin, Select, } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { handleAction } from '@/utils/myUtils';
import { createManualTask, getTaskTypeOptions } from '@/services/tsk';
import type { ICreateManualTaskArgs } from '@/models/tsk';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const formTailLayout = {
  wrapperCol: { offset: 8 },
};

export default () => {
  const [form] = Form.useForm<ICreateManualTaskArgs>();
  const [loading, setLoading] = useState(false);
  const [taskTypeOptions, setTaskTypeOptions] = useState<string[]>();

  useEffect(() => {
    getTaskTypeOptions()
      .then(res => setTaskTypeOptions(res.data));
  }, []);


  const handleFinish = async (values: ICreateManualTaskArgs) => {
    setLoading(true);
    await handleAction(() => createManualTask(values));

    setLoading(false);
  };

  return (
    <PageContainer content="此功能会下发任务，请仔细检查，避免填写不合理的数据。">
      <Card>
        <div style={{ paddingTop: 16, maxWidth: 600 }}>
          <Spin spinning={loading}>
            <Form {...formItemLayout} form={form} onFinish={handleFinish} >
              <Form.Item
                name="palletCode"
                label="托盘编码"
                rules={[{ required: true, message: '请输入托盘编码' }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>

              <Form.Item
                name="taskType"
                label="任务类型"
                rules={[{ required: true, message: '请输入任务类型' }]}
              >
                <Select
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="请选择任务类型"
                >
                  {taskTypeOptions?.map(x => (
                    <Select.Option value={x} key={x}>
                      {x}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="fromLocationCode"
                label="起点"
                rules={[{ required: true, message: '请输入起点' }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>

              <Form.Item
                name="toLocationCode"
                label="终点"
                rules={[{ required: true, message: '请输入终点' }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>

              <Form.Item
                name="comment"
                label="备注"
                rules={[{ required: true, message: '请输入备注' }]}
              >
                <Input placeholder="请输入" />
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

