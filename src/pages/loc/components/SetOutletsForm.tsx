import React, { useEffect, useState } from 'react';
import { Checkbox, Modal, Space } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import useSafeState from '@/utils/useSafeState';

const CheckboxGroup = Checkbox.Group;

export interface SetOutletFormProps {
  onCancel: () => void;
  onSubmit: (values: number[]) => void;
  streetletCode: string;
  OutletOptions: { label: string; value: number }[];
  streetletsOutlets: number[];
}

export default (props: SetOutletFormProps) => {
  const [checkAll, setCheckAll] = useState<boolean>();
  const [indeterminate, setIndeterminate] = useState<boolean>();
  const [checkedOutlets, setCheckedOutlets] = useState<number[]>([]);
  const [confirmLoading, setConfirmLoading] = useSafeState(false);

  useEffect(() => {
    setCheckedOutlets(props.streetletsOutlets);
    setIndeterminate(!!props.streetletsOutlets.length && props.streetletsOutlets.length < props.OutletOptions.length);
    setCheckAll(props.streetletsOutlets.length === props.OutletOptions.length);
  }, [props.streetletsOutlets.length, props.OutletOptions.length, props.streetletsOutlets]);

  const onChange = (checkedValue: CheckboxValueType[]) => {
    setCheckedOutlets(checkedValue.map(x => +x));
    setIndeterminate(!!checkedValue.length && checkedValue.length < props.OutletOptions.length);
    setCheckAll(checkedValue.length === props.OutletOptions.length);
  };

  const onCheckAllChange = (e: any) => {
    setCheckAll(e.target.checked);
    setCheckedOutlets(e.target.checked ? props.OutletOptions.map((x) => x.value) : []);
    setIndeterminate(false);
  };



  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title={`设置巷道 ${props.streetletCode} 可到达的出口`}
      visible={true}
      confirmLoading={confirmLoading}
      onOk={async () => {
        setConfirmLoading(true);
        try {
          await props.onSubmit(checkedOutlets);
        } finally {
          setConfirmLoading(false);
        }
      }}
      onCancel={props.onCancel}
    >
      <Space direction='vertical' size='middle'>
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          全选
        </Checkbox>
        <CheckboxGroup name="checkedOutlets" value={checkedOutlets} options={props.OutletOptions} onChange={onChange} />
      </Space>
    </Modal>
  );
};

