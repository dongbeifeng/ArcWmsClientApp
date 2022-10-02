import { Card, Col, Row, Tabs, Tooltip } from 'antd';
import { FormattedMessage, formatMessage } from 'umi';
import React from 'react';
import type { OfflineChartData, OfflineDataType, WeekDataType } from '../data.d';

import { TimelineChart, Pie, MiniArea } from './Charts';
import NumberInfo from './NumberInfo';
import styles from '../style.less';
import { InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import numeral from 'numeral';


const TaskAnaly = ({
  task,
  loading,

}: {
  task: {
    taskCount: number,
    taskCount7: WeekDataType[],
  };
  loading: boolean;
}) => {
  const sumValue = (ar: WeekDataType[]): number => {
    let sunV = 0
    ar.forEach(element => {
      sunV += element.value
    });
    return sunV
  }

  return (<Card loading={loading} className={styles.offlineCard} bordered={false} style={{ marginTop: 32 }}>

    <div style={{ padding: '24px' }}>
      <NumberInfo
        subTitle={
          <span>
            <FormattedMessage
              id="任务信息"
              defaultMessage="任务信息"
            />
            <Tooltip
              title={
                <FormattedMessage id="出入库任务" defaultMessage="出入库任务" />
              }
            >
              <InfoCircleOutlined style={{ marginLeft: 8 }} />
            </Tooltip>
          </span>
        }
        total={ numeral(sumValue(task.taskCount7)).format('0,0')}
        status="up"
        subTotal={task.taskCount}
        gap={8}
      />
      <MiniArea line height={245} data={task.taskCount7.map(x => { return { x: moment(x.date).format('YYYY-MM-DD'), y: x.value } })} />
    </div>
  </Card>
  )

};

export default TaskAnaly;
