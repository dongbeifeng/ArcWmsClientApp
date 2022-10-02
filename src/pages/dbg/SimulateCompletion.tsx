import React, { useState } from 'react';
import { Form, Input, Button, Space, Checkbox, Card, Row, Col, Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { ICompletedTaskInfo } from '@/models/debug';
import { doCompleted } from '@/services/debug';
import { PageContainer } from '@ant-design/pro-layout';
import { handleAction } from '@/utils/myUtils';

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

  const handleFinish = async (values: any) => {
    const contents = {};
    for (let i = 0; i < values.additionalInfo.length; i += 1) {
      contents[values.additionalInfo[i].key] = values.additionalInfo[i].value;
    }
    const args: ICompletedTaskInfo = {
      ...values,
      additionalInfo: contents,
    };
    setLoading(true);
    const success = await handleAction(() => doCompleted(args));
    if (success) {
      form.resetFields();
    }
    setLoading(false);

  };

  return (
    <PageContainer content="模拟完成">
      <Card bordered={false}>
        <div style={{ paddingTop: 16, maxWidth: 600 }}>
          <Spin spinning={loading}>
            <Form
              {...formItemLayout}
              name="模拟完成"
              form={form}
              onFinish={handleFinish}
              autoComplete="off"
              initialValues={{
                cancelled: false,
                taskCode: '',
                taskType: '',
                actualEnd: '',
                additionalInfo: [],
              }}
            >
              <Form.Item
                name="taskCode"
                label="任务号"
                rules={[{ required: true, message: '请输入任务号' }]}
              >
                <Input placeholder="请输入任务号" />
              </Form.Item>
              <Form.Item

                name="taskType"
                label="任务类型"
                rules={[{ required: true, message: '请输入任务类型' }]}
              >
                <Input placeholder="请输入任务类型" />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8 }} name="cancelled" valuePropName="checked">
                <Checkbox>是否已取消</Checkbox>
              </Form.Item>
              <Form.Item
                name="actualEnd"
                label="实际完成位置"
                rules={[{ required: false, message: '请输入实际完成位置' }]}
              >
                <Input placeholder="请输入实际完成位置" />
              </Form.Item>
              <Form.List name="additionalInfo">
                {(fields, { add, remove }) => {
                  const items = fields.map((field) => (
                    <Row key={field.key}>
                      <Col offset={8} span={16}>
                        <Space key={field.key} align='baseline'>
                          <Form.Item
                            {...field}
                            wrapperCol={{ span: 24 }}
                            name={[field.name, 'key']}
                            fieldKey={[field.fieldKey, 'key']}
                            rules={[{ required: true, message: '请输入键' }]}
                          >
                            <Input placeholder="键" />
                          </Form.Item>
                          <Form.Item
                            {...field}
                            wrapperCol={{ span: 24 }}
                            name={[field.name, 'value']}
                            fieldKey={[field.fieldKey, 'value']}
                            rules={[{ required: true, message: '请输入值' }]}
                          >
                            <Input placeholder="值" />
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => remove(field.name)} />
                        </Space>
                      </Col>
                    </Row>
                  ));

                  return (
                    <>
                      {items}
                      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          添加键值信息
                        </Button>
                      </Form.Item>
                    </>
                  )
                }
                }
              </Form.List>

              <Form.Item {...formTailLayout}>
                <Button type="primary" loading={loading} htmlType="submit">
                  完成
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </Card>
    </PageContainer>
  );
};
