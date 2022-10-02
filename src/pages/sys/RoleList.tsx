import { Button, Divider, message, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { IRoleInfo, IRoleListArgs } from '../../models/usr';
import { createRole, deleteRole, getRoleList, updateRole } from '../../services/usr';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import UpdateRoleForm from './components/UpdateRoleForm';
import { defaultSearchConfig } from '@/defaultColConfig';
import { handleAction } from '@/utils/myUtils';
import { getOperationTypes, getPermission, setPermission } from '@/services/sys';
import SetOperation from './components/SetOperation';

export default () => {
  const [currentRow, setCurrentRow] = useState<IRoleInfo>();
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [operationList, setOperationList] = useState<string[]>();
  const [operationModalVisible, setOperationModalVisible] = useState<boolean>(false);
  const [currentOperation, setCurrentOperation] = useState<string[]>();
  const actionRef = useRef<ActionType>();

  const setCurrentOpera = async (record: IRoleInfo) => {
    const data = await getPermission(record.roleId)
    setCurrentOperation(data.data)
  }

  const setOpera = async (roleId: string, data: { operationList: string[]}) => {
    const ret = await setPermission({
      roleId,
      allowedOperationTypes: data.operationList
     });
    if (ret.success) {
      if(actionRef.current) {
        actionRef.current.reload();
      }
      message.success("设置成功！")
      setOperationModalVisible(false)
    } else {
      message.error(ret.errorMessage)
    }
  }

  useEffect(() => {
    getOperationTypes().then(data => {
      if (data.success) {
        setOperationList(data.data)
      }
      else {
        setOperationList([])
      }
    })


  }, []);



  const columns: ProColumns<IRoleInfo>[] = [
    {
      title: '角色名',
      dataIndex: 'roleName',
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
      title: '允许的操作',
      dataIndex: 'allowedOpTypes',
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
                message.warn('内置角色不能操作');
              } else {
                setCurrentRow(record);
                setUpdateModalVisible(true);
              }
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              if (record.isBuiltIn) {
                message.warn('内置角色不能操作');
              } else {
                Modal.confirm({
                  title: '确认要删除吗?',
                  icon: <ExclamationCircleOutlined />,
                  content: `正在删除角色 ${record.roleName}`,
                  okText: '确认',
                  okType: 'danger',
                  cancelText: '取消',
                  async onOk() {
                    const success = await handleAction(() => deleteRole(record.roleId));
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

          <Divider type="vertical" />
          <a
            onClick={async () => {
              if (record.isBuiltIn) {
                message.warn('内置角色不能操作');
              } else {
                await setCurrentOpera(record)

                setCurrentRow(record);
                setOperationModalVisible(true)
              }
            }}
          >
            设置权限
          </a>
        </>
      ),
    },
  ];



  return (
    <PageContainer>
      <ProTable<IRoleInfo, IRoleListArgs>
        headerTitle="角色"
        actionRef={actionRef}
        rowKey="roleId"
        search={defaultSearchConfig}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              setCurrentRow(undefined);
              setUpdateModalVisible(true)
            }}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={getRoleList}
        columns={columns}
      />
      {updateModalVisible &&
        <UpdateRoleForm
          current={currentRow}
          onCancel={() => {
            setUpdateModalVisible(false);
            setCurrentRow(undefined);
          }}
          onSubmit={async (values) => {
            let success: boolean;
            if (currentRow) {
              success = await handleAction(() => updateRole({
                roleId: currentRow.roleId,
                ...values
              }));
            } else {
              success = await handleAction(() => createRole(values));
            }
            if (success) {
              setUpdateModalVisible(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        />

      }

      {operationModalVisible
      && currentRow
        &&
        <SetOperation allOperation={operationList ?? []} roleId={currentRow.roleId}
          operationList={currentOperation ?? []} onSubmit={setOpera}
          onCancel={() => { setOperationModalVisible(false) }} />
      }

    </PageContainer>
  );
};

