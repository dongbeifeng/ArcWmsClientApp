import { IUnitloadItemInfo } from "@/models/matl";

/**
 * 出库单分配的库存项
 */
 export interface ExcIUnitloadItemInfo extends IUnitloadItemInfo {
   /**
    * 托盘编码
    */
    palletCode: string;
    /**
     * 货位编号
     */
    locationCode: string;
    /**
     * 货位类型
     */
    locationType: string;
    /**
     * 巷道编码
     */
    streetletCode: string | null;
  }
