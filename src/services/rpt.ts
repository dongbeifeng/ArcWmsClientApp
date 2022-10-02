import type { IAgeReportListArgs, IAgeReportItemInfo, IMonthlyReportArgs, IMonthlyReportItemInfo, IInventoryReportArgs, IInventoryReprotItemInfo, IDashboardData } from '@/models/rpt';
import { trimArgs } from '@/utils/mapUtil';
import { sortToString } from '@/utils/myUtils';

import type { RequestData } from '@ant-design/pro-table';
import type { SortOrder } from 'antd/es/table/interface';
import { request } from 'umi';

export async function getInventoryReport(
  params: IInventoryReportArgs,
  sort: Record<string, SortOrder>,
) {
  return request<RequestData<IInventoryReprotItemInfo>>('api/rpt/get-inventory-report', {
    method: 'POST',
    data: {
      ...trimArgs(params),
      sort: sortToString(sort),
    },
  });
}

export async function getAgeReport(params: IAgeReportListArgs) {
  return request<RequestData<IAgeReportItemInfo>>('api/rpt/get-age-report', {
    method: 'POST',
    data: {
      ...trimArgs(params),
    },
  });
}

export async function getMonthlyReport(params: IMonthlyReportArgs) {
  return request<RequestData<IMonthlyReportItemInfo>>(`api/rpt/get-monthly-report`, {
    method: 'POST',
    data: {
      month: params.month,
    }
  });
}


export async function getDashboardData() {
  return request<RequestData<IDashboardData>>(`api/rpt/get-dashboard-data`, {
    method: 'POST',
  });
}
