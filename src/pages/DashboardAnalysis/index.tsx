import { Col, Row } from 'antd';
import React, { Component } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import type { RadioChangeEvent } from 'antd/es/radio';
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import type moment from 'moment';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import IntroduceRow from './components/IntroduceRow';

import { getTimeDistance } from './utils/utils';
import type { AnalysisData } from './data.d';
import styles from './style.less';
import { getAnalysis } from '@/services/Analysis';
import LocationCard from './components/LocationCard';
import TaskAnaly from './components/TaskAnaly';


type RangePickerValue = RangePickerProps<moment.Moment>['value'];

type DashboardAnalysisProps = {
  dashboardAnalysis: AnalysisData;
  dispatch: Dispatch;
  loading: boolean;
};

type DashboardAnalysisState = {
  salesType: 'all' | 'online' | 'stores';
  currentTabKey: string;
  rangePickerValue: RangePickerValue;
};

class DashboardAnalysis extends Component<
  DashboardAnalysisProps,
  DashboardAnalysisState
> {
  state: DashboardAnalysisState = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  };

  reqRef: number = 0;

  timeoutId: number = 0;

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'dashboardAnalysis/fetch',
      });
    });
    getAnalysis().then(data => {
      console.log('AnalysisDATA:::', data)
    })
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAnalysis/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleChangeSalesType = (e: RadioChangeEvent) => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = (key: string) => {
    this.setState({
      currentTabKey: key,
    });
  };

  // handleRangePickerChange = (rangePickerValue: RangePickerValue) => {
  //   const { dispatch } = this.props;
  //   this.setState({
  //     rangePickerValue,
  //   });

  //   dispatch({
  //     type: 'dashboardAnalysis/fetchSalesData',
  //   });
  // };

  // selectDate = (type: 'today' | 'week' | 'month' | 'year') => {
  //   const { dispatch } = this.props;
  //   this.setState({
  //     rangePickerValue: getTimeDistance(type),
  //   });

  //   dispatch({
  //     type: 'dashboardAnalysis/fetchSalesData',
  //   });
  // };

  isActive = (type: 'today' | 'week' | 'month' | 'year') => {
    const { rangePickerValue } = this.state;
    if (!rangePickerValue) {
      return '';
    }
    const value = getTimeDistance(type);
    if (!value) {
      return '';
    }
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0] as moment.Moment, 'day') &&
      rangePickerValue[1].isSame(value[1] as moment.Moment, 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  render() {
    const { rangePickerValue, salesType, currentTabKey } = this.state;
    const { dashboardAnalysis, loading } = this.props;
    const {
      inboundOrder,
      location,
      outboundOrder,
      stock,
      task,
    } = dashboardAnalysis;

    // const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);
    return (
      <GridContent>
        <React.Fragment>
          <IntroduceRow loading={loading} inboundOrder={inboundOrder}
          outboundOrder={outboundOrder}
          stock={stock} />
          <LocationCard
            location={location}

            loading={loading}

          />

          <TaskAnaly  loading={loading} task={task} />

          <Row
            gutter={24}
            style={{
              marginTop: 24,
            }}
          >
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              {/* <TopSearch
                loading={loading}
                visitData2={visitData2}
                searchData={searchData}

              /> */}
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              {/* <ProportionSales

                salesType={salesType}
                loading={loading}
                salesPieData={salesPieData}
                handleChangeSalesType={this.handleChangeSalesType}
              /> */}
            </Col>
          </Row>
          {/* <OfflineData
            activeKey={activeKey}
            loading={loading}
            offlineData={offlineData}
            offlineChartData={offlineChartData}
            handleTabChange={this.handleTabChange}
          /> */}
        </React.Fragment>
      </GridContent>
    );
  }
}

export default connect(
  ({
    dashboardAnalysis,
    loading,
  }: {
    dashboardAnalysis: any;
    loading: {
      effects: Record<string, boolean>;
    };
  }) => ({
    dashboardAnalysis,
    loading: loading.effects['dashboardAnalysis/fetch'],
  }),
)(DashboardAnalysis);
