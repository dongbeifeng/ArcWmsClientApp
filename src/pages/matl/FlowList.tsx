import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { IFlowListArgs, IFlowInfo, IMaterialInfo } from '@/models/matl';
import { defaultSearchConfig } from '@/defaultColConfig';
import { getFlowList, getMaterialOptions, getMaterialTypes } from '@/services/matl';
import { buildMaterialTypeMap } from '@/utils/mapUtil';
import moment from 'moment';
import { AutoComplete, FormInstance } from 'antd';
import { debounce } from 'lodash';

export default () => {

  const [materialTypeMap, setMaterialTypeMap] = useState<Map<string, string>>();

  const { Option } = AutoComplete;
  const [materialOptions, setMaterialOptions] = useState<IMaterialInfo[]>([]);
  const ref = useRef<FormInstance>();

  /**
   * 获取物料列表
   */
  const loadMaterialOptions = debounce(async (keyword: string) => {
    const res = await getMaterialOptions({
      keyword,
      limit: 10,
      inStockOnly: false,
      materialType: '',
    });
    setMaterialOptions(res.data || []);
  }, 300);

  useEffect(() => {
    getMaterialTypes()
    .then(res => {
      const map = buildMaterialTypeMap(res.data);
      setMaterialTypeMap(map);
    });
;
  }, []);

  const columns: ProColumns<IFlowInfo>[] = [
    {
      title: 'flowId',
      dataIndex: 'flowId',
      search: false,
    },
    {
      title: '时间',
      dataIndex: 'creationTime',
      render: (_, record) => <span>{moment(record.creationTime).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '料号',
      dataIndex: 'materialCode',
      formItemProps: { label: '料号' },
      renderFormItem: () => {
        return (
          <AutoComplete
            filterOption={false}
            onChange={async val => {
              const materialInfo = materialOptions.find(x => x.materialCode === val);
              if (materialInfo) {
                ref.current?.setFieldsValue({
                  materialCode: materialInfo.materialCode,
                });
              } else {
                ref.current?.setFieldsValue({
                  materialCode: undefined,
                });
              }
            }}
            onSearch={loadMaterialOptions}
            placeholder="请输入"
            allowClear
          >
            {materialOptions.map(x => (
              <Option
                key={x.materialCode}
                value={x.materialCode}
              >
                <div>
                  编码：{x.materialCode}
                </div>
                <div>
                  描述：{x.description}
                </div>
              </Option>)
            )}
          </AutoComplete>);
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      search: false,
    },
    {
      title: '物料类型',
      dataIndex: 'materialType',
      valueEnum: materialTypeMap,
      initialValue: '',
    },
    {
      title: '批号',
      dataIndex: 'batch',
    },
    {
      title: '库存状态',
      dataIndex: 'inventoryStatus',
    },

    {
      title: '业务类型',
      dataIndex: 'bizType',
    },
    {
      title: '方向',
      dataIndex: 'direction',
      search: false,
    },
    {
      title: '托盘号',
      dataIndex: 'palletCode',
    },

    {
      title: '单据',
      dataIndex: 'orderCode',
    },
    {
      title: '业务单号',
      dataIndex: 'bizOrder',
      hideInTable: true,
      search: false,
    },
    {
      title: '操作类型',
      dataIndex: 'operationType',
      hideInTable: true,
      search: false,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      search: false,
    },
    {
      title: '余额',
      dataIndex: 'balance',
      search: false,
    },
    {
      title: '计量单位',
      dataIndex: 'uom',
      search: false,
    },

    {
      title: '用户',
      dataIndex: 'creationUser',
      search: false,
    },

    {
      title: '备注',
      dataIndex: 'comment',
      search: false,
    },
  ];


  return (
    <PageContainer>
      <ProTable<IFlowInfo, IFlowListArgs>
        headerTitle="流水列表"
        rowKey="flowId"
        search={defaultSearchConfig}
        toolBarRender={() => []}
        request={getFlowList}
        columns={columns}
        formRef={ref}
      />


    </PageContainer>
  );
};
