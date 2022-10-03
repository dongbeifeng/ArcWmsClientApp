// outbound-order-list.tsx
/**
 * @Author pyluo
 * @Description 出库单详情，
 * @Date 2021-02-06
 */
import { Button, Card, Divider, Form, Select, Table, Checkbox, Spin, Tooltip, Tag, Descriptions, Popconfirm, Drawer } from 'antd';
import type { FC} from 'react';
import { useCallback } from 'react';
import { Fragment } from 'react';
import React, { useEffect, useState } from 'react';
import styles from './style.less';
import type { IOutboundLineInfo, IOutboundOrderInfo, IAllocatStockOptions } from '@/models/obo';
import { allocateStock, closeOutboundOrder, getAllocatedUnitloads, getOutboundOrderDetails, deallocateStockInRack, attachToOutlets, deallocateStock } from '@/services/obo';
import { history } from 'umi';
import type { IFlowInfo, } from '@/models/matl';
import { getFlowList } from '@/services/matl';
import { getOutletOptions } from '@/services/loc';
import type { IOutletInfo } from '@/models/loc';
import { handleAction } from '@/utils/myUtils';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import ButtonGroup from 'antd/es/button/button-group';
import PickDialog from './components/PickDialog';
import type { ExcIUnitloadItemInfo } from './UIDataExten';
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';


const OutboundDetail: FC = (props: any) => {
  const [loading] = useState(false);
  const [orderInfo, setOrderInfol] = useState<IOutboundOrderInfo>();
  const [lines, setLines] = useState<IOutboundLineInfo[]>([]);
  const [unitloads, setUnitloads] = useState<ExcIUnitloadItemInfo[]>([]);
  const [flowList, setFlowList] = useState<IFlowInfo[]>([]);
  const [outletsOptions, setOutletsOptions] = useState<IOutletInfo[]>();
  const [checkedOutlets, setCheckedOutlets] = useState<string[]>([]);
  const [formAllocation] = Form.useForm<IAllocatStockOptions>();
  const [doLoading, setDoLoading] = useState(false);
  const [allocationDrawerVisible, setAllocationDrawerVisible] = useState<boolean>(false);
  const [attachToOutletsDrawerVisible, setAttachToOutletsDrawerVisible] = useState<boolean>(false);
 const [isShow,setShow] = useState(false);
 const [pickRecord,setPickRecord]= useState<ExcIUnitloadItemInfo>();

  const {
    match: {
      params: { outboundOrderId },
    },
  } = props;




  const loadData = useCallback(async () => {
    setDoLoading(true);
    const orderRes = await getOutboundOrderDetails(outboundOrderId);
    if (orderRes.success && orderRes.data) {
      setOrderInfol(orderRes.data);
      setLines(orderRes.data.lines);

      const flowsRes = await getFlowList({ orderCode: orderRes.data.outboundOrderCode }, { flowId: 'ascend' }, {});
      if (flowsRes.success && flowsRes.data) {
        setFlowList(flowsRes.data);
      }
    }

    const unitloadsRes = await getAllocatedUnitloads(outboundOrderId);
    if (unitloadsRes.success && unitloadsRes.data) {
      const exList: ExcIUnitloadItemInfo[] = unitloadsRes.data.flatMap(u =>
        u.items.map(it => ({
          ...it,
          palletCode: u.palletCode,
          locationCode: u.locationCode,
          locationType: u.locationType,
          streetletCode: u.streetletCode,
        }))
      );
      setUnitloads(exList)
    }

    setDoLoading(false);
  }, [outboundOrderId]);


  // 获取投放口选项列表数据
  const getOutlet = () => {
    getOutletOptions().then((res) => {
      if (res.data) {
        setOutletsOptions(res.data || []);
      }
    });
  }

  useEffect(() => {
    getOutlet()
    if (outboundOrderId > 0) {
      loadData();
    }

  }, [loadData, outboundOrderId]);


  // 选中出库口出发事件
  function onChangeSelectOutlet(checkedValues: CheckboxValueType[]) {
    setCheckedOutlets(checkedValues.map(x => (x as string)));
  }

  // 出库单下架设置出口
  async function setAttachToOutlet() {
    setDoLoading(true);
    const success = await handleAction(() => attachToOutlets({ outboundOrderId, outlets: checkedOutlets}));
    if (success) {
      getOutlet();
    }
    setDoLoading(false);
    setAttachToOutletsDrawerVisible(false);
  }

  function showPicInfo(record: ExcIUnitloadItemInfo) {
    setPickRecord(record)
    setShow(true)
  }


  const columns = [
    {
      title: 'ID',
      key: 'outboundLineId',
      dataIndex: 'outboundLineId',
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
      title: '应出',
      dataIndex: 'quantityDemanded',
      key: 'quantityDemanded',
      width: '10%',
    },
    {
      title: '已出',
      dataIndex: 'quantityFulfilled',
      key: 'quantityFulfilled',
      width: '10%',
    },
    {
      title: '单位',
      dataIndex: 'uom',
      key: 'uom',
      width: '10%',
    },
  ]

  const flowColumns = [

    {
      title: 'flowId',
      dataIndex: 'flowId',
      key: 'flowId',
    },
    {
      title: '时间',
      dataIndex: 'creationTime',
      key: 'creationTime',
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
    // {
    //   title: '业务单号',
    //   dataIndex: 'bizOrder',
    //   key: 'bizOrder',
    // },
    // {
    //   title: '操作类型',
    //   dataIndex: 'operationType',
    //   key: 'operationType',
    // },
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

  const unitloadColums = [
    {
      title: '托盘',
      key: 'palletCode',
      dataIndex: 'palletCode',
      width: '10%',
    },
    {
      title: '物料',
      key: 'materialCode',
      dataIndex: 'materialCode',
      width: '10%',
    },
    {
      title: '描述',
      key: 'description',
      dataIndex: 'description',
      width: '10%',
    },
    {
      title: '批号',
      key: 'batch',
      dataIndex: 'batch',

    },
    {
      title: '状态',
      key: 'inventoryStatus',
      dataIndex: 'inventoryStatus',
    },

    {
      title: '分配量',
      key: 'quantityAllocatedToOutboundOrder',
      dataIndex: 'quantityAllocatedToOutboundOrder',
    },
    {
      title: '库存量',
      key: 'quantity',
      dataIndex: 'quantity',
      width: '10%',
    },
    {
      title: '单位',
      key: 'uom',
      dataIndex: 'uom',

    },
    {
      title: '位置',
      key: 'locationCode',
      dataIndex: 'locationCode',
      width: '10%',
    },
    {
      title: '巷道',
      key: 'streetletCode',
      dataIndex: 'streetletCode',
      width: '10%',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_: any, record: ExcIUnitloadItemInfo) => (
        <>
          <Popconfirm placement="topLeft" title={'确认取消分配？'} onConfirm={async () => {
            setDoLoading(true);
            const success = await handleAction(() => deallocateStock({
              outboundOrderId,
              palletCodes: [record.palletCode]
            }));
            if (success) {
              loadData();
            }
            setDoLoading(false);
          }} okText="是" cancelText="否">
            <a
              href="#"
            >
              取消分配
            </a>
          </Popconfirm>
          {
            (record.locationCode === 'N' || record?.locationType === 'K') &&
            (
              <>
                <Divider type='vertical' />

                <a onClick={() => showPicInfo(record)}>拣选</a>
              </>
            )
          }

        </>
      ),
    },
  ]

  async function allocate() {
    const options: IAllocatStockOptions = formAllocation.getFieldsValue();
    setDoLoading(true);
    const success = await handleAction(() => allocateStock({
      outboundOrderId,
      options
    }));
    if (success) {
      loadData();
    }
    setDoLoading(false);
    setAllocationDrawerVisible(false);
  }

  async function closeOrder() {
    setDoLoading(true);
    const success = await handleAction(() => closeOutboundOrder(outboundOrderId));
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
          出库单：{orderInfo?.outboundOrderCode} &nbsp;
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
                pathname: `/order/outbound-orders`
              })}
            >
              列表
            </Button>

            <Button
              disabled={!!orderInfo?.closed}
              href={history.createHref({
                pathname: `/order/edit-outbound-order/${outboundOrderId}`
              })}
            >
              编辑
            </Button>

          </ButtonGroup>
          <Popconfirm
            placement="topLeft"
            title={'确认关闭出库单？'}
            disabled={!!orderInfo?.closed}
            onConfirm={() => {
              closeOrder()
            }}
            okText="是"
            cancelText="否">
              <Button
                disabled={!!orderInfo?.closed}
                type="primary"
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
          <Table<IOutboundLineInfo>
            loading={loading}
            columns={columns}
            dataSource={lines}
            rowKey='outboundLineId'
            pagination={false}
          // style={{ marginTop: 8 }}
          />
        </Card>
        {
          !orderInfo?.closed &&
          <Card
            title='分配的库存'
            extra={
              <ButtonGroup>
                <Button
                  onClick={() => setAllocationDrawerVisible(true)}>
                  分配
                </Button>

                <Button
                  onClick={() => setAttachToOutletsDrawerVisible(true)}>
                  下架
                </Button>
              </ButtonGroup>
            }
            className={styles.card} bordered={false}
          >

            <Table<ExcIUnitloadItemInfo>
              loading={loading}
              columns={unitloadColums}
              rowKey='unitloadItemId'
              dataSource={unitloads}
              pagination={false}
            />

          </Card>
        }

        <Card title="拣货记录" className={styles.card} bordered={false}>
          <Table<IFlowInfo>
            loading={loading}
            columns={flowColumns}
            dataSource={flowList}
            rowKey='flowId'
            pagination={false}
          />
        </Card>


        <Drawer title='分配库存' height={480}
          visible={allocationDrawerVisible}
          placement='bottom'
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button type="primary"
                onClick={async () => {
                  setDoLoading(true);
                  const success = await handleAction(() => deallocateStockInRack(outboundOrderId));
                  if (success) {
                    loadData();
                  }
                  setDoLoading(false);
                  setAllocationDrawerVisible(false);
                }}
                loading={loading}
                style={{ marginRight: 8 }}
              >
                取消库内分配
              </Button>

              <Button type="primary" onClick={allocate} loading={loading} style={{ marginRight: 8 }}>
                分配
              </Button>
            </div>
          }
          onClose={() => setAllocationDrawerVisible(false)}
        >

          <Form
            form={formAllocation}
            layout="vertical"
            hideRequiredMark
          >
            <Form.Item
              label="区域"
              name="areas"
            >
              <Select mode='tags' tokenSeparators={[',', '，']} placeholder='指示在哪些区域选中托盘分配'>
              </Select>
            </Form.Item>
            <Form.Item
              label="包含货载"
              name="includePallets"
            >
              <Select mode='tags' tokenSeparators={[',', '，']} placeholder='一组托盘编码，这些货载在分配时具有高优先级，库外的货载只有被显式包含才会分配'>
              </Select>
            </Form.Item>

            <Form.Item
              label="排除货载"
              name="excludePallets"
            >
              <Select mode='tags' tokenSeparators={[',', '，']} placeholder='一组托盘编码，这些货载不参与分配，即使出现在包含列表里'>
              </Select>
            </Form.Item>

            <Form.Item
              name="skipStreetletsOutboundDisabled"
              valuePropName="checked" >
              <Checkbox>跳过禁出的巷道 &nbsp;
                <span style={{ color: 'red' }}>跳过禁出的巷道会打破先入先出规则</span>
              </Checkbox>
            </Form.Item>
          </Form>
        </Drawer>


        <Drawer title='下架'
          height={360}
          visible={attachToOutletsDrawerVisible}
          placement='bottom'
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button type="primary" onClick={setAttachToOutlet} loading={loading}>
                将出库单附加到出口
              </Button>
            </div>
          }
          onClose={() => setAttachToOutletsDrawerVisible(false)}
        >
          <Form layout='vertical'>
            <Form.Item label='出口：'>
              <Checkbox.Group style={{ width: '100%', marginBottom: 16 }}
                defaultValue={
                  outletsOptions
                    ?.filter(x => x.currentUat === orderInfo?.outboundOrderCode)
                    ?.map(x => x.outletCode) ?? []
                }
                onChange={onChangeSelectOutlet}>
                {outletsOptions?.map((item) => {
                  return (
                    !!item.currentUat && item.currentUat !== orderInfo?.outboundOrderCode
                      ?
                      <Tooltip title={`被 ${item.currentUat} 占用`} key={item.outletId}>
                        <Checkbox
                          key={item.outletId}
                          value={item.outletCode}
                          disabled
                        >
                          {item.outletCode}
                        </Checkbox>
                      </Tooltip>
                      :
                      <Checkbox
                        key={item.outletId}
                        value={item.outletCode}
                      >
                        {item.outletCode}
                      </Checkbox>
                  )
                })}
              </Checkbox.Group>
            </Form.Item>
          </Form>
        </Drawer>

      </Spin>

      {
        pickRecord &&
          <PickDialog isShow={isShow} unitLoadInfo={pickRecord} setShow={setShow} success={loadData}/>
      }

    </PageContainer>
  )
}


export default OutboundDetail;
