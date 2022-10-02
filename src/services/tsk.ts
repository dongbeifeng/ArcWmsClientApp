import type { IArchivedTaskInfo, IArchivedTaskListArgs, ITaskListArgs, ITaskInfo, IChangeUnitloadLocationArgs, ICreateManualTaskArgs, } from '@/models/tsk';
import { trimArgs } from '@/utils/mapUtil';
import { sortToString } from '@/utils/myUtils';

import type { RequestData } from '@ant-design/pro-table';
import type { SortOrder } from 'antd/es/table/interface';
import { request } from 'umi';
import type { IApiData } from './IApiData';

export async function getTaskList(params: ITaskListArgs) {
  return request<RequestData<ITaskInfo>>('api/tsk/get-task-list', {
    method: 'POST',
    data: trimArgs(params),
  });
}

export async function getArchivedTaskList(
  params: IArchivedTaskListArgs,
  sort: Record<string, SortOrder>,
  filter: Record<string, React.ReactText[] | null>,
) {
  return request<RequestData<IArchivedTaskInfo>>('api/tsk/get-archived-task-list', {
    method: 'POST',
    data: {
      ...trimArgs(params),
      sort: sortToString(sort),
      filter,
    },
  });
}

export async function changeUnitloadLocation(args: IChangeUnitloadLocationArgs) {
  return request<IApiData>(`api/tsk/change-unitload-location`, {
    method: 'POST',
    data: args,
  });
}

export async function createManualTask(args: ICreateManualTaskArgs) {
  return request<IApiData>(`api/tsk/create-manual-task`, {
    method: 'POST',
    data: args,
  });
}

export async function getTaskTypeOptions() {
  return request<IApiData<string[]>>(`api/tsk/get-task-type-options`, {
    method: 'POST',
  });
}
