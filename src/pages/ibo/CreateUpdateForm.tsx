import { Button, Card, Col, Form, Input, message, Row, Select, Spin } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import TableForm from './components/TableForm';
import styles from './style.less';
import { history } from 'umi';
import { getBizTypes } from '@/services/matl';
import { handleAction } from '@/utils/myUtils';
import { createInboundOrder, getInboundOrderDetail, updateInboundOrder } from '@/services/ibo';
import { debounce } from 'lodash';


const fieldLabels = {
  inboundOrderCode: '入库单号',
  bizType: '业务类型',
  bizOrder: '业务单据号',
  comment: '备注',
};


const FormAdvancedForm: FC<{ match: any }> = (props) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [bizOptions, setBizOptions] = useState<{ value: string, label: string }[]>();
  const [isEditingLine, setIsEditingLine] = useState(false);
  const [inboundOrderCode, setInboundOrderCode] = useState<string>();

  const {
    match: {
      params: { inboundOrderId },
    },
  } = props;

  useEffect(() => {
    getBizTypes('Inbound').then(res => {
      const options = res.data
        ?.map(x => { return { value: x.bizType, label: x.displayName } })
      setBizOptions(options)
    })
  }, [])

  useEffect(() => {
    if (inboundOrderId > 0) {
      setLoading(true);
      getInboundOrderDetail(inboundOrderId)
        .then(res => {
          setLoading(false);
          const { data } = res;
          setInboundOrderCode(data?.inboundOrderCode);
          if (data && data.lines) {
            const lines = data.lines.map(x => {
              return {
                ...x,
                key: `Exist_TEMP_ID_${x.inboundLineId}`,
                op: 'edit',
              }
            });

            form.setFieldsValue({
              ...data,
              lines
            })
          }
        });
    }
  }, [form, inboundOrderId]);


  const handleCommit = debounce(async () => {
    setLoading(true);

    try {
      const fieldsValue = await form.validateFields();
      if (!fieldsValue.lines) {
        message.error('请填写入库明细。');
        return;
      }
      fieldsValue.inboundOrderId = inboundOrderId;

      const success = await handleAction(() => {
        if (inboundOrderId > 0) {
          return updateInboundOrder(fieldsValue);
        }
        return createInboundOrder(fieldsValue);
      });

      if (success) {
        history.push('/order/inbound-orders');
      }
    } finally {
      setLoading(false);
    }

  }, 300, { leading: true });

  const handCancel = () => {
    history.goBack();
  }

  return (
    <Spin spinning={loading}>

      <Form
        form={form}
        layout="vertical"
        hideRequiredMark
      >
        <PageContainer>
          <Card title="入库单内容" className={styles.card} bordered={false}>
            <Row gutter={16}>
              <Col lg={6} md={8} sm={24}>
                <Form.Item
                  label={fieldLabels.inboundOrderCode}
                  name="inboundOrderCode"
                >
                  <Input
                    disabled={true}
                    placeholder='自动生成' />
                </Form.Item>

              </Col>

              <Col lg={6} md={8} sm={24}>
                <Form.Item
                  label={fieldLabels.bizType}
                  name="bizType"
                  rules={[{ required: true, message: '请输入业务类型' }]}

                >
                  {/* <Input placeholder="请输入业务类型" /> */}
                  <Select
                    placeholder="请选择业务类型"
                    disabled={inboundOrderId === 0}
                    options={bizOptions} />
                </Form.Item>
              </Col>
              <Col lg={6} md={8} sm={24}>
                <Form.Item
                  label={fieldLabels.bizOrder}
                  name="bizOrder"
                >
                  <Input
                    autoComplete='off'
                    placeholder="请输入业务单据号"
                  />
                </Form.Item>
              </Col>

              <Col lg={6} md={8} sm={24}>
                <Form.Item
                  label={fieldLabels.comment}
                  name="comment"
                >
                  <Input
                    autoComplete='off'
                    placeholder="备注"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="入库明细" bordered={false}>
            <Form.Item name="lines">
              <TableForm
                inboundOrderCode={inboundOrderCode || ''}
                onIsEditingLineChanged={(v) => { setIsEditingLine(v) }}
              />
            </Form.Item>
          </Card>
        </PageContainer>
        <FooterToolbar>
          {/* {getErrorInfo(error)} */}
          <Button onClick={handCancel} loading={loading}>
            取消
          </Button>
          <Button type="primary" onClick={handleCommit} loading={loading} disabled={isEditingLine || loading} >
            提交
          </Button>
        </FooterToolbar>
      </Form>

    </Spin>
  );
};

export default FormAdvancedForm;
