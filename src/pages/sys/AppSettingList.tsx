import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { getAppSettingList, updateAppSetting } from '@/services/sys';
import type { IAppSetting, IUpdateAppSettingArgs } from '@/models/sys';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { defaultSearchConfig } from '@/defaultColConfig';
import UpdateForm from './components/UpdateSettingForm';
import { handleAction } from '@/utils/myUtils';

export default () => {
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<IAppSetting>();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<IAppSetting>[] = [
    {
      title: '参数名称',
      dataIndex: 'settingName',
    },
    {
      title: '参数类型',
      dataIndex: 'settingType',
      search: false
    },
    {
      title: '值',
      dataIndex: 'settingValue',
      search: false,
    },
    {
      title: '备注',
      dataIndex: 'comment',
      search: false,
      width: 450,
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
              setUpdateModalVisible(true);
              setCurrentRow(record);
            }}
          >
            修改
          </a>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<IAppSetting, IUpdateAppSettingArgs>
        headerTitle="参数列表"
        actionRef={actionRef}
        rowKey="settingName"
        search={defaultSearchConfig}
        toolBarRender={() => []}
        request={getAppSettingList}
        columns={columns}
        pagination={false}
      />

      {currentRow && updateModalVisible && Object.keys(currentRow) && (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleAction(() => updateAppSetting(value));
            if (success) {
              setUpdateModalVisible(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            setUpdateModalVisible(false);
            setCurrentRow(undefined);
          }}
          values={currentRow}
        />
      )}

    </PageContainer>
  );

};

