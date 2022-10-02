import { Button, Divider, message, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { createUser, deleteUser, getRoleOptions, getUserList, updateUser } from '@/services/usr';
import type { IUserInfo, IUserListArgs } from '../../models/usr';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { defaultSearchConfig } from '@/defaultColConfig';
import UpdateForm from './components/UpdateUserForm';
import { handleAction } from '@/utils/myUtils';
import CreateForm from './components/CreateUserForm';


export default () => {
  const [currentRow, setCurrentRow] = useState<IUserInfo>();
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [roleOptions, setRoleOptions] = useState<{ label: string; value: string }[]>([]);

  const actionRef = useRef<ActionType>();

  useEffect(() => {
    getRoleOptions().then((res) => {
      if (res.data) {
        const options = res.data.map((it) => ({
          label: it.roleName,
          value: it.roleName,
        }));
        setRoleOptions(options);
      } else {
        setRoleOptions([]);
      }

    });
  }, []);

  const columns: ProColumns<IUserInfo>[] = [
    {
      title: '用户名',
      dataIndex: 'userName',
      sorter: true,
      copyable: true,
    },
    {
      title: '是否内置',
      dataIndex: 'isBuiltIn',
      search: false,
      renderText: (val: boolean) => `${val ? '是' : '否'}`,
    },
    {
      title: '所属角色',
      dataIndex: 'roles',
      search: false,
      renderText: (val: string[]) => val.join(', '),
    },

    {
      title: '备注',
      dataIndex: 'comment',
      search: false,
      width: 180,
      ellipsis: true,
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              if (record.isBuiltIn) {
                message.warn('内置用户不能操作');
              } else {
                setCurrentRow(record);
                setEditModalVisible(true);
              }
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              if (record.isBuiltIn) {
                message.warn('内置用户不能操作');
              } else {
                Modal.confirm({
                  title: '确认要删除吗?',
                  icon: <ExclamationCircleOutlined />,
                  content: `正在删除用户 ${record.userName}`,
                  okText: '确认',
                  okType: 'danger',
                  cancelText: '取消',
                  async onOk() {
                    const success = await handleAction(() => deleteUser(record.userId));
                    if (success) {
                      if (actionRef.current) {
                        actionRef.current.reload();
                      }
                    }
                  },
                  onCancel() {
                  },
                });
              }
            }}
          >
            删除
          </a>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<IUserInfo, IUserListArgs>
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="userId"
        search={defaultSearchConfig}
        toolBarRender={() => [
          <Button type="primary" onClick={() => setCreateModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={getUserList}
        columns={columns}
      />
      {
        currentRow && editModalVisible &&
        <UpdateForm
          current={currentRow}
          roleOptions={roleOptions}
          onCancel={() => {
            setEditModalVisible(false);
            setCurrentRow(undefined);
          }}
          onSubmit={async (values) => {
            const success = await handleAction(() => updateUser({
              ...values,
              userId: currentRow.userId
            }));
            if (success) {
              setEditModalVisible(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        />
      }
      { createModalVisible &&
      <CreateForm
        roleOptions={roleOptions}
        onCancel={() => {
          setCreateModalVisible(false);
          setCurrentRow(undefined);
        }}
        onSubmit={async (values) => {
          const success = await handleAction(() => createUser(values));
          if (success) {
            setCreateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />}
    </PageContainer>
  );
};

