export type VisitDataType = {
  x: string;
  y: number;
};

export type WeekDataType = {
  date: string;
  value: number;
};

export type SearchDataType = {
  index: number;
  keyword: string;
  count: number;
  range: number;
  status: number;
};

export type OfflineDataType = {
  name: string;
  cvr: number;
};

export type OfflineChartData = {
  x: any;
  y1: number;
  y2: number;
};

export type RadarData = {
  name: string;
  label: string;
  value: number;
};

export type AnalysisData = {
  inboundOrder: {
    inboundOrderCount7: WeekDataType[],
    openInboundOrderCount: number,
  },
  location: {
    availableLocationCount: number,
    disabledLocationCount: number,
    locationCount: number,
    locationUsageRate: number,
    streetletCount: number,
    locationUsageRate7: WeekDataType[];
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
  task: {
    taskCount: number,
    taskCount7: WeekDataType[],
  },





  // visitData: VisitDataType[];
  // visitData2: VisitDataType[];
  // salesData: VisitDataType[];
  // searchData: SearchDataType[];
  // offlineData: OfflineDataType[];
  // offlineChartData: OfflineChartData[];
  // salesTypeData: VisitDataType[];
  // salesTypeDataOnline: VisitDataType[];
  // salesTypeDataOffline: VisitDataType[];
  // radarData: RadarData[];
};
