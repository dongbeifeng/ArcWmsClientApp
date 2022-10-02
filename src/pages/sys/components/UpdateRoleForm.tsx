import type { ICreateUpdateRoleArgs, IRoleInfo } from '@/models/usr';
import useSafeState from '@/utils/useSafeState';
import { Modal, Form, Input } from 'antd';
import React, { useEffect } from 'react';


interface EditModalProps {
  current: Partial<IRoleInfo> | undefined;
  onSubmit: (values: ICreateUpdateRoleArgs) => void;
  onCancel: () => void;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

export default (props: EditModalProps) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useSafeState(false);
  useEffect(() => {
    form.setFieldsValue({
      roleName: props.current?.roleName,
      comment: props.current?.comment,
    });
  });
  return (
    <Modal
      title={`${props.current ? '编辑' : '添加'}角色`}
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
        preserve={false}
      >
        <Form.Item
          name="roleName"
          label="角色名"
          rules={[{ required: true, message: '请输入角色名' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item name="comment" label="备注" rules={[{ required: false, message: '请输入备注' }]}>
          <Input placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
