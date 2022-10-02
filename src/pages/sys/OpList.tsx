import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type {IOpListArgs,IOpListInfo } from '@/models/sys';
import { getOpList } from '@/services/sys';
import { defaultSearchConfig } from '@/defaultColConfig';
import moment from 'moment';

export default () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<IOpListInfo>[] = [
    {
      title: '时间',
      dataIndex: 'creationTime',
      render: (_, record) => moment(record.creationTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作人',
      dataIndex: 'creationUser',
    },
    {
      title: '操作类型',
      dataIndex: 'operationType',
    },
    {
      title: 'Url',
      dataIndex: 'url',
      search: false,
    },
    {
      title: '备注',
      dataIndex: 'comment',
      search: false,
      width: 450,
      ellipsis: true,
    },
  ];

  return (
    <PageContainer>
      <ProTable<IOpListInfo, IOpListArgs>
        headerTitle="操作记录列表"
        actionRef={actionRef}
        rowKey="opId"
        search={defaultSearchConfig}
        toolBarRender={() => []}
        request={getOpList}
        columns={columns}
      />
    </PageContainer>
  );
};

