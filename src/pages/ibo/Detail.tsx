import { Button, Card, Table, Spin, Tag, Descriptions, Popconfirm } from 'antd';
import type { FC } from 'react';
import { useCallback } from 'react';
import { Fragment } from 'react';
import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './style.less';
import type { IInboundLineInfo, IInboundOrderInfo } from '@/models/ibo';
import { closeInboundOrder, getInboundOrderDetail } from '@/services/ibo';
import { history } from 'umi';
import type { IFlowInfo, } from '@/models/matl';
import { getFlowList } from '@/services/matl';
import { handleAction } from '@/utils/myUtils';
import ButtonGroup from 'antd/es/button/button-group';
import moment from 'moment';
import type { ColumnsType } from 'antd/es/table';


const InboundDetail: FC = (props: any) => {
  const [loading] = useState(false);
  const [orderInfo, setOrderInfol] = useState<IInboundOrderInfo>();
  const [lines, setLines] = useState<IInboundLineInfo[]>([]);
  const [flowList, setFlowList] = useState<IFlowInfo[]>([]);
  const [doLoading, setDoLoading] = useState(false);

  const {
    match: {
      params: { inboundOrderId },
    },
  } = props;

  const loadData = useCallback(async () => {
    setDoLoading(true);
    const orderRes = await getInboundOrderDetail(inboundOrderId);
    if (orderRes.success && orderRes.data) {
      setOrderInfol(orderRes.data);
      setLines(orderRes.data.lines ?? []);

      const flowsRes = await getFlowList({ orderCode: orderRes.data.inboundOrderCode }, { flowId: 'ascend' }, {});
      if (flowsRes.success && flowsRes.data) {
        setFlowList(flowsRes.data);
      }
    }

    setDoLoading(false);
  }, [inboundOrderId]);



  useEffect(() => {
    if (inboundOrderId > 0) {
      loadData();
    }

  }, [loadData, inboundOrderId]);


  const columns = [
    {
      title: 'ID',
      key: 'inboundLineId',
      dataIndex: 'inboundLineId',
      width: '10%',
    },
    {
      title: '物料代码',
      dataIndex: 'materialCode',
      key: 'materialCode',
    },
    {
      title: '物料名称',
      dataIndex: 'description',
      key: 'description',
      width: '10%',
    },
    {
      title: '物料类型',
      dataIndex: 'materialType',
      key: 'materialType',
      width: '10%',
    },
    {
      title: '批号',
      dataIndex: 'batch',
      key: 'batch',
      width: '10%',
    },
    {
      title: '状态',
      dataIndex: 'inventoryStatus',
      key: 'inventoryStatus',
      width: '10%',
    },
    {
      title: '应入',
      dataIndex: 'quantityExpected',
      key: 'quantityExpected',
      width: '10%',
    },
    {
      title: '已入',
      dataIndex: 'quantityReceived',
      key: 'quantityReceived',
      width: '10%',
    },
    {
      title: '单位',
      dataIndex: 'uom',
      key: 'uom',
      width: '10%',
    },
  ]

  const flowColumns: ColumnsType<IFlowInfo> = [

    {
      title: 'flowId',
      dataIndex: 'flowId',
      key: 'flowId',
    },
    {
      title: '时间',
      dataIndex: 'creationTime',
      key: 'creationTime',
      render: (_, record) => <span>{moment(record.creationTime).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '料号',
      dataIndex: 'materialCode',
      key: 'materialCode',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '物料类型',
      dataIndex: 'materialType',
      key: 'materialType',
    },
    {
      title: '批号',
      dataIndex: 'batch',
      key: 'batch',
    },
    {
      title: '库存状态',
      dataIndex: 'inventoryStatus',
      key: 'inventoryStatus',
    },

    {
      title: '业务类型',
      dataIndex: 'bizType',
      key: 'bizType',
    },
    {
      title: '方向',
      dataIndex: 'direction',
      key: 'direction',
    },
    {
      title: '托盘号',
      dataIndex: 'palletCode',
      key: 'palletCode',
    },
    {
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '计量单位',
      dataIndex: 'uom',
      key: 'uom',
    },

    {
      title: '用户',
      dataIndex: 'creationUser',
      key: 'creationUser',
    },

    {
      title: '备注',
      dataIndex: 'comment',
      key: 'comment',
    },
  ]


  async function closeOrder() {
    setDoLoading(true);
    const success = await handleAction(() => closeInboundOrder(inboundOrderId));
    if (success) {
      loadData();
    }
    setDoLoading(false);
  }

  return (
    <PageContainer
      className={styles.pageHeader}
      title={
        <Spin spinning={doLoading}>
          入库单：{orderInfo?.inboundOrderCode} &nbsp;
          {
            orderInfo?.closed && <Tag color='red'>已关闭</Tag>
          }
        </Spin>
      }
      extra={
        <Fragment>
          <ButtonGroup>
            <Button
              onClick={() => { loadData() }} loading={loading}
            >
              刷新
            </Button>

            <Button
              href={history.createHref({
                pathname: `/order/inbound-orders`
              })}
            >
              列表
            </Button>

            <Button
              disabled={!!orderInfo?.closed}
              href={history.createHref({
                pathname: `/order/edit-inbound-order/${inboundOrderId}`
              })}
            >
              编辑
            </Button>

            <Button
              disabled={!!orderInfo?.closed}
              href={history.createHref({
                pathname: `/order/inbound-orders/palletize/${orderInfo?.inboundOrderId}`
              })}
            >
              组盘
            </Button>

          </ButtonGroup>
          <Popconfirm
            placement="topLeft"
            title={'确认关闭入库单？'}
            disabled={!!orderInfo?.closed}
            onConfirm={() => {
              closeOrder()
            }} okText="是" cancelText="否">
              <Button
                type="primary"
                disabled={!!orderInfo?.closed}
                loading={loading}
              >
                关闭
              </Button>
          </Popconfirm>
        </Fragment>
      }
      content={
        <Spin spinning={doLoading}>
          <Descriptions>
            <Descriptions.Item label="业务类型">{orderInfo?.bizType}</Descriptions.Item>
            <Descriptions.Item label="制单人">{orderInfo?.creationUser}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{moment(orderInfo?.creationTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
            <Descriptions.Item label="业务单号">{orderInfo?.bizOrder}</Descriptions.Item>
          </Descriptions>
        </Spin>
      }
    >
      <Spin spinning={doLoading}>
        <Card title='明细' className={styles.card} bordered={false}>
          <Table<IInboundLineInfo>
            loading={loading}
            columns={columns}
            dataSource={lines}
            rowKey='inboundLineId'
            pagination={false}
          // style={{ marginTop: 8 }}
          />
        </Card>

        <Card title="组盘记录" className={styles.card} bordered={false}>
          <Table<IFlowInfo>
            loading={loading}
            columns={flowColumns}
            dataSource={flowList}
            rowKey='flowId'
            pagination={false}
          />
        </Card>

      </Spin>


    </PageContainer>
  )
}


export default InboundDetail;
