// inbound-order-list.tsx
/**
 * @Author pyluo
 * @Description 入库单列表 ，使用嵌套表格的方式实现
 * @Date 2021-03-15
 */
 import React, {  } from 'react';
 import { PageContainer } from '@ant-design/pro-layout';
 import type { ProColumns } from '@ant-design/pro-table';
 import ProTable from '@ant-design/pro-table';
 import { Button, Space } from 'antd';
 import { PlusOutlined } from '@ant-design/icons';
 import { history, Link } from 'umi';
 import { defaultSearchConfig } from '@/defaultColConfig';
 import { buildbooleanMap } from '@/utils/mapUtil';
import type { IInboundLineInfo, IInboundOrderInfo, IInboundOrderListArgs } from '@/models/ibo';
import { getInboundOrderList } from '@/services/ibo';
import moment from 'moment';




 export default () => {

   const expandedRowRender = (rowData: IInboundOrderInfo) => {
     const columnsDetail = [
       { title: '物料编码', dataIndex: 'materialCode', key: 'materialCode' },
       { title: '物料类型', dataIndex: 'materialType', key: 'materialType' },
       { title: '物料描述', dataIndex: 'description', key: 'description' },
       { title: '物料规格', dataIndex: 'specification', key: 'specification' },
       { title: '批号', dataIndex: 'batch', key: 'batch' },
       { title: '库存状态', dataIndex: 'inventoryStatus', key: 'inventoryStatus' },
       { title: '计量单位', dataIndex: 'uom', key: 'uom' },
       { title: '应入数量', dataIndex: 'quantityExpected', key: 'quantityExpected' },
       { title: '已入数量', dataIndex: 'quantityReceived', key: 'quantityReceived' },
       { title: '备注', dataIndex: 'comment', key: 'comment' },
     ];

     const data: IInboundLineInfo[] = rowData.lines || [];

     return (
       <ProTable
         columns={columnsDetail}
         dataSource={data}
         headerTitle={false}
         search={false}
         options={false}
         pagination={false}
       />
     );
   };

   const columns: ProColumns<IInboundOrderInfo>[] = [
     {
       title: '编码',
       dataIndex: 'inboundOrderCode',
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
       title: '创建人',
       dataIndex: 'creationUser',
       search: false,
     },
     {
       title: '创建时间',
       dataIndex: 'creationTime',
       search: false,
       render: (_, record) => <span>{moment(record.creationTime).format('YYYY-MM-DD HH:mm:ss')}</span>,
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

     {
       title: '关闭人',
       dataIndex: 'closedBy',
       search: false,
     },
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
           <Link to={`/order/inbound-orders/${record.inboundOrderId}`}>
             详细
           </Link>
         {!record.closed &&
           <Link to={`/order/edit-inbound-order/${record.inboundOrderId}`}>
             修改
           </Link>
         }
         </Space>
       ),
     },
   ];

   return (
     <PageContainer>
       <ProTable<IInboundOrderInfo, IInboundOrderListArgs>
         headerTitle="入库单列表"
         rowKey="inboundOrderId"
         search={defaultSearchConfig}
         toolBarRender={() => [
           <Button
             type="primary"
             href={history.createHref({
              pathname: `/order/create-inbound-order`
            })}
           >
             <PlusOutlined /> 新建
           </Button>,
         ]}
         expandable={{ expandedRowRender }}
         request={getInboundOrderList}
         columns={columns}
       />
     </PageContainer>
   );
 };

