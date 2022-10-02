import type { ISideViewLocation } from "@/models/loc";
import * as React from "react";
import type { FC} from "react";
import './cbox.less'
import './tooltip.less'
import { LayoutOutlined } from "@ant-design/icons";


const CBox: FC<{ location: ISideViewLocation }> = (props) => {
  return (
    <>
        <div
          className={`cbox tooltip ${props.location.exists ? '' : 'notexists'}`}
          data-location-id={props.location.locationId}
          data-height-limit={props.location.heightLimit}
          data-weight-limit={props.location.weightLimit}
          data-storage-group={props.location.storageGroup}
          data-specification={props.location.specification}
        >
          {
            props.location.loaded &&
            <LayoutOutlined title="有货" rotate={-90} style={{ verticalAlign: 'bottom', fontSize: '16px', color: '#08c'  }}/>
          }
        </div>
    </>
  )
}
export default CBox;
