import { Button, Card, Col, Form, Input, message, Row, Select, Spin } from 'antd';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import TableForm from './components/TableForm';
import styles from './style.less';
import type { IEditOutboundLineInfo } from '@/models/obo';
import { createOutboundOrder, getOutboundOrderDetails, updateOutboundOrder } from '@/services/obo';
import { history } from 'umi';
import { getBizTypes } from '@/services/matl';
import { handleAction } from '@/utils/myUtils';
import { debounce } from 'lodash';



const fieldLabels = {
  outboundOrderCode: '出库单号',
  bizType: '业务类型',
  bizOrder: '业务单据号',
  comment: '备注',
  //   approver: '审批人',
  //   dateRange: '生效日期',
  //   type: '仓库类型',
  //   name2: '任务名',
  //   url2: '任务描述',
  //   owner2: '执行人',
  //   approver2: '责任人',
  //   dateRange2: '生效日期',
  //   type2: '任务类型',
};


const FormAdvancedForm: FC<{ match: any }> = (props) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [bizOptions, setBizOptions] = useState<{ value: string, label: string }[]>();
  const [isEditingLine, setIsEditingLine] = useState(false);
  const [outboundOrderCode, setOutboundOrderCode] = useState<string>();

  const {
    match: {
      params: { outboundOrderId },
    },
  } = props;

  useEffect(() => {
    getBizTypes('Outbound').then(res => {
      const options = res.data
        ?.map(x => { return { value: x.bizType, label: x.displayName } })
      setBizOptions(options)
    })
  }, [])

  useEffect(() => {
    if (outboundOrderId > 0) {
      setLoading(true);
      getOutboundOrderDetails(outboundOrderId)
        .then(res => {
          setLoading(false);
          const { data } = res;
          setOutboundOrderCode(data?.outboundOrderCode);
          if (data && data.lines) {
            const lines: IEditOutboundLineInfo[] = data.lines.map(x => {
              return {
                ...x,
                key: `Exist_TEMP_ID_${x.outboundLineId}`,
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
  }, [form, outboundOrderId]);


  const handleCommit = debounce(async () => {
    setLoading(true);
    try {
      const fieldsValue = await form.validateFields();
      if (!fieldsValue.lines) {
        message.error('请填写出库明细。');
        return;
      }

      fieldsValue.outboundOrderId = outboundOrderId;

      const success = await handleAction(() => {
        if (outboundOrderId > 0) {
          return updateOutboundOrder(fieldsValue);
        }
        return createOutboundOrder(fieldsValue);
      });

      if (success) {
        history.push('/order/outbound-orders');
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
          <Card title="出库单内容" className={styles.card} bordered={false}>
            <Row gutter={16}>
              <Col lg={6} md={8} sm={24}>
                <Form.Item
                  label={fieldLabels.outboundOrderCode}
                  name="outboundOrderCode"
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
                    disabled={outboundOrderId === 0}
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
          <Card title="出库明细" bordered={false}>
            <Form.Item name="lines">
              <TableForm
                outboundOrderCode={outboundOrderCode || ''}
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
