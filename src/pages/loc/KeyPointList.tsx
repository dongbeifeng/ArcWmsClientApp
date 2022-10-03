import { Button, Divider, Tooltip } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import Text from 'antd/es/typography/Text';
import { ArrowRightOutlined, PlusOutlined } from '@ant-design/icons';
import UpdateKeyPointForm from './components/UpdateKeyPointForm';
import { defaultSearchConfig } from '@/defaultColConfig';
import { handleAction } from '@/utils/myUtils';
import type { FormTitle } from './components/EnableLocationForm';
import { getKeyPointList, updateKeyPoint, disableLocationInbound, disableLocationOutbound, enableLocationInbound, enableLocationOutbound, createKeyPoint } from '@/services/loc';
import type { IKeyPointListArgs, IKeyPointInfo } from '@/models/loc';
import EnableLocationForm from './components/EnableLocationForm';
import { buildbooleanMap } from '@/utils/mapUtil';

export default () => {
  const [currentRow, setCurrentRow] = useState<IKeyPointInfo>();
  const [enableLocationFormVisible, setEnableLocationFormVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);

  const [formTitle, setFormTitle] = useState<FormTitle>();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<IKeyPointInfo>[] = [
    {
      title: '编码',
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
        </Text>
      ),
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
      title: '入站限制',
      dataIndex: 'inboundLimit',
      search: false,
      valueType: 'digit',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '入站限制为必填项',
          },
        ],
      },
    },
    {
      title: '禁止出站',
      dataIndex: 'isOutboundDisabled',
      tip: '不会为已禁出的位置生成新的出站任务，但已有任务会继续执行',
      valueType: 'radioButton',
      valueEnum: buildbooleanMap('全部', '已禁出', '未禁出'),
      initialValue: '',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '禁止出站为必填项',
          },
        ],
      },
      render: (_, record) => (
        <Tooltip placement="topLeft" title={record.outboundDisabledComment}>
          {`${record.isOutboundDisabled ? '已禁出' : '未禁出'}`}
        </Tooltip>
      ),
    },
    {
      title: '出站限制',
      dataIndex: 'outboundLimit',
      search: false,
      valueType: 'digit',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '出站限制为必填项',
          },
        ],
      },
    },
    {
      title: '标记',
      dataIndex: 'tag',
    },
    {
      title: '请求类型',
      dataIndex: 'requestType',
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
              setEditModalVisible(true);
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
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
      <ProTable<IKeyPointInfo, IKeyPointListArgs>
        headerTitle="关键点列表"
        actionRef={actionRef}
        rowKey="locationId"
        search={defaultSearchConfig}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              setCurrentRow(undefined);
              setEditModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={getKeyPointList}
        columns={columns}
        rowClassName={(record) =>
          record.isInboundDisabled || record.isOutboundDisabled ? 'text-danger' : ''
        }
      />

      {editModalVisible && (
        <UpdateKeyPointForm
          current={currentRow}
          onCancel={() => {
            setEditModalVisible(false);
            setCurrentRow(undefined);
          }}
          onSubmit={async (values) => {
            let success: boolean;
            if (currentRow) {
              success = await handleAction(() => updateKeyPoint(currentRow.locationId, values));
            } else {
              success = await handleAction(() => createKeyPoint(values));
            }

            if (success) {
              setEditModalVisible(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        />
      )}


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
