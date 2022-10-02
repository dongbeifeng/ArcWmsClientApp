import React, { useState, useEffect } from 'react';
import { Form, Table, Row, Col, Input, Button, DatePicker, InputNumber, Checkbox, Card, Radio } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import moment, { isMoment } from 'moment';
import type { RequestData } from '@ant-design/pro-table';
import type { ILogEntry } from '@/models/log';
import styles from './log.less';
import LogDetail from './components/LogDetail'
import { getLogList } from '@/services/log';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { Link } from 'umi';

export default () => {
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [data, setData] = useState<ILogEntry[]>();
  const [detailValue, setDetailValue] = useState<ILogEntry | any>({});

  const showTotal = (total: number, range: [number, number]) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`;
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 50,
    pageSizeOptions: ['10', '20', '50', '100', '200', '500', '1000'],
    showQuickJumper: false,
    showTotal,
  });
  function getDefaultTime() {
    return moment(new Date()).subtract(30, 'minutes');
  }

  const levelOptions = [
    { label: 'Verbose', value: 'Verbose' },
    { label: 'Debug', value: 'Debug' },
    { label: 'Information', value: 'Information' },
    { label: 'Warning', value: 'Warning' },
    { label: 'Error', value: 'Error' },
    { label: 'Fatal', value: 'Fatal' },
  ];
  const defaultlevel = ['Information', 'Warning', 'Error', 'Fatal'];

  const [form] = Form.useForm();

  const searchFields = [

    <Col span={4} key="timeFrom">
      <Form.Item
        name="timeFrom"
        label="从"
        initialValue={getDefaultTime()}
        rules={[
          {
            required: true,
            message: '请选择开始时间',
          },
        ]}
      >
        <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime />
      </Form.Item>
    </Col>,
    <Col span={4} key="seconds">
      <Form.Item
        initialValue={2700}
        name="seconds"
        label="取多少秒"
        rules={[
          {
            required: true,
            message: '请填写时长',
          },
        ]}
      >
        <InputNumber min={0} max={604800} step={300} />
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

    <Col span={11} key="levels">
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

    <Col span={5} key="polling">
      <Form.Item
        initialValue='全部'
        name="polling"
        label="轮询"
      >
        <Radio.Group>
          <Radio value='全部'>全部</Radio>
          <Radio value='非轮询'>非轮询</Radio>
          <Radio value='仅轮询'>仅轮询</Radio>
        </Radio.Group>
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
      title: '来源',
      dataIndex: 'sourceContext',
      width: 185,
      ellipsis: true,
    },
    {
      title: '级别',
      dataIndex: 'level',
      align: 'center',
      width: 90,
    },
    {
      title: '消息',
      dataIndex: 'message',
      width: 850,
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

          {record.requestId &&
            <Link
              style={{ marginLeft: '10px' }}
              to={`/dbg/trace-log/${record.requestId}/${record.time}`}
              target="_blank">
              跟踪
            </Link>
          }
        </>
      ),
    },
  ];

  function handleTableChange(pageInfo: TablePaginationConfig, filters: any, sorter: any, extra: any) {
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


  function getData(paginInfo: TablePaginationConfig) {
    setLoading(true);
    const filter = form.getFieldsValue();
    if (isMoment(filter.timeFrom)) {
      filter.timeFrom = filter.timeFrom.toDate();
    }
    getLogList({ ...filter, current: paginInfo.current, pageSize: paginInfo.pageSize })
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
              span={6}
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

