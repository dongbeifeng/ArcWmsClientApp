import useSafeState from '@/utils/useSafeState';
import { Modal, Form, Input } from 'antd';
import React from 'react';


interface CreateModalProps {

  onSubmit: (values: any) => void;
  onCancel: () => void;
}
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

export default (props: CreateModalProps) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useSafeState(false);

  return (
    <Modal
      title={`添加出口`}
      width={640}
      bodyStyle={{ padding: '28px 0 0' }}
      destroyOnClose
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
        initialValues={{
          userName: '',
          password: '',
          password2: '',
          roles: [],
        }}
        preserve={false}
        >
        <Form.Item
          name="outletCode"
          label="出口编码"
          rules={[{ required: true, message: '请输入出口编码' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="kP1"
          label="关键点1"
          rules={[{ required: true, message: '请输入关键点1' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="kP2"
          label="关键点2"
          rules={[{ required: false, message: '请输入关键点2' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="comment"
          label="备注"
          rules={[{ required: false, message: '请输入备注' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

