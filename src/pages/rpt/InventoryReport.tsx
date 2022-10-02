import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import type { IInventoryReportArgs, IInventoryReprotItemInfo } from '@/models/rpt';
import { getInventoryReport } from '@/services/rpt';
import { defaultSearchConfig } from '@/defaultColConfig';

export default () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<IInventoryReprotItemInfo>[] = [
    {
      title: '物料编码',
      dataIndex: 'materialCode',
    },
    {
      title: '物料名称',
      dataIndex: 'description',
      search: false,
    },
    {
      title: '批次',
      dataIndex: 'batch',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'inventoryStatus',
      search: false,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      search: false,
    },
    {
      title: '单位',
      dataIndex: 'uom',
      search: false,
    },
  ];

  return (
    <PageContainer>
      <ProTable<IInventoryReprotItemInfo, IInventoryReportArgs>
        headerTitle="实时库存"
        actionRef={actionRef}
        rowKey={row => row.materialCode + row.batch + row.inventoryStatus + row.uom}
        search={defaultSearchConfig}
        toolBarRender={() => []}
        request={getInventoryReport}
        columns={columns}
      />
    </PageContainer>
  );
};

