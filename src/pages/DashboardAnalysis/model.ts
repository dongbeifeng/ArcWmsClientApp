import { getAnalysis } from '@/services/Analysis';
import type { Effect, Reducer } from 'umi';

import type { AnalysisData } from './data.d';
// import { fakeChartData } from './service';

export type ModelType = {
  namespace: string;
  state: AnalysisData;
  effects: {
    fetch: Effect;
    fetchSalesData: Effect;
  };
  reducers: {
    save: Reducer<AnalysisData>;
    clear: Reducer<AnalysisData>;
  };
};

const initState = {
  inboundOrder: {
    inboundOrderCount7: [],
    openInboundOrderCount: 0,
  },
  location: {
    availableLocationCount: 0,
    disabledLocationCount: 0,
    locationCount: 0,
    locationUsageRate: 0,
    streetletCount: 0,
    locationUsageRate7: [],
  },
  outboundOrder: {
    openOutboundOrderCount: 0,
    outboundOrderCount7: [],
  },
  stock: {
    unitloadCount: 0,
    emptyPalletCount: 0,
    flowInCount7: [],
    flowOutCount7: [],
  },
  task: {
    taskCount: 0,
    taskCount7: [],
  },
};

const Model: ModelType = {
  namespace: 'dashboardAnalysis',

  state: initState,

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(getAnalysis);
      yield put({
        type: 'save',
        payload:{
          inboundOrder: response.data.inboundOrder,
          location: response.data.location,
          outboundOrder: response.data.outboundOrder,
          stock: response.data.stock,
          task: response.data.task,
        } ,
      });
    },
    *fetchSalesData(_, { call, put }) {
      const response = yield call(getAnalysis);
      yield put({
        type: 'save',
        payload: {
          salesData: response.salesData,
        },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return initState;
    },
  },
};

export default Model;
