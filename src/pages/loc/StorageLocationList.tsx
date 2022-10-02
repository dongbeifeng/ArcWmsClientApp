import { Divider, Select, Tooltip } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import { disableInbound, disableOutbound, enableInbound, enableOutbound, getStreetletOptions, getStorageLocationList } from '@/services/loc';
import Text from 'antd/es/typography/Text';
import { ArrowRightOutlined, LayoutOutlined } from '@ant-design/icons';

import { defaultSearchConfig } from '@/defaultColConfig';

import { handleAction } from '@/utils/myUtils';
import type { FormType } from './components/SetForbiddenForm';
import SetForbiddenForm from './components/SetForbiddenForm';
import type { IStreetletInfo, IStorageLocationInfo, IStorageLocationListArgs } from '@/models/loc';
import { buildbooleanMap } from '@/utils/mapUtil';

const { Option } = Select;

export default () => {
  const [currentRow, setCurrentRow] = useState<IStorageLocationInfo>();
  const [forbiddenModalVisible, setForbiddenModalVisible] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormType>();
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
      key: 'loaded',
      hideInTable: true,
      dataIndex: 'loaded',
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
      title: '是否禁入',
      dataIndex: 'isInboundDisabled',
      valueType: 'radioButton',
      valueEnum: buildbooleanMap('全部', '禁入', '未禁入'),
      initialValue: '',

      render: (_, record) => (
        <Tooltip placement="topLeft" title={record.inboundDisabledComment}>
          {`${record.isInboundDisabled ? '是' : '否'}`}
        </Tooltip>
      ),
    },
    {
      title: '出站数',
      dataIndex: 'outboundCount',
      search: false,
    },
    {
      title: '是否禁出',
      dataIndex: 'isOutboundDisabled',
      valueType: 'radioButton',
      valueEnum: buildbooleanMap('全部', '禁出', '未禁出'),
      initialValue: '',
      render: (_, record) => (
        <Tooltip placement="topLeft" title={record.outboundDisabledComment}>
          {`${record.isOutboundDisabled ? '是' : '否'}`}
        </Tooltip>
      ),
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
              setFormType(record.isInboundDisabled ? 'enableInbound' : 'disableInbound');
              setForbiddenModalVisible(true);
            }}
          >
            {record.isInboundDisabled ? '允许入站' : '禁止入站'}
          </a>

          <Divider type="vertical" />
          <a
            onClick={() => {
              setCurrentRow(record);
              setFormType(record.isOutboundDisabled ? 'enableOutbound' : 'disableOutbound');
              setForbiddenModalVisible(true);
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
      {currentRow && forbiddenModalVisible && (
        <SetForbiddenForm
          onSubmit={async (value) => {
            const success = await handleAction(() => {
              switch (formType) {
                case "disableInbound":
                  return disableInbound({
                    locationIds: [currentRow.locationId],
                    comment: value.comment,
                  });
                case "disableOutbound":
                  return disableOutbound({
                    locationIds: [currentRow.locationId],
                    comment: value.comment,
                  });
                case "enableInbound":
                  return enableInbound({
                    locationIds: [currentRow.locationId],
                    comment: value.comment,
                  });
                case "enableOutbound":
                  return enableOutbound({
                    locationIds: [currentRow.locationId],
                    comment: value.comment,
                  });
                default:
                  return Promise.reject(new Error('无效分支'));
              }
            });
            if (success) {
              setForbiddenModalVisible(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            setForbiddenModalVisible(false);
            setCurrentRow(undefined);
          }}
          locationCode={currentRow.locationCode}
          formType={formType}
        />
      )}

    </PageContainer>
  );
};

