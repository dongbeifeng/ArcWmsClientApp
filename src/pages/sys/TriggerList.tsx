import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { getTriggerList, pauseTrigger, resumeTrigger } from '@/services/sys';

import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { defaultSearchConfig } from '@/defaultColConfig';

import type { ITrigger, IUpdateTriggerArgs } from '@/models/trigger';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { handleAction } from '@/utils/myUtils';
import moment from 'moment';

export default () => {

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<ITrigger>[] = [
    {
      title: '触发器名称',
      dataIndex: 'triggerName',
      width: 150,
      ellipsis: true,
      search: false,
      hideInTable: true,
    },
    {
      title: '触发器组',
      dataIndex: 'triggerGroup',
      search: false,
      width: 150,
      ellipsis: true,
      hideInTable: true,
    },
    {
      title: '触发器描述',
      dataIndex: 'triggerDescription',
      search: false,
    },
    {
      title: 'Cron表达式',
      dataIndex: 'cronExpressionString',
      search: false,
    },
    {
      title: '上次时间',
      dataIndex: 'previousFireTime',
      search: false,
      render: (_, record) => <span>{moment(record.previousFireTime).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '下次时间',
      dataIndex: 'nextFireTime',
      search: false,
      render: (_, record) => <span>{moment(record.nextFireTime).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '状态',
      dataIndex: 'triggerState',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              Modal.confirm({
                title: `确认要${record.triggerState === "Paused" ? '继续' : '暂停'}吗?`,
                icon: <ExclamationCircleOutlined />,
                content: `正在${record.triggerState === "Paused" ? '继续' : '暂停'}【${record.triggerDescription}】作业.`,
                okText: '确认',
                okType: 'danger',
                cancelText: '取消',
                async onOk() {
                  if (record.triggerState === "Normal") {
                    const success = await handleAction(() => pauseTrigger(record.triggerName, record.triggerGroup));
                    if (success) {
                      if (actionRef.current) {
                        actionRef.current.reload();
                      }
                    }
                  } else if (record.triggerState === "Paused") {
                    const success = await handleAction(() => resumeTrigger(record.triggerName, record.triggerGroup));
                    if (success) {
                      if (actionRef.current) {
                        actionRef.current.reload();
                      }
                    }
                  }
                },
                onCancel() {
                },
              });
            }}
          >
            {record.triggerState === "Paused" ? '继续' : '暂停'}

          </a>
        </>
      ),
    },
  ];

  return (
    <PageContainer content='触发器用于执行计划任务'>
      <ProTable<ITrigger, IUpdateTriggerArgs>
        headerTitle="触发器列表"
        actionRef={actionRef}
        rowKey={(trigger) => `${trigger.triggerGroup} - ${trigger.triggerName}`}
        search={defaultSearchConfig}
        toolBarRender={() => []}
        request={getTriggerList}
        columns={columns}
        pagination={false}
      />

    </PageContainer>
  );

};

