
import useSafeState from '@/utils/useSafeState';
import { Modal, Form, Checkbox, Col, Row, Divider } from 'antd';
import React, { useEffect } from 'react';


interface OperationModalProps {

  allOperation: string[],
  roleId: string,
  operationList: string[],

  onSubmit: (
    roleId: string,
    data: { operationList: string[]}
  ) => void;
  onCancel: () => void;
}

const formLayout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

export default (props: OperationModalProps) => {
  const { allOperation, roleId, operationList } = props;
  const [form] = Form.useForm<{ operationList: string[]}>();
  const [confirmLoading, setConfirmLoading] = useSafeState(false);
  useEffect(() => {
    form.setFieldsValue({ operationList });
  });

  const getItem = () => {
    const children: JSX.Element[] = [];

    const group: any = {};
    allOperation.forEach(item => {
      const groupname = item.split('.')[0]
      if (!Object.keys(group).includes(groupname)) {
        group[groupname] = [item]
      }
      else {
        group[groupname].push(item)
      }
    })

    Object.keys(group).forEach(key => {
        children.push(<Divider orientation="left" key={key}>{key}</Divider>)
        const childrenSub: any[] = [];
        group[key].forEach((opname: string) => {
          childrenSub.push(
            <Col span={8} key={opname}>
              <Checkbox value={opname}>{opname}</Checkbox>
            </Col>
          );
        })
        children.push(<Row key={`row-${key}`}>
        {childrenSub}
        </Row>
        )
    });

    // allOperation.forEach(item => {
    //     children.push(
    //         <Col span={8}>
    //             <Checkbox value={item}>{item}</Checkbox>
    //         </Col>
    //     );
    // })

    return children
  }


  return (
    <Modal
      title='设置权限'
      width={840}
      bodyStyle={{ padding: '0 0 0' }}
      destroyOnClose
      visible={true}
      confirmLoading={confirmLoading}
      onOk={async () => {
        const fieldsValue = await form.validateFields();
        setConfirmLoading(true);
        try {
          props.onSubmit(roleId, fieldsValue);
        } finally {
          setConfirmLoading(false);
        }
      }}
      onCancel={() => {
        form.resetFields();
        props.onCancel();
      }}
    >
      <div style={{ padding: '0 24px' }}>
        <Form
          {...formLayout}
          form={form}
          preserve={false}
        >

          <Form.Item name="operationList" label="">
            <Checkbox.Group style={{ width: '100%' }} >

              {getItem()}

            </Checkbox.Group>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};
