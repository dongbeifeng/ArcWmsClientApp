import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';

import { FormattedMessage } from 'umi';
import React from 'react';
import numeral from 'numeral';
import { ChartCard, MiniArea, MiniBar, Field } from './Charts';
import type { WeekDataType } from '../data.d';
import moment from 'moment';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = ({ loading, inboundOrder,outboundOrder,stock }: {
  loading: boolean;
  inboundOrder: {
    inboundOrderCount7: WeekDataType[],
    openInboundOrderCount: number,
  },
  outboundOrder: {
    openOutboundOrderCount: number,
    outboundOrderCount7: WeekDataType[],
  },
  stock: {
    unitloadCount: number,
    emptyPalletCount: number,
    flowInCount7: WeekDataType[],
    flowOutCount7: WeekDataType[],
  },
}) =>{

const sumValue=(ar: WeekDataType[]): number=>{
  let sunV=0
  ar.forEach(element => {
    sunV+=element.value
  });
  return sunV
}
  return (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={<FormattedMessage id="入库单数量" defaultMessage="入库单数量" />}
        action={
          <Tooltip
            title={
              <FormattedMessage id="入库单数量" defaultMessage="入库单数量" />
            }
          >
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(sumValue(inboundOrder.inboundOrderCount7)).format('0,0')}
        footer={
          <Field
            label={
              <FormattedMessage
                id="入库单数量"
                defaultMessage="入库单数量"
              />
            }
            value={numeral(inboundOrder.openInboundOrderCount).format('0,0')}
          />
        }
        contentHeight={46}
      >
        <MiniBar data={inboundOrder.inboundOrderCount7.map(x=>{ return{ x:moment(x.date).format('YYYY-MM-DD'),y:x.value}})} />
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={<FormattedMessage id="出库单数量" defaultMessage="出库单数量" />}
        action={
          <Tooltip
            title={
              <FormattedMessage id="出库单数量" defaultMessage="出库单数量" />
            }
          >
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(sumValue(outboundOrder.outboundOrderCount7)).format('0,0')}
        footer={
          <Field
            label={
              <FormattedMessage id="出库单数量" defaultMessage="出库单数量" />
            }
            value={numeral(outboundOrder.openOutboundOrderCount).format('0,0')}
          />
        }
        contentHeight={46}
      >
        <MiniArea color="#975FE4" data={outboundOrder.outboundOrderCount7.map(x=>{ return{ x:moment(x.date).format('YYYY-MM-DD'),y:x.value}})} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={<FormattedMessage id="流入数量" defaultMessage="流入数量" />}
        action={
          <Tooltip
            title={
              <FormattedMessage id="流入数量" defaultMessage="流入数量" />
            }
          >
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(sumValue(stock.flowInCount7)).format('0,0')}
        footer={
          <Field
            label={
              <FormattedMessage
                id="托盘数量"
                defaultMessage="托盘数量"
              />
            }
            value={stock.emptyPalletCount}
          />
        }
        contentHeight={46}
      >
        <MiniBar data={stock.flowInCount7.map(x=>{ return{ x:moment(x.date).format('YYYY-MM-DD'),y:x.value}})} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
    <ChartCard
        bordered={false}
        loading={loading}
        title={<FormattedMessage id="流出数量" defaultMessage="流出数量" />}
        action={
          <Tooltip
            title={
              <FormattedMessage id="流出数量" defaultMessage="流出数量" />
            }
          >
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(sumValue(stock.flowOutCount7)).format('0,0')}
        footer={
          <Field
            label={
              <FormattedMessage id="空托数量" defaultMessage="空托数量" />
            }
            value={numeral(stock.emptyPalletCount).format('0,0')}
          />
        }
        contentHeight={46}
      >
        <MiniArea color="#975FE4" data={stock.flowOutCount7.map(x=>{ return{ x:moment(x.date).format('YYYY-MM-DD'),y:x.value}})} />
      </ChartCard>
    </Col>
  </Row>
)};

export default IntroduceRow;
