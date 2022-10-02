import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { defaultSearchConfig } from '@/defaultColConfig';
import type { IAgeReportListArgs, IAgeReportItemInfo } from '@/models/rpt';
import { getAgeReport } from '@/services/rpt';


function getKey(record: IAgeReportItemInfo) {
  const key = record.materialCode + record.batch + record.inventoryStatus + record.uom;
  return key;
}
export default () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<IAgeReportItemInfo>[] = [
    {
      title: '物料',
      dataIndex: 'materialCode',
    },
    {
      title: '描述',
      dataIndex: 'description',
      search: false,
    },
    {
      title: '批号',
      dataIndex: 'batch',
      search: false,
    },
    {
      title: '库存状态',
      dataIndex: 'inventoryStatus',
      search: false,
    },
    {
      title: '计量单位',
      dataIndex: 'uom',
      search: false,
    },
    {
      title: '0到7天',
      dataIndex: 'zeroToSevenDays',
      search: false,
    },
    {
      title: '7到30天',
      dataIndex: 'sevenToThirtyDays',
      search: false,
    },
    {
      title: '30到90天',
      dataIndex: 'thirtyToNinetyDays',
      search: false,
    },
    {
      title: '90天以上',
      dataIndex: 'moreThanNinetyDays',
      search: false,
    },
  ];

  return (
    <PageContainer>
      <ProTable<IAgeReportItemInfo, IAgeReportListArgs>
        headerTitle={`库龄报表 ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`}
        actionRef={actionRef}
        rowKey={getKey}
        search={defaultSearchConfig}
        toolBarRender={() => []}
        request={getAgeReport}
        columns={columns}
        pagination={false}
      />
    </PageContainer>
  );
};

