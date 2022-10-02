import React from 'react';
import { Form, Input, Modal } from 'antd';
import useSafeState from '@/utils/useSafeState';


const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

export type FormType = 'disableInbound' | 'disableOutbound' | 'enableInbound' | 'enableOutbound';


export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: any) => void;
  formType?: FormType;
  locationCode: string;
}

export default (props: UpdateFormProps) => {
  const [form] = Form.useForm<{
    locationCode: string,
    comment: string,
  }>();
  const [confirmLoading, setConfirmLoading] = useSafeState(false);

  function getText() {
    switch (props.formType) {
      case 'disableInbound':
        return '禁止入站';
      case 'enableInbound':
        return '允许入站';
      case 'disableOutbound':
        return '禁止出站';
      case 'enableOutbound':
        return '允许出站';
      default:
        return '';
    }
  }

  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title={getText()}
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
          comment: '',
          locationCode: props.locationCode,
        }}
      >
        <Form.Item name="locationCode" label="货位：">
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="comment"
          label="请输入备注："
          rules={[{ required: true, message: '请输入备注信息！' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

