import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ITaskListArgs, ITaskInfo } from '@/models/tsk';
import { getTaskList } from '@/services/tsk';
import { VerticalCell } from '@/components/VerticalCell';
import { defaultSearchConfig } from '@/defaultColConfig';

export default () => {

  const columns: ProColumns<ITaskInfo>[] = [
    {
      title: '任务号',
      dataIndex: 'taskCode',
      copyable: true,
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
    },
    {
      title: '托盘',
      dataIndex: 'palletCode',
    },
    {
      title: '起点',
      dataIndex: 'startLocationCode',
    },
    {
      title: '终点',
      dataIndex: 'endLocationCode',
    },
    {
      title: '端点',
      dataIndex: 'anyLocationCode',
      hideInTable: true,
    },
    {
      title: '下发',
      dataIndex: 'sendTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '单据',
      dataIndex: 'orderCode',
    },
    {
      title: '料号',
      dataIndex: 'materialCode',
      render: (_, record) => VerticalCell(record.items.map(x => x.materialCode)),
    },
    {
      title: '描述',
      dataIndex: 'description',
      search: false,
      render: (_, record) => VerticalCell(record.items.map(x => x.description)),
    },
    {
      title: '批号',
      dataIndex: 'batch',
      render: (_, record) => VerticalCell(record.items.map(x => x.batch)),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      search: false,
      render: (_, record) => VerticalCell(record.items.map(x => x.quantity)),
    },
    {
      title: '计量单位',
      dataIndex: 'uom',
      search: false,
      render: (_, record) => VerticalCell(record.items.map(x => x.uom)),
    },
    {
      title: '备注',
      dataIndex: 'comment',
      search: false,
    },

  ];

  return (
    <PageContainer>
      <ProTable<ITaskInfo, ITaskListArgs>
        headerTitle="任务列表"
        rowKey="taskId"
        search={defaultSearchConfig}
        toolBarRender={() => []}
        request={getTaskList}
        columns={columns}
      />
    </PageContainer>
  );
};

