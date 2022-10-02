import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import Text from 'antd/es/typography/Text';
import type { IUnitloadListArgs, IUnitloadInfo, IMaterialInfo } from '@/models/matl';
import { ArrowRightOutlined, FileOutlined } from '@ant-design/icons';
import { VerticalCell } from '@/components/VerticalCell';
import { defaultSearchConfig } from '@/defaultColConfig';
import { getMaterialOptions, getMaterialTypes, getUnitloadList } from '@/services/matl';
import { buildbooleanMap, buildMaterialTypeMap } from '@/utils/mapUtil';
import { Link } from 'umi';
import moment from 'moment';
import { AutoComplete, FormInstance } from 'antd';
import { debounce } from 'lodash';

export default () => {
  const [materialTypeMap, setMaterialTypeMap] = useState<Map<string, string>>();

  const { Option } = AutoComplete;
  const [materialOptions, setMaterialOptions] = useState<IMaterialInfo[]>([]);
  const ref = useRef<FormInstance>();

  useEffect(() => {
    getMaterialTypes()
      .then(res => {
        const map = buildMaterialTypeMap(res.data);
        setMaterialTypeMap(map);
      });
  }, []);

  /**
   * 获取物料列表
   */
  const loadMaterialOptions = debounce(async (keyword: string) => {
    const res = await getMaterialOptions({
      keyword,
      limit: 10,
      inStockOnly: true,
      materialType: '',
    });
    setMaterialOptions(res.data || []);
  }, 300);

  const columns: ProColumns<IUnitloadInfo>[] = [
    {
      title: '编码',
      dataIndex: 'palletCode',
      // sorter: true,
      render: (_, record) => (
        <Text copyable={{ text: record.palletCode }}>
          {record.palletCode}
          {record.hasTask && <>&nbsp;<ArrowRightOutlined title="有任务" /></>}
          {record.allocated && <>&nbsp;<FileOutlined title="已分配" /></>}

        </Text>
      ),
    },
    {
      title: '是否有任务',
      dataIndex: 'hasTask',
      hideInTable: true,
      valueType: 'radioButton',
      valueEnum: buildbooleanMap('全部', '有任务', '无任务'),
      initialValue: '',
    },
    {
      title: '是否已分配',
      dataIndex: 'allocated',
      hideInTable: true,
      valueType: 'radioButton',
      valueEnum: buildbooleanMap('全部', '已分配', '未分配'),
      initialValue: '',
    },
    {
      title: '更新时间',
      dataIndex: 'modificationTime',
      search: false,
      sorter: false,
      defaultSortOrder: 'descend',
      render: (_, record) => <span>{moment(record.modificationTime).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '位置',
      dataIndex: 'locationCode',
      copyable: false,
    },
    {
      title: '料号',
      dataIndex: 'materialCode',
      formItemProps: { label: '料号' },
      render: (_, record) => VerticalCell(record.items.map(x => x.materialCode)),
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
      render: (_, record) => VerticalCell(record.items.map(x => x.description)),
    },
    {
      title: '物料类型',
      dataIndex: 'materialType',
      valueEnum: materialTypeMap,
      initialValue: '',
      render: (_, record) => VerticalCell(record.items.map(x => x.materialType)),
    },
    {
      title: '批号',
      dataIndex: 'batch',

      render: (_, record) => VerticalCell(record.items.map(x => x.batch)),
    },
    {
      title: '库存状态',
      dataIndex: 'inventoryStatus',
      render: (_, record) => VerticalCell(record.items.map(x => x.inventoryStatus)),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      search: false,
      render: (_, record) => VerticalCell(record.items.map(x => x.quantity)),
    },
    {
      title: '计量单位',
      dataIndex: 'uom',
      search: false,
      render: (_, record) => VerticalCell(record.items.map(x => x.uom)),
    },
    {
      title: '',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (
        <Link to={`/matl/unitloads/${record.palletCode}`}>
          详情
        </Link>),
    },
  ];

  return (
    <PageContainer>
        <ProTable<IUnitloadInfo, IUnitloadListArgs>
          headerTitle="货载列表"
          rowKey="unitloadId"
          search={defaultSearchConfig}
          toolBarRender={() => []}
          request={getUnitloadList}
          columns={columns}
          bordered
          formRef={ref}
        />
    </PageContainer>
  );
};
