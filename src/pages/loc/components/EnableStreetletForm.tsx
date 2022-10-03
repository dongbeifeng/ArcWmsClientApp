import { Form, Input, Modal } from 'antd';
import useSafeState from '@/utils/useSafeState';
import { IEnableStreetletArgs } from '@/models/loc';


const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

export type FormTitle = '禁止入站' | '允许入站' | '禁止出站' | '允许出站';


export interface EnableStreetletFormProps {
  onCancel: () => void;
  onSubmit: (values: IEnableStreetletArgs) => void;
  formTitle?: FormTitle;
  streetletId: number;
  streetletCode: string;
}

export default (props: EnableStreetletFormProps) => {
  const [form] = Form.useForm<IEnableStreetletArgs>();
  const [confirmLoading, setConfirmLoading] = useSafeState(false);


  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title={props.formTitle}
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
          streetletId: props.streetletId,
          comment: '',
          streetletCode: props.streetletCode,
        }}
      >

        <Form.Item name='streetletId' hidden>
          <Input />
        </Form.Item>

        <Form.Item name="streetletCode" label="巷道">
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="comment"
          label="请输入备注"
          rules={[{ required: props.formTitle === '禁止入站' || props.formTitle === '禁止出站', message: '请输入备注信息！' }]}

        >
          <Input placeholder="请输入" autoComplete='off' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

