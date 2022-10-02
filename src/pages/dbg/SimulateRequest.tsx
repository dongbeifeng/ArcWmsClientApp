import React from 'react';
import { Form, Input, Button, Space, InputNumber, Card, Row, Col, Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { IRequestInfo } from '@/models/debug';
import { doRequest } from '@/services/debug';
import { PageContainer } from '@ant-design/pro-layout';
import { handleAction } from '@/utils/myUtils';
import { useState } from 'react';

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

    const args: IRequestInfo = {
      ...values,
      additionalInfo: contents,
    };
    setLoading(true);
    const success = await handleAction(() => doRequest(args));
    if (success) {
      form.resetFields();
    }
    setLoading(false);
  };

  return (
    <PageContainer content="模拟请求">
      <Card bordered={false}>
        <div style={{ paddingTop: 16, maxWidth: 600 }}>
          <Spin spinning={loading}>

            <Form
              {...formItemLayout}
              form={form}
              name="模拟请求"
              onFinish={handleFinish}
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
              <Form.Item
                name="requestType"
                label="请求类型"
                rules={[{ required: true, message: '请输入请求类型' }]}
              >
                <Input placeholder="请输入请求类型" />
              </Form.Item>
              <Form.Item
                name="locationCode"
                label="请求位置"
                rules={[{ required: true, message: '请输入请求位置' }]}
              >
                <Input placeholder="请输入请求位置" />
              </Form.Item>

              <Form.Item
                name="palletCode"
                label="托盘号"
                rules={[{ required: true, message: '请输入托盘号' }]}
              >
                <Input placeholder="请输入托盘号" />
              </Form.Item>
              <Form.Item
                name="weight"
                label="重量"
                // rules={[{ required: true, message: '请输入重量' }]}
                >
                <InputNumber min={0} max={9999} />
              </Form.Item>
              <Form.Item
                name="height"
                label="高度"
                // rules={[{ required: true, message: '请输入高度' }]}
                >
                <InputNumber min={0} max={9999} />
              </Form.Item>
              <Form.List name="additionalInfo">
                {(fields, { add, remove }) => {
                  const items = fields.map((field) => (
                    <Row key={field.fieldKey}>
                      <Col offset={8} span={16}>
                        <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
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
                          添加附加信息
                    </Button>
                      </Form.Item>
                    </>
                  )
                }}
              </Form.List>
              <Form.Item
                {...formTailLayout}
              >
                <Button type="primary" loading={loading} htmlType="submit">
                  请求
            </Button>
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </Card>
    </PageContainer>

  );
};
