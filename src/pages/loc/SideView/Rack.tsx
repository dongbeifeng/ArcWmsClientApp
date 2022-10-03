import type { ISideViewLocation } from "@/models/loc";
import * as React from "react";
import orderBy from 'lodash/orderBy';
import './css.css'
import type { FC } from "react";
import { Level } from "./Level";

type LevelNo = number;
type RackData = Record<LevelNo, ISideViewLocation[]>;

export const Rack: FC<{
  dispalyText: string;
  rack: RackData;
  baySortOrder: 'asc' | 'desc';
  showDetail: (Locationcode: string) => void;
}> = ({ dispalyText: rackLabel, rack, baySortOrder: baySortOrder, showDetail }) => {
  const levelNos = Object.keys(rack);
  const firstLevel = rack[+levelNos[0]];
  const firstLoc = firstLevel[0];
  return (
    <>
      <table className="rack" cellPadding="0" cellSpacing="2">
        <caption style={{ captionSide: 'top' }}>
           {rackLabel}  {firstLoc.locationCode.split("-", 1)[0]}
        </caption>
        <tbody>
          {
            orderBy(levelNos, levelNo => +levelNo, 'desc')
              .map(levelNo => {
                return (
                  <Level key={+levelNo} levelNo={+levelNo} locs={rack[+levelNo]} baySortOrder={baySortOrder} showDetail={showDetail} />
                );
              })
          }
        </tbody>
      </table>
    </>
  );
}
