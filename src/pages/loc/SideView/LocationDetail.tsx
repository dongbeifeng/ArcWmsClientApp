import * as React from "react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { Button, Card, Descriptions, List, Modal, Spin, Tag } from "antd";
import { getStorageLocationDetail } from "@/services/loc";
import type { IStorageLocationInfo } from "@/models/loc";
import styles from './locationdetail.less';
import { Link } from "umi";
import type { IUnitloadDetail } from "@/models/matl";
import Text from 'antd/es/typography/Text';

const LocationDetail: FC<{ locationCode: string; isShow: boolean; setShow: (arg: boolean) => void }> = ({ locationCode, isShow, setShow }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [detailInfo, setDetailInfo] = useState<IStorageLocationInfo & { exists: boolean, unitloads: IUnitloadDetail[] }>()
  useEffect(() => {
    if (locationCode !== "") {
      setLoading(true)
      getStorageLocationDetail(locationCode).then(ret => {
        setDetailInfo(ret.data)
        setLoading(false)
      });
    }
    else {
      // 清除数据
    }
  }, [locationCode]);
  return (
    <>
      <Modal
        title={
          <>
            <Text copyable>{locationCode}</Text>

              &nbsp;&nbsp;&nbsp;&nbsp;

              {detailInfo?.exists ? (<></>) : (<Tag>货位不存在</Tag>)}
            {detailInfo?.isInboundDisabled ? (<Tag color='red'>已禁入</Tag>) : (<></>)}
            {detailInfo?.isOutboundDisabled ? (<Tag color='red'>已禁出</Tag>) : (<></>)}

          </>
        }
        visible={isShow}
        confirmLoading={loading}
        onCancel={() => setShow(false)}
        footer={[

          <Button key="submit" type="primary" loading={loading} onClick={() => setShow(false)}>
            关闭
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <Descriptions>
            <Descriptions.Item label='分组'>{detailInfo?.storageGroup}</Descriptions.Item>
            <Descriptions.Item label='限高'>{detailInfo?.heightLimit}</Descriptions.Item>
            <Descriptions.Item label='限重'>{detailInfo?.weightLimit}</Descriptions.Item>
            <Descriptions.Item label='入站数'>{detailInfo?.inboundCount}</Descriptions.Item>
            <Descriptions.Item label='出站数'>{detailInfo?.outboundCount}</Descriptions.Item>
          </Descriptions>

          <div>
            {detailInfo?.unitloads.map(unitload => {
              return (
                <List
                  key={unitload.unitloadId}
                  header={<div><span>托盘：</span>
                    <Link to={`/matl/unitloads/${unitload.palletCode}`}>
                      {unitload?.palletCode}
                    </Link>  </div>}
                  bordered
                  dataSource={unitload.items}
                  renderItem={(x) => (
                    <List.Item>
                      <Card className={styles.card}
                        title={<div><span>物料编码：</span> <span>{x.materialCode}</span></div>} >
                        <div><span>数量：</span> <span>{x.quantity}</span></div>
                        <div><span>分配数量：</span> <span>{x.quantityAllocatedToOutboundOrder}</span></div>
                        <div><span>物料描述：</span> <span>{x.description}</span></div>
                        <div><span>物料批号：</span> <span>{x.batch}</span></div>
                        <div><span>物料类型：</span> <span>{x.materialType}</span></div>
                        <div><span>计量单位：</span> <span>{x.uom}</span></div>
                        <div><span>物料规格：</span> <span>{x.specification}</span></div>
                        <div><span>库存状态：</span> <span>{x.inventoryStatus}</span></div>
                      </Card>
                    </List.Item>
                  )}
                />
              )
            })}
          </div>
        </Spin>
      </Modal>
    </>
  )
}
export default LocationDetail;
