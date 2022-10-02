import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Radio } from 'antd';
import type { IAppSetting, IUpdateAppSettingArgs } from '@/models/sys';
import useSafeState from '@/utils/useSafeState';

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: IUpdateAppSettingArgs) => void;
  values: IAppSetting;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

export default (props: UpdateFormProps) => {
  const [form] = Form.useForm<IUpdateAppSettingArgs>();
  const [confirmLoading, setConfirmLoading] = useSafeState(false);

  useEffect(() => {
    form.setFieldsValue(props.values);
  });

  function SettingValueInput(setting: IAppSetting) {
    switch (setting.settingType) {
      case "数字": return NumberInput();
      case "布尔": return BooleanInput();
      case "字符串":
      default:
        return StringInput();
    }
  }

  function NumberInput() {
    return (
      <Form.Item
        name="settingValue"
        label="参数值"
        rules={[{
          required: true,
          message: '请输入参数值！'
        }]}
      >
        <InputNumber placeholder="请输入" />
      </Form.Item>
    );
  }
  function StringInput() {
    return (
      <Form.Item
        name="settingValue"
        label="参数值"
        rules={[{
          required: true,
          message: '请输入参数值！'
        }]}
      >
        <Input placeholder="请输入" />
      </Form.Item>
    );
  }

  function BooleanInput() {
    return (
      <Form.Item
        name="settingValue"
        label="参数值"
        rules={[{
          required: true,
          message: '请输入参数值！'
        }]}
      >
        <Radio.Group
          options={['true', 'false']}
          optionType="button"
        />
      </Form.Item>
    );
  }

  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="设置参数"
      visible={true}
      confirmLoading={confirmLoading}
      onCancel={props.onCancel}
      onOk={async () => {
        const fieldsValue = await form.validateFields();
        setConfirmLoading(true);
        try {
          await props.onSubmit(fieldsValue);
        } finally {
          setConfirmLoading(false);
        }
      }}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={props.values}
      >
        <Form.Item
          name="settingName"
          label="参数名称"
          rules={[{ required: true, message: '请输入参数名称！' }]}
        >
          <Input placeholder="请输入" readOnly={true} />
        </Form.Item>

        <Form.Item
          name="settingType"
          label="参数类型"
        >
          <Input disabled={true} />
        </Form.Item>

        {SettingValueInput(props.values)}
      </Form>
    </Modal>
  );
};
