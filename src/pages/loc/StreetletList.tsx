import { Badge, Divider, Popover, Progress, Table, Tooltip } from 'antd';
import React, { useState, useRef, useEffect, Fragment } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import SetOutletsForm from './components/SetOutletsForm';
import { defaultSearchConfig } from '@/defaultColConfig';
import Title from 'antd/es/typography/Title';
import { handleAction } from '@/utils/myUtils';
import { getStreetletList, getOutletOptions, enableStreetletInbound, setOutlets, enableStreetletOutbound, disableStreetletInbound, disableStreetletOutbound } from '@/services/loc';
import type { IStreetletListArgs, IStreetletInfo } from '@/models/loc';
import EnableStreetletForm, { FormTitle } from './components/EnableStreetletForm';

export default () => {
  const [currentRow, setCurrentRow] = useState<IStreetletInfo>();
  const [outletModalVisible, setOutletModalVisible] = useState<boolean>(false);
  const [enableStreetletFormVisible, setEnableStreetletFormVisible] = useState<boolean>(false);
    const [formTitle, setFormTitle] = useState<FormTitle>();
  const [outletsOptions, setOutletsOptions] = useState<{ label: string; value: number }[]>();

  const actionRef = useRef<ActionType>();
  const usageColumns = [
    {
      title: '分组',
      dataIndex: 'storageGroup',
      key: 'storageGroup',
    },
    {
      title: '规格',
      dataIndex: 'specification',
      key: 'specification',
    },
    {
      title: '限重',
      dataIndex: 'weightLimit',
      key: 'weightLimit',
    },
    {
      title: '限高',
      dataIndex: 'heightLimit',
      key: 'heightLimit',
    },
    {
      title: '总数',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: '有货',
      dataIndex: 'loaded',
      key: 'loaded',
    },
    {
      title: '禁入',
      dataIndex: 'inboundDisabled',
      key: 'inboundDisabled',
    },
    {
      title: '可用',
      dataIndex: 'available',
      key: 'available',
    },
  ];

  const columns: ProColumns<IStreetletInfo>[] = [
    {
      title: '编码',
      dataIndex: 'streetletCode',
    },
    {
      title: '双深',
      dataIndex: 'isDoubleDeep',
      renderText: (val: boolean) => (val ? '是' : '否'),
      search: false,
    },
    {
      title: '货位数',
      dataIndex: 'totalLocationCount',
      search: false,
    },
    {
      title: '可用数',
      dataIndex: 'availableLocationCount',
      search: false,
    },
    {
      title: '保留数',
      dataIndex: 'reservedLocationCount',
      search: false,
    },
    //
    {
      title: '使用率',
      search: false,
      render: (_, record) => (
        <Popover placement='right' content={
          <Fragment>
            <Title level={5}>{record.streetletCode} 货位使用率</Title>
            <Table dataSource={record.usageInfos} columns={usageColumns} rowKey={row => `${row.storageGroup}-${row.specification}-${row.weightLimit}-${row.heightLimit}`} pagination={false} bordered size='small' />
          </Fragment>
        }>
          <Progress percent={parseFloat((record.usageRate * 100).toFixed(1))} size="small" />
        </Popover>)
      ,
      width: 160,
    },
    {
      title: '出口',
      dataIndex: 'outlets',
      search: false,
      renderText: (val: { outletId: number; outletCode: string }[]) =>
        val.map((x) => x.outletCode).join(','),
    },
    {
      title: '禁止入站',
      search: false,
      tip: '不会为已禁入的巷道生成新的入站任务，但已有任务会继续执行',
      render: (_, record) => (
        <Tooltip title={record.inboundDisabledComment}>
          {
            record.isInboundDisabled ?
              <Badge status='error' text='已禁入' />
              : <Badge status='success' text='未禁入' />
          }
        </Tooltip>
      ),
    },
    {
      title: '禁止出站',
      search: false,
      tip: '不会为已禁入的巷道生成新的出站任务，但已有任务会继续执行',
      render: (_, record) => (
        <Tooltip title={record.outboundDisabledComment}>
          {
            record.isOutboundDisabled ?
              <Badge status='error' text='已禁出' />
              : <Badge status='success' text='未禁出' />
          }
        </Tooltip>
      ),
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
              setEnableStreetletFormVisible(true);
            }}
          >
            {record.isInboundDisabled ? '允许入站' : '禁止入站'}
          </a>

          <Divider type="vertical" />
          <a
            onClick={() => {
              setCurrentRow(record);
              setFormTitle(record.isOutboundDisabled ? '允许出站' : '禁止出站');
              setEnableStreetletFormVisible(true);
            }}
          >
            {record.isOutboundDisabled ? '允许出站' : '禁止出站'}
          </a>

          <Divider type="vertical" />

          <a
            href={`#/loc/sideview/${record.streetletCode}`}
            target="_blank"
          >
            侧视图
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setCurrentRow(record);
              setOutletModalVisible(true);
            }}
          >
            设置出口
          </a>
        </>
      ),
    },
  ];

  function loadOutletsOptions() {
    getOutletOptions().then((res) => {
      if (res.data) {
        const options = res.data.map((it) => ({
          label: it.outletCode,
          value: it.outletId,
        }));
        setOutletsOptions(options);
      }
    });
  }

  useEffect(() => {
    loadOutletsOptions();
  }, []);

  return (
    <PageContainer>
      <ProTable<IStreetletInfo, IStreetletListArgs>
        headerTitle="巷道列表"
        actionRef={actionRef}
        rowKey="streetletId"
        search={defaultSearchConfig}
        toolBarRender={() => []}
        request={getStreetletList}
        columns={columns}
        rowClassName={(record) => record.isInboundDisabled ? "text-danger" : ""}
      />

      {currentRow && enableStreetletFormVisible && (
        <EnableStreetletForm
        onSubmit={async value => {
            const success = await handleAction(() => {
              switch (formTitle) {
                case '允许入站':
                  return enableStreetletInbound(value);
                case "允许出站":
                  return enableStreetletOutbound(value);
                case '禁止入站':
                  return disableStreetletInbound(value);
                case '禁止出站':
                  return disableStreetletOutbound(value);
                default:
                  return Promise.reject(new Error('无效分支'));
            }});
            if (success) {
              setEnableStreetletFormVisible(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}

          onCancel={() => {
            setEnableStreetletFormVisible(false);
            setCurrentRow(undefined);
          }}
          streetletId={currentRow.streetletId}
          streetletCode={currentRow.streetletCode}
          formTitle={formTitle}
        />
      )}

      {currentRow && outletModalVisible && outletsOptions && (
        <SetOutletsForm
          onSubmit={async (value) => {
            const success = await handleAction(() => setOutlets({
              streetletId: currentRow.streetletId,
              outletIdList: value,
            }));
            if (success) {
              setOutletModalVisible(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            setOutletModalVisible(false);
            setCurrentRow(undefined);
          }}
          streetletCode={currentRow.streetletCode}
          OutletOptions={outletsOptions}
          streetletsOutlets={currentRow.outlets.map(x => x.outletId)}
        />
      )}
    </PageContainer>
  );
};
