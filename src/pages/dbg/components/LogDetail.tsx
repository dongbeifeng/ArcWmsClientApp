import React from 'react';
import { Modal, Button, Descriptions } from 'antd';
import format from 'xml-formatter';
import type { ILogEntry } from '@/models/log';

export interface LogDetailProps {
  onCancel: () => void;
  detailModalVisible: boolean;
  values: ILogEntry;
}

const LogDetail: React.FC<LogDetailProps> = (props) => {
  const { onCancel: handleCancel, detailModalVisible, values } = props;
  const renderFooter = () => {
    return (
      <>
        <Button type="primary" onClick={() => handleCancel()}>
          确定
        </Button>
      </>
    );
  };
  return (
    <Modal
      width={960}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="日志详情"
      visible={detailModalVisible}
      onCancel={() => handleCancel()}
      footer={renderFooter()}
    >
      <Descriptions title="日志详情" column={2} bordered size="small">
        <Descriptions.Item label="Id">{values.logId}</Descriptions.Item>
        <Descriptions.Item label="请求id">{values.requestId}</Descriptions.Item>

        <Descriptions.Item label="时间">{values.time}</Descriptions.Item>
        <Descriptions.Item label="级别">{values.level}</Descriptions.Item>

        <Descriptions.Item label="用户名">{values.userName}</Descriptions.Item>
        <Descriptions.Item label="">{}</Descriptions.Item>

        <Descriptions.Item label="消息" span={2}>
          <pre>
          {values.message}
          </pre>
        </Descriptions.Item>
        <Descriptions.Item label="异常" span={2}>
          <pre>
          {values.exception}
          </pre>
        </Descriptions.Item>

        <Descriptions.Item label="属性" span={2}>
          <pre>
            {values.properties
              ? format(values.properties, {
                  indentation: '  ',
                  filter: (node) => node.type !== 'Comment',
                  collapseContent: true,
                  lineSeparator: '\n',
                })
              : ''}
          </pre>
        </Descriptions.Item>
        <Descriptions.Item label="消息模板" span={2}>
          {values.messageTemplate}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default LogDetail;
