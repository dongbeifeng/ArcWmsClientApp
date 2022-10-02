import React, { useState, useEffect } from 'react';
import { Form, Table, Row, Col, Input, Button, Checkbox, Card } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { isMoment } from 'moment';
import type { RequestData } from '@ant-design/pro-table';
import type { ILogEntry } from '@/models/log';
import styles from './log.less';
import LogDetail from './components/LogDetail'
import { traceLog } from '@/services/log';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';

export default (props: any) => {
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [data, setData] = useState<ILogEntry[]>();
  const [detailValue, setDetailValue] = useState<ILogEntry | any>({});

  const showTotal = (total: number, range: [number, number]) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`;
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 500,
    pageSizeOptions: ['10', '20', '50', '100', '200', '500', '1000'],
    showQuickJumper: true,
    showTotal,
  });

  const levelOptions = [
    { label: 'Verbose', value: 'Verbose' },
    { label: 'Debug', value: 'Debug' },
    { label: 'Information', value: 'Information' },
    { label: 'Warning', value: 'Warning' },
    { label: 'Error', value: 'Error' },
    { label: 'Fatal', value: 'Fatal' },
  ];
  const defaultlevel = ['Verbose', 'Debug', 'Information', 'Warning', 'Error', 'Fatal'];

  const [form] = Form.useForm();

  const searchFields = [
    <Col span={6} key="requestId">
      <Form.Item initialValue={props.match.params.requestId} name="requestId" label="RequestId">
        <Input readOnly={true} />
      </Form.Item>
    </Col>,
    <Col span={4} key="time">
    <Form.Item initialValue={props.match.params.time} name="time" label="时间" >
      <Input readOnly={true} />
    </Form.Item>
  </Col>,
    <Col span={6} key="keyword">
      <Form.Item initialValue="" name="keyword" label="内容包含">
        <Input placeholder="请输入关键字" />
      </Form.Item>
    </Col>,
    <Col span={8} key="excludedKeywords">
      <Form.Item initialValue="" name="excludedKeywords" label="不包含">
        <Input placeholder="请输入不包含词" />
      </Form.Item>
    </Col>,
    <Col span={14} key="levels">
      <Form.Item
        initialValue={defaultlevel}
        name="levels"
        label="级别"
        rules={[
          {
            required: true,
            message: '请选级别',
          },
        ]}
      >
        <Checkbox.Group options={levelOptions} />
      </Form.Item>
    </Col>,
  ];

  function onFinish() {
    getData(pagination);
  }

  useEffect(() => {
    getData(pagination);
  }, []);

  const columns: ColumnsType<ILogEntry> = [
    {
      title: '时间',
      dataIndex: 'time',
      render: (_, record) => moment(record.time).format('YYYY-MM-DD HH:mm:ss'),
      width: 155,
    },
    {
      title: '级别',
      dataIndex: 'level',
      align: 'center',
    },
    {
      title: '消息',
      dataIndex: 'message',
      width: 800,
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      render: (_: any, record: ILogEntry) => (
        <>
          <a
            onClick={() => {
              setDetailModalVisible(true)
              setDetailValue(record)
            }}
          >
            查看
          </a>
        </>
      ),
    },
  ];

  function handleTableChange(pageInfo: any, extra: any) {
    if (extra) {
      if (extra.action === 'paginate') {
        // 设置页码
        getData(pageInfo);
      } else if (extra.action === 'sort') {
        // 设置排序
        getData(pageInfo);
      }
    }
  }

  function getData(paginInfo: any) {
    setLoading(true);
    const filter = form.getFieldsValue();
    if (isMoment(filter.timeFrom)) {
      filter.timeFrom = filter.timeFrom.toDate();
    }

    traceLog({ ...filter, current: paginInfo.current, pageSize: paginInfo.pageSize })
      .then((res: RequestData<ILogEntry>) => {
        setLoading(false);
        setData(res.data);
        setPagination({ ...paginInfo, total: res.total, showTotal });
      })
      .catch(() => {
        setLoading(false);
      });
  }

  return (
    <PageContainer>
      <Card>
        <Form
          form={form}
          name="advanced_search"
          className="ant-advanced-search-form"
          onFinish={onFinish}
        >
          <Row gutter={24}>
            {searchFields}
            <Col
              span={8}
              style={{
                textAlign: 'right',
              }}
            >
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button
                style={{
                  margin: '0 8px',
                }}
                onClick={() => {
                  form.resetFields();
                }}
              >
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <div style={{ height: '15px' }} />
      <Card>
        <Table
          className="table-striped-rows"
          bordered
          scroll={{ x: '100%' }}
          size="small"
          columns={columns}
          rowKey={(record) => record.logId}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          rowClassName={(record) => {
            const level = record.level.toLowerCase();
            return styles[level];
          }}
        />
      </Card>

      <LogDetail
        onCancel={() => {
          setDetailModalVisible(false)
        }}
        detailModalVisible={detailModalVisible}
        values={detailValue}
      />
    </PageContainer>
  );
};

