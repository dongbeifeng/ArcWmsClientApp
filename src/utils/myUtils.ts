import type { IApiData } from "@/services/IApiData";
import { message } from "antd";
import type { SortOrder } from "antd/es/table/interface";

export function sortToString(sort?: Record<string, SortOrder>) {
  return sort
    ? Object.keys(sort).map(key => `${key} ${sort[key] === 'descend' ? 'DESC' : 'ASC' }`).join(', ')
    : '';
}


export const handleAction = async (service: () => Promise<IApiData>) => {
  const hide = message.loading('正在处理', 30);
  try {
    await service();
    hide();
    message.success('操作成功');
    return true;
  } catch (error) {
    hide();
    const msg = error instanceof Error ? error.message : error;
    message.error(`操作失败：${msg}`, 15);
    return false;
  }
};
