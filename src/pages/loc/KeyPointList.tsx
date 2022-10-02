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
import type { FormType } from './components/SetForbiddenForm';
import SetForbiddenForm from './components/SetForbiddenForm';
import { getKeyPointList, updateKeyPoint, disableInbound, disableOutbound, enableInbound, enableOutbound, createKeyPoint } from '@/services/loc';
import type { IKeyPointListArgs, IKeyPointInfo } from '@/models/loc';

export default () => {
  const [currentRow, setCurrentRow] = useState<IKeyPointInfo>();
  const [forbiddenModalVisible, setForbiddenModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);

  const [formType, setFormType] = useState<FormType>();
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
      formItemProps: {
        rules: [
          {
            required: true,
            message: '编码为必填项',
          },
        ],
      },
    },
    {
      title: '禁止入站',
      dataIndex: 'isInboundDisabled',
      search: false,
      valueEnum: {
        true: '是',
        false: '否',
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '禁止入站为必填项',
          },
        ],
      },
      render: (_, record) => (
        <Tooltip placement="topLeft" title={record.inboundDisabledComment}>
          {`${record.isInboundDisabled ? '是' : '否'}`}
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
      search: false,
      valueEnum: {
        true: '是',
        false: '否',
      },
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
          {`${record.isOutboundDisabled ? '是' : '否'}`}
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
