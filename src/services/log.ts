import type { ILogEntry, ILogListArgs, ITraceLogArgs } from '@/models/log';
import { trimArgs } from '@/utils/mapUtil';
import type { RequestData } from '@ant-design/pro-table';
import { request } from 'umi';

export async function getLogList(
  params: ILogListArgs,
  ) {
  return request<RequestData<ILogEntry>>('api/log/get-log-list', {
    method: 'POST',
    data: {
      ...trimArgs(params),
      sort: 'logId DESC',
    },
  });
}

export async function traceLog(params: ITraceLogArgs) {
  return request('api/log/trace-log', {
    method: 'POST',
    data: {
      ...trimArgs(params),
      sort: 'logId',
    },
  });
}
