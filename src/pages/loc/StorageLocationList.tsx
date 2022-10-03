import { Divider, Select, Tooltip } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import { disableLocationInbound, disableLocationOutbound, enableLocationInbound, enableLocationOutbound, getStreetletOptions, getStorageLocationList } from '@/services/loc';
import Text from 'antd/es/typography/Text';
import { ArrowRightOutlined, LayoutOutlined } from '@ant-design/icons';

import { defaultSearchConfig } from '@/defaultColConfig';
import { handleAction } from '@/utils/myUtils';
import type { IStreetletInfo, IStorageLocationInfo, IStorageLocationListArgs } from '@/models/loc';
import { buildbooleanMap } from '@/utils/mapUtil';
import EnableLocationForm, { FormTitle } from './components/EnableLocationForm';

const { Option } = Select;

export default () => {
  const [currentRow, setCurrentRow] = useState<IStorageLocationInfo>();
  const [enableLocationFormVisible, setEnableLocationFormVisible] = useState<boolean>(false);
  const [formTitle, setFormTitle] = useState<FormTitle>();
  const [streetletOptions, setStreetletOptions] = useState<IStreetletInfo[]>();

  useEffect(() => {
    getStreetletOptions()
      .then((res) => setStreetletOptions(res.data));
  }, []);

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<IStorageLocationInfo>[] = [
    {
      title: '货位编码',
      dataIndex: 'locationCode',
      sorter: true,
      render: (_, record) => (
        <Text copyable={{ text: record.locationCode }}>
          {record.locationCode}
          {(record.inboundCount > 0 || record.outboundCount > 0) && (
            <>
              &nbsp;
              <ArrowRightOutlined title="有任务" />
            </>
          )}
          {record.unitloadCount > 0 && (
            <>
              &nbsp;
              <LayoutOutlined title="有货" rotate={-90} />
            </>
          )}
        </Text>
      ),
    },
    {
      title: '巷道编码',
      dataIndex: 'streetletCode',
      search: false,
    },
    {
      title: '巷道',
      key: 'streetletIdList',
      hideInTable: true,
      dataIndex: 'streetletIdList',
      filters: true,
      renderFormItem: (_, { type }) => {
        if (type === 'form') {
          return null;
        }
        return (
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="请选择巷道"
            defaultValue={[]}
          >
            {streetletOptions?.map(x => (
              <Option value={x.streetletId} key={x.streetletId}>
                {x.streetletCode}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '分组',
      dataIndex: 'storageGroup',
    },
    {
      title: '是否有货',
      key: 'isLoaded',
      hideInTable: true,
      dataIndex: 'isLoaded',
      filters: true,
      valueType: 'radioButton',
      valueEnum: buildbooleanMap('全部', '有货', '无货'),
      initialValue: '',
    },
    {
      title: '限重(千克)',
      dataIndex: 'weightLimit',
      search: false,
    },
    {
      title: '限高(米)',
      dataIndex: 'heightLimit',
      search: false,
    },
    {
      title: '入站数',
      dataIndex: 'inboundCount',
      search: false,
    },
    {
      title: '禁止入站',
      dataIndex: 'isInboundDisabled',
      tip: '不会为已禁入的位置生成新的入站任务，但已有任务会继续执行',
      valueType: 'radioButton',
      valueEnum: buildbooleanMap('全部', '已禁入', '未禁入'),
      initialValue: '',

      render: (_, record) => (
        <Tooltip placement="topLeft" title={record.inboundDisabledComment}>
          {`${record.isInboundDisabled ? '已禁入' : '未禁入'}`}
        </Tooltip>
      ),
    },
    {
      title: '巷道禁入',
      key: 'isStreetletInboundDisabled',
      search: false,
      render: (_, record) => {
        const streetlet = streetletOptions?.find(x => x.streetletId === record.streetletId);
        return (
          <Tooltip placement="topLeft" title={streetlet?.inboundDisabledComment}>
            {`${streetlet?.isInboundDisabled ? '已禁入' : '未禁入'}`}
          </Tooltip>
        )
      },
    },

    {
      title: '出站数',
      dataIndex: 'outboundCount',
      search: false,
    },
    {
      title: '禁止出站',
      dataIndex: 'isOutboundDisabled',
      tip: '不会为已禁出的位置生成新的出站任务，但已有任务会继续执行',
      valueType: 'radioButton',
      valueEnum: buildbooleanMap('全部', '已禁出', '未禁出'),
      initialValue: '',
      render: (_, record) => (
        <Tooltip placement="topLeft" title={record.outboundDisabledComment}>
          {`${record.isOutboundDisabled ? '已禁出' : '未禁出'}`}
        </Tooltip>
      ),
    },
    {
      title: '巷道禁出',
      key: 'isStreetletOutboundDisabled',
      search: false,
      render: (_, record) => {
        const streetlet = streetletOptions?.find(x => x.streetletId === record.streetletId);
        return (
          <Tooltip placement="topLeft" title={streetlet?.outboundDisabledComment}>
            {`${streetlet?.isOutboundDisabled ? '已禁出' : '未禁出'}`}
          </Tooltip>
        )
      },
    },
    {
      title: '货载数',
      dataIndex: 'unitloadCount',
      search: false,
    },
    {
      title: '是否有入站',
      key: 'hasInboundMoves',
      hideInTable: true,
      dataIndex: 'hasInboundMoves',
      filters: true,
      valueType: 'radioButton',
      valueEnum: buildbooleanMap('全部', '有入站', '无入站'),
      initialValue: '',
    },
    {
      title: '是否有出站',
      key: 'hasOutboundMoves',
      hideInTable: true,
      dataIndex: 'hasOutboundMoves',
      filters: true,
      valueType: 'radioButton',
      valueEnum: buildbooleanMap('全部', '有出站', '无出站'),
      initialValue: '',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              setCurrentRow(record);
              setFormTitle(record.isInboundDisabled ? '允许入站' : '禁止入站');
              setEnableLocationFormVisible(true);
            }}
          >
            {record.isInboundDisabled ? '允许入站' : '禁止入站'}
          </a>

          <Divider type="vertical" />
          <a
            onClick={() => {
              setCurrentRow(record);
              setFormTitle(record.isOutboundDisabled ? '允许出站' : '禁止出站');
              setEnableLocationFormVisible(true);
            }}
          >
            {record.isOutboundDisabled ? '允许出站' : '禁止出站'}
          </a>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<IStorageLocationInfo, IStorageLocationListArgs>
        headerTitle="货位列表"
        actionRef={actionRef}
        rowKey="locationId"
        search={defaultSearchConfig}
        toolBarRender={() => []}
        request={getStorageLocationList}
        columns={columns}
        rowClassName={(record) =>
          record.isInboundDisabled || record.isOutboundDisabled ? 'text-danger' : ''
        }
      />
      {currentRow && enableLocationFormVisible && (
        <EnableLocationForm
          onSubmit={async (value) => {
            const success = await handleAction(() => {
              switch (formTitle) {
                case '允许入站':
                  return enableLocationInbound(value);
                case "允许出站":
                  return enableLocationOutbound(value);
                case '禁止入站':
                  return disableLocationInbound(value);
                case '禁止出站':
                  return disableLocationOutbound(value);
                default:
                  return Promise.reject(new Error('无效分支'));
              }
            });
            if (success) {
              setEnableLocationFormVisible(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            setEnableLocationFormVisible(false);
            setCurrentRow(undefined);
          }}
          locationId={currentRow.locationId}
          locationCode={currentRow.locationCode}
          formTitle={formTitle}
        />
      )}

    </PageContainer>
  );
};

