import useSafeState from '@/utils/useSafeState';
import { Modal, Form, Input, Checkbox } from 'antd';
import React from 'react';


interface CreateModalProps {
  roleOptions: { label: string; value: string }[];
  onSubmit: (values: any) => void;
  onCancel: () => void;
}
const CheckboxGroup = Checkbox.Group;
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

export default (props: CreateModalProps) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useSafeState(false);

  return (
    <Modal
      title={`添加用户`}
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
          name="userName"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            { required: true, message: '请输入密码' },
          ]}
          validateTrigger="onBlur"
        >
          <Input placeholder="请输入密码" type="password" />
        </Form.Item>
        <Form.Item
          name="password2"
          label="再次输入密码"
          rules={[
            { required: true, message: '请确认密码' },
            {
              validator: (rule, value, callback) => {
                const password = form.getFieldValue('password');
                if (password && password !== value) {
                  callback('密码不一致');
                } else {
                  callback();
                }
              },
            },
          ]}
          validateTrigger="onBlur"
        >
          <Input placeholder="请确认密码" type="password" />
        </Form.Item>

        <Form.Item name="roles" label="角色" rules={[{ required: false, message: '请选择角色' }]}>
          <CheckboxGroup options={props.roleOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

