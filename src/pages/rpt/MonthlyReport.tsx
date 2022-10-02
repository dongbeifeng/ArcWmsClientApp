import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { defaultSearchConfig } from '@/defaultColConfig';
import { getMonthlyReport } from '@/services/rpt';
import type { IMonthlyReportArgs, IMonthlyReportItemInfo } from '@/models/rpt';


function getKey(record: IMonthlyReportItemInfo) {
  const key = record.materialCode + record.batch + record.inventoryStatus + record.uom;
  return key;
}

function getLastMonth() {
  const date = new Date();
  let year = date.getFullYear();
  let month: number | string = date.getMonth();
  if (month === 0) {
       year -= 1;
       month = 12;
  }
  if (month < 10) {
    month = `0${month}`;
  }
  return `${year}-${month}`;
}

export default () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<IMonthlyReportItemInfo>[] = [
    {
      title: '月份',
      dataIndex: 'month',
      hideInTable: true,
      valueType: 'dateMonth',
      initialValue: getLastMonth(),
    },
    {
      title: '物料',
      dataIndex: 'materialCode',
      search: false,
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
      title: '期初',
      dataIndex: 'beginning',
      search: false,
    },
    {
      title: '流入',
      dataIndex: 'incoming',
      search: false,
    },
    {
      title: '流出',
      dataIndex: 'outgoing',
      search: false,
    },
    {
      title: '期末',
      dataIndex: 'ending',
      search: false,
    },
  ];

  return (
    <PageContainer>
      <ProTable<IMonthlyReportItemInfo, IMonthlyReportArgs>
        headerTitle="库存月报"
        actionRef={actionRef}
        rowKey={getKey}
        search={defaultSearchConfig}
        toolBarRender={() => []}
        request={getMonthlyReport}
        columns={columns}
        pagination={false}
      />
    </PageContainer>
  );
};

