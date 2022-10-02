import * as React from "react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { Button, Descriptions, InputNumber, message, Modal, Spin } from "antd";
import { pick } from "@/services/obo";
import type { ExcIUnitloadItemInfo } from "../UIDataExten";

interface IPickDialog {
  isShow: boolean,
  unitLoadInfo: ExcIUnitloadItemInfo,
  setShow: (arg: boolean) => void,
  success: () => void,
}

const PickDialog: FC<IPickDialog> = (props: IPickDialog) => {
  const { isShow, unitLoadInfo, setShow, success } = props
  const [loading, setLoading] = useState<boolean>(false);
  const [currentNum, setCurrentNum] = useState<number>(unitLoadInfo?.quantityAllocatedToOutboundOrder || 0)

  useEffect(() => {
    if (isShow)
      setCurrentNum(unitLoadInfo?.quantityAllocatedToOutboundOrder || 0)
  }, [isShow]);

  function onSubmit() {
    pick({
      palletCode: unitLoadInfo.palletCode,
      pickInfos: [{
        unitloadItemAllocationId: unitLoadInfo.allocationsToOutboundOrder[0].unitloadItemAllocationId,
        quantityPicked: currentNum
      }],
    }).then(retmsg => {
      if (retmsg.success) {
        message.success("拣选成功！")
        success()
        setShow(false)
      } else {
        message.error(retmsg.errorMessage);
      }
    }).catch(error => {
      message.error('拣货出错请联系管理员！');
      console.log(error)
    }).finally(() => { setLoading(false) })

  }
  return (
    <>
      <Modal
        title={`出库拣货，托盘 ${unitLoadInfo?.palletCode}`}
        visible={isShow}
        confirmLoading={loading}
        onCancel={() => setShow(false)}
        footer={[

          <Button key="submit" loading={loading} onClick={() => setShow(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={() => onSubmit()}>
            提交
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <Descriptions>
            <Descriptions.Item label='物料'>{unitLoadInfo?.materialCode}</Descriptions.Item>
            <Descriptions.Item label='描述'>{unitLoadInfo?.description}</Descriptions.Item>
            <Descriptions.Item label='批号'>{unitLoadInfo?.batch}</Descriptions.Item>
            <Descriptions.Item label='状态'>{unitLoadInfo?.inventoryStatus}</Descriptions.Item>
            <Descriptions.Item label='分配量'>{unitLoadInfo?.quantityAllocatedToOutboundOrder}</Descriptions.Item>
            <Descriptions.Item label='库存量'>{unitLoadInfo?.quantity}</Descriptions.Item>
            <Descriptions.Item label='单位'>{unitLoadInfo?.uom}</Descriptions.Item>
            <Descriptions.Item label='位置'>{unitLoadInfo?.locationCode}</Descriptions.Item>
          </Descriptions>

          <div>
            拣货数量：  <InputNumber min={0} max={9999999} value={currentNum} onChange={setCurrentNum} />
          </div>
        </Spin>
      </Modal>
    </>
  )
}
export default PickDialog;
