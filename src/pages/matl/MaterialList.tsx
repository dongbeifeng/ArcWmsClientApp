import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { IMaterialListArgs, IMaterialInfo } from '@/models/matl';
import { getMaterialList, getMaterialTypes } from '@/services/matl';
import { defaultSearchConfig } from '@/defaultColConfig';
import { buildMaterialTypeMap } from '@/utils/mapUtil';

export default () => {

  const [materialTypeMap, setMaterialTypeMap] = useState<Map<string, string>>();

  useEffect(() => {
    getMaterialTypes()
    .then(res => {
      const map = buildMaterialTypeMap(res.data);
      setMaterialTypeMap(map);
    });
  }, []);

  const columns: ProColumns<IMaterialInfo>[] = [
    {
      title: '编码',
      dataIndex: 'materialCode',
      sorter: true,
      copyable: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '物料类型',
      dataIndex: 'materialType',
      valueEnum: materialTypeMap,
      initialValue: '',
    },
    {
      title: '规格',
      dataIndex: 'specification',
    },

    // TODO 以下列暂时根据实际情况展示
    // {
    //   title: '启用批次管理',
    //   dataIndex: 'batchEnabled',
    //   search: false,
    //   valueEnum: {
    //     true: '是',
    //     false: '否',
    //   },
    // },

    // {
    //   title: '物料分组',
    //   dataIndex: 'materialGroup',
    // },

    // {
    //   title: '有效期（天）',
    //   dataIndex: 'validDays',
    //   search: false,
    //   tip: '单位天'
    // },
    // {
    //   title: '静置时间（小时）',
    //   dataIndex: 'standingTime',
    //   search: false,
    // },
    // {
    //   title: 'ABC分类',
    //   dataIndex: 'abcClass',
    // },
    {
      title: '计量单位',
      dataIndex: 'uom',
      search: false,
    },

    {
      title: '下线',
      dataIndex: 'lowerBound',
      search: false,
      tip: '库存量低于下线时发出警报',
    },

    {
      title: '上线',
      dataIndex: 'upperBound',
      search: false,
      tip: '库存量高于上线时发出警报',
    },

    {
      title: '默认存储分组',
      dataIndex: 'defaultStorageGroup',
      search: false,
      tip: '入库时，在没有其他逻辑覆盖的情况下，程序将库存分配到具有匹配存储分组的货位，不适用于混装',
    },
    {
      title: '备注',
      dataIndex: 'comment',
    },
  ];


  return (
    <PageContainer>
      <ProTable<IMaterialInfo, IMaterialListArgs>
        headerTitle="物料主数据列表"
        rowKey="materialId"
        search={defaultSearchConfig}
        toolBarRender={() => []}
        request={getMaterialList}
        columns={columns}
      />

    </PageContainer>
  );
};

