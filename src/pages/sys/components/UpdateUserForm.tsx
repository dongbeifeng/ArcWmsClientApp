import type { IEditUserArgs, IUserInfo } from '@/models/usr';
import useSafeState from '@/utils/useSafeState';
import { Modal, Form, Input, Checkbox } from 'antd';
import React from 'react';


interface EditModalProps {
  current: Partial<IUserInfo> | undefined;
  roleOptions: { label: string; value: string }[];
  onSubmit: (values: IEditUserArgs) => void;
  onCancel: () => void;
}
const CheckboxGroup = Checkbox.Group;
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

export default (props: EditModalProps) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useSafeState(false);
  return (
    <Modal
      title={`${props.current?.userId ? '编辑' : '添加'}用户`}
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
          userName: props.current?.userName,
          roles: props.current?.roles,
        }}
        >
        <Form.Item
          name="userName"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item name="roles" label="角色" rules={[{ required: false, message: '请选择角色' }]}>
          <CheckboxGroup options={props.roleOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

