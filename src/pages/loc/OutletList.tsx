import React, {useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { defaultSearchConfig } from '@/defaultColConfig';
import { getOutletList ,clearOutlet, createOutlet} from '@/services/loc';
import type { IOutletInfo, IOutletListArgs } from '@/models/loc';

import {  Modal,message,Space,Button} from 'antd';
import { ExclamationCircleOutlined,PlusOutlined } from '@ant-design/icons';
import { handleAction } from '@/utils/myUtils';
import moment from 'moment';
import CreateForm from './components/CreateOutletForm';


export default () => {
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<IOutletInfo>[] = [
    {
      title: '编码',
      dataIndex: 'outletCode',
      sorter: true,
    },
    {
      title: 'KP1',
      dataIndex: 'kP1',
      search: false,
    },
    {
      title: 'KP2',
      dataIndex: 'kP2',
      search: false,
    },
    {
      title: '巷道',
      dataIndex: 'streetlets',
      search: false,
      renderText: (val: string[]) => val.join(', '),
    },
    {
      title: '单据',
      dataIndex: 'currentUat',
      search: false,
      tooltip: '正在出货口自动下架的单据',
    },
    {
      title: '检查时间',
      dataIndex: 'lastCheckTime',
      search: false,
      tooltip: '最近一次检查自动下架的时间',
      render: (_, record) => <span>{moment(record.lastCheckTime).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '检查消息',
      dataIndex: 'checkMessage',
      search: false,
      tooltip: '最近一次检查自动下架的消息',
    },

    {
      title: '备注',
      search: false,
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (

        <Space size="middle">
          <>
          {record.currentUat!=null&&
          <a
           onClick={() => {
           if(record.currentUat==null)
           {
            message.info('当前出货口没有单据需要分离！');
           }else{
              Modal.confirm({
                title: '确认要分离吗?',
                icon: <ExclamationCircleOutlined />,
                content: `正在从出货口: ${record.outletCode} 分离单据: ${record.currentUat} ,分离后，将不会为: ${record.currentUat} 向: ${record.outletCode} 发送新的下架任务，已发送的任务会继续执行.`,
                okText: '确认',
                okType: 'danger',
                cancelText: '取消',
                async onOk() {
                  const success = await handleAction(() => clearOutlet(record.outletId));
                  if (success) {
                    if (actionRef.current) {
                      actionRef.current.reload();
                    }
                  }
                },
                onCancel() {
                },
              });}
           }}
          >
            分离单据
          </a>
          }

       </>

          </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<IOutletInfo, IOutletListArgs>
        headerTitle="出货口列表"
        actionRef={actionRef}
        rowKey="outletId"
        search={defaultSearchConfig}
        toolBarRender={() => [
          <Button type="primary" onClick={() => setCreateModalVisible(true)}>
          <PlusOutlined /> 新建
        </Button>,
        ]}
        request={getOutletList}
        columns={columns}
      />

    { createModalVisible &&
      <CreateForm

        onCancel={() => {
          setCreateModalVisible(false);
        }}
        onSubmit={async (values) => {
          const success = await handleAction(() => createOutlet(values));
          if (success) {
            setCreateModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />}
    </PageContainer>
  );
};

