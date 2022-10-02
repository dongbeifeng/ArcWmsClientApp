 import { IDashboardData } from '@/models/rpt';
import { RequestData } from '@ant-design/pro-table';
import { request } from 'umi';

export async function getAnalysis() {
  return request<RequestData<IDashboardData>>(`api/rpt/get-dashboard-data`, {
    method: 'POST',
  });
}
