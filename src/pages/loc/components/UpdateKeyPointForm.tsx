import React from 'react';
import { Modal, Form, Input, InputNumber, } from 'antd';
import type { ICreateUpdateKeyPointArgs, IKeyPointInfo,  } from '@/models/loc';
import useSafeState from '@/utils/useSafeState';

interface EditModalProps {
  current: Partial<IKeyPointInfo> | undefined;
  onSubmit: (values: ICreateUpdateKeyPointArgs) => void;
  onCancel: () => void;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

export default (props: EditModalProps) => {
  const [form] = Form.useForm<ICreateUpdateKeyPointArgs>();
  const [confirmLoading, setConfirmLoading] = useSafeState(false);
  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '28px 0 0' }}
      destroyOnClose
      title={`${props.current ? '编辑' : '添加'}关键点`}
      visible={true}
      confirmLoading={confirmLoading}
      onOk={async () => {
        const fieldsValue = await form.validateFields();
        setConfirmLoading(true);
        try {
          await props.onSubmit(fieldsValue);
        } finally {
          setConfirmLoading(false);
        }
      }}
      onCancel={() => {
        form.resetFields();
        props.onCancel();
      }}

    >
      <Form
        {...formLayout}
        form={form}
        initialValues={props.current || { inboundLimit: 1, outboundLimit: 1 }}
      >
        <Form.Item
          name="locationCode"
          label="货位编码"
          rules={[{ required: true, message: '请输入货位编码' }]}
        >
          <Input placeholder="请输入" disabled={!!props.current} />
        </Form.Item>

        <Form.Item
          name="inboundLimit"
          label="最大入站"
        //   rules={[{ required: true, message: '请输入最大入站' }]}
        >
          <InputNumber min={1} max={999} />
        </Form.Item>

        <Form.Item
          name="outboundLimit"
          label="最大出站"
        //   rules={[{ required: true, message: '请输入最大出站' }]}
        >
          <InputNumber min={1} max={999} />
        </Form.Item>
        <Form.Item
          name="tag"
          label="标记"
        // rules={[{ required: true, message: '请输入标记' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="requestType"
          label="请求类型"
        // rules={[{ required: true, message: '请输入请求类型' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

