// outbound-order-list.tsx
/**
 * @Author pyluo
 * @Description 出库单列表 ，使用嵌套表格的方式实现
 * @Date 2021-01-03
 */
import React, {  } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type {
  IOutboundLineInfo,
  IOutboundOrderListArgs,
  IOutboundOrderInfo
} from '@/models/obo';
import { Button, Space } from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import { history, Link } from 'umi';
import { defaultSearchConfig } from '@/defaultColConfig';
import { buildbooleanMap } from '@/utils/mapUtil';
import { getOutboundOrderList } from '@/services/obo';
import moment from 'moment';



export default () => {

  const expandedRowRender = (rowData: IOutboundOrderInfo) => {
    const columns = [
      { title: '物料编码', dataIndex: 'materialCode', key: 'materialCode' },
      { title: '物料类型', dataIndex: 'materialType', key: 'materialType' },
      { title: '物料描述', dataIndex: 'description', key: 'description' },
      { title: '物料规格', dataIndex: 'specification', key: 'specification' },
      { title: '批号', dataIndex: 'batch', key: 'batch' },
      { title: '库存状态', dataIndex: 'inventoryStatus', key: 'inventoryStatus' },
      { title: '计量单位', dataIndex: 'uom', key: 'uom' },
      { title: '需求数量', dataIndex: 'quantityDemanded', key: 'quantityDemanded' },
      { title: '已出数量', dataIndex: 'quantityFulfilled', key: 'quantityFulfilled' },
      { title: '未出数量', dataIndex: 'quantityUnfulfilled', key: 'quantityUnfulfilled' },
      { title: '备注', dataIndex: 'comment', key: 'comment' },
    ];

    const data: IOutboundLineInfo[] = rowData.lines;

    return (
      <ProTable
        columns={columns}
        dataSource={data}
        headerTitle={false}
        search={false}
        options={false}
        pagination={false}
      />
    );
  };

  const columns: ProColumns<IOutboundOrderInfo>[] = [
    // {
    //   title: 'Id',
    //   dataIndex: 'outboundOrderId',
    //   sorter: true,
    //   copyable: false,
    // },
    {
      title: '编码',
      dataIndex: 'outboundOrderCode',
      sorter: true,
      copyable: true,
    },
    {
      title: '业务单据号',
      dataIndex: 'bizOrder',
      search: false,
    },
    {
      title: '业务类型',
      dataIndex: 'bizType',
    },
    {
      title: '制单人',
      dataIndex: 'creationUser',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'creationTime',
      search: false,
      render: (record) => <span>{moment(record.creationTime).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '是否已关闭',
      dataIndex: 'closed',
      hideInSearch: false,
      valueType: 'radioButton',
      valueEnum: buildbooleanMap('全部', '已关闭', '未关闭'),
      initialValue: 'false',
    },
    {
      title: '关闭时间',
      dataIndex: 'closedAt',
      search: false,
    },

    // {
    //   title: '修改人',
    //   dataIndex: 'modificationUser',
    //   search: false,
    // },
    // {
    //   title: '修改时间',
    //   dataIndex: 'modificationTime',
    //   search: false,
    // },
    {
      title: '备注',
      dataIndex: 'comment',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/order/outbound-orders/${record.outboundOrderId}`}>
            详细
          </Link>
        {!record.closed &&
          <Link to={`/order/edit-outbound-order/${record.outboundOrderId}`}>
            修改
          </Link>
        }
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<IOutboundOrderInfo, IOutboundOrderListArgs>
        headerTitle="出库单列表"
        rowKey="outboundOrderId"
        search={defaultSearchConfig}
        toolBarRender={() => [
          <Button
            type="primary"
            href={history.createHref({
              pathname: `/order/create-outbound-order`
            })}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        expandable={{ expandedRowRender }}
        request={getOutboundOrderList}
        columns={columns}
      />
    </PageContainer>
  );
};

