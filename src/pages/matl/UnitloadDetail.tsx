import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { getUnitloadDetail } from '@/services/matl';
import { Card, Descriptions,Table,Spin,Tag } from 'antd';
import styles from './UnitloadDetail.less';
import type { IUnitloadDetail } from '@/models/matl';
import type { IUnitloadItemInfo } from '@/models/matl';


export default (props: any) => {
  const [unitloadDetail, setUnitloadDetail] = useState<IUnitloadDetail>();

  const [loading] = useState(false);
  const [lines, setLines] = useState<IUnitloadItemInfo[]>();

  useEffect(() => {
    getUnitloadDetail(props.match.params.palletCode)
    .then(res => {setUnitloadDetail(res.data);setLines(res.data?.items)});
  }, []);


  const columns = [
    {
      title: 'ID',
      key: 'unitloadItemId',
      dataIndex: 'unitloadItemId',
      width: '10%',
    },
    {
      title: '物料代码',
      dataIndex: 'materialCode',
      key: 'materialCode',
    },
    {
      title: '物料名称',
      dataIndex: 'description',
      key: 'description',
      width: '10%',
    },
    {
      title: '物料类型',
      dataIndex: 'materialType',
      key: 'materialType',
      width: '10%',
    },
    {
      title: '批号',
      dataIndex: 'batch',
      key: 'batch',
      width: '10%',
    },
    {
      title: '状态',
      dataIndex: 'inventoryStatus',
      key: 'inventoryStatus',
      width: '10%',
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '10%',
    },
    {
      title: '单位',
      dataIndex: 'uom',
      key: 'uom',
      width: '10%',
    },
  ]

  return (
    <PageContainer
    className={styles.pageHeader}
    title={
      <Spin spinning={loading}>
        货载：{unitloadDetail?.palletCode} &nbsp;
        {
          unitloadDetail?.hasTask && <Tag color='red'>有任务，任务类型：{unitloadDetail?.currentTaskType}</Tag>
        }
      </Spin>
    }
    content={
      <Spin spinning={loading}>
       <Descriptions >
            <Descriptions.Item label="货载ID">{unitloadDetail?.unitloadId}</Descriptions.Item>
            <Descriptions.Item label="当前位置">{unitloadDetail?.locationCode}</Descriptions.Item>
            <Descriptions.Item label="到位时间">{unitloadDetail?.locationTime}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{unitloadDetail?.creationTime}</Descriptions.Item>
            <Descriptions.Item label="货载重量">{unitloadDetail?.weight}</Descriptions.Item>
            <Descriptions.Item label="货载高度">{unitloadDetail?.height}</Descriptions.Item>
            <Descriptions.Item label="存储分组">{unitloadDetail?.storageGroup}</Descriptions.Item>
            <Descriptions.Item label="操作提示">{unitloadDetail?.opHintType}-{unitloadDetail?.opHintInfo}</Descriptions.Item>
            <Descriptions.Item label="托盘规格">{unitloadDetail?.palletSpecification}</Descriptions.Item>
            <Descriptions.Item label="备注">{unitloadDetail?.comment}</Descriptions.Item>

          </Descriptions>
      </Spin>
    }
    >
        <Card >
        <Descriptions title="货载明细"/>
          <Table<IUnitloadItemInfo>
            loading={loading}
            columns={columns}
            dataSource={lines}
            rowKey='unitloadItemId'
            pagination={false}
          />

        </Card>
    </PageContainer>
  );
};
