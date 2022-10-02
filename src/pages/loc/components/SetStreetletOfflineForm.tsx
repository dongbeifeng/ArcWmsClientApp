import React from 'react';
import { Form, Input, Modal } from 'antd';
import type { ITakeStreetletOfflineArgs, IStreetletInfo } from '@/models/loc';
import useSafeState from '@/utils/useSafeState';

export interface UpdateFormProps {
  onCancel: () => void;
  onTakeOffline: (values: ITakeStreetletOfflineArgs) => void;
  onTakeOnline: (values: ITakeStreetletOfflineArgs) => void;
  values: IStreetletInfo;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

export default (props: UpdateFormProps) => {
  const [form] = Form.useForm<ITakeStreetletOfflineArgs>();
  const [confirmLoading, setConfirmLoading] = useSafeState(false);
  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="巷道设置"
      visible={true}
      confirmLoading={confirmLoading}
      onOk={async () => {
        const fieldsValue = await form.validateFields();
        setConfirmLoading(true);
        try {
          if (props.values.offline) {
            await props.onTakeOnline(fieldsValue);
          } else {
            await props.onTakeOffline(fieldsValue);
          }
        } finally {
          setConfirmLoading(false);
        }
      }}
      onCancel={props.onCancel}
    >
      <div>您确定要将巷道{props.values.offline ? '联机' : '脱机'}吗?</div>
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          streetletCode: props.values.streetletCode,
          comment: '',
        }}
      >
        <Form.Item name="streetletCode" label="巷道：">
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="comment"
          label="请输入备注："
          rules={[{ required: !props.values.offline, message: '请输入备注信息！' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
      </Form>
    </Modal>
  );
};


