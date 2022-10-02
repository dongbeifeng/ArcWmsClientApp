import type { ISideViewLocation } from "@/models/loc";
import * as React from "react";
import orderBy from 'lodash/orderBy';
import './css.css'
import CBox from "./cbox";
import type { FC } from "react";

export const Level: FC<{
  levelNo: number;
  locs: ISideViewLocation[];
  colSortOrder: 'asc' | 'desc';
  showDetail: (Locationcode: string) => void;
}> = ({ levelNo, locs, colSortOrder ,showDetail}) => {
  return (
    <tr key={levelNo}>
      {
        orderBy(locs, x => x.column, colSortOrder )
          .map(loc => {
            return (
              <td
                key={loc.locationId}
               onDoubleClick={()=>{showDetail(loc.locationCode)}}
                title={`${loc.column} 列 ${loc.level} 层 ${loc.isInboundDisabled && '已禁入' || ''} ${loc.isOutboundDisabled && '已禁出' || ''} ${loc.exists ? '' : '货位不存在'}`}
                className={`${loc.isInboundDisabled ? 'isInboundDisabled' : ''} ${loc.isOutboundDisabled ? 'isOutboundDisabled' : ''}`}
              >
                <CBox key={loc.locationId} location={loc} ></CBox>
              </td>
            );
          })
      }
    </tr>
  );
}
