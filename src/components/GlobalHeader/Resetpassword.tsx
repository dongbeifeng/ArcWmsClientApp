import { resetpassword } from '@/services/user';
import { handleAction } from '@/utils/myUtils';
import useSafeState from '@/utils/useSafeState';
import { Form, Input, Modal } from 'antd';
import React from 'react';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};


interface IPalletizeProps {
    showDiag: boolean;
    changeVisable?: (b: boolean) => void;
}


export const ResetPassword = (props: IPalletizeProps) => {

    const { changeVisable, showDiag } = props;
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useSafeState(false);

    const handleCfmPwd = async (rules, value, callback) => {
        const confirmPassword = form.getFieldValue('confirmPassword');
        if (confirmPassword && value !== confirmPassword) {
            callback(new Error('两次密码输入不一致'))
        } else {
            callback();
        }
    }

    const handleCfmRePwd = async (rules, value, callback) => {
        const password = form.getFieldValue('password');
        if (password && value && password !== value) {
            callback(new Error('两次密码输入不一致'))
        } else {
            callback();
        }
    }

    return (
        <Modal
            width={640}
            bodyStyle={{ padding: '32px 40px 48px' }}
            destroyOnClose
            title={"修改密码"}
            visible={showDiag}
            confirmLoading={confirmLoading}
            onOk={async () => {
                const fieldsValue = await form.validateFields();

                setConfirmLoading(true);
                const retvalue = await handleAction(async () => { return await resetpassword(fieldsValue); })

                if(retvalue){
                    changeVisable(false);
                    setConfirmLoading(false);
                }else{
                    setConfirmLoading(false);
                }
                // try {
                //     const retdata = await resetpassword(fieldsValue)
                //     if (retdata.success) {
                //         message.success('修改密码成功！')
                //         changeVisable(false);
                //     }
                //     else {
                //         message.error(retdata.errorMessage)
                //     }

                // } finally {
                //     setConfirmLoading(false);
                // }
            }}
            onCancel={() => {
                form.resetFields();
                changeVisable(false);
            }}
        >
            <Form
                {...layout}
                name="basic"
                form={form}
            >
                <Form.Item
                    label="旧密码"
                    name="originalPassword"
                    rules={[{ required: true, message: '请输入旧密码!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="新密码"
                    name="password"
                    rules={[{ required: true, message: '请输入新密码!' }, {
                        validator: (rules, value, callback) => { handleCfmPwd(rules, value, callback) }
                    }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="确认新密码"
                    name="confirmPassword"
                    rules={[{ required: true, message: '请重新输入新密码!' }, {
                        validator: (rules, value, callback) => { handleCfmRePwd(rules, value, callback) }
                    }]}
                >
                    <Input.Password />
                </Form.Item>


            </Form>
        </Modal>
    );
};
