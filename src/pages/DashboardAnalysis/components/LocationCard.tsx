import { Card, Col, Row } from 'antd';
import { FormattedMessage } from 'umi';
import moment from 'moment';

import React from 'react';
import numeral from 'numeral';
import type { WeekDataType } from '../data.d';
import { Bar } from './Charts';
import styles from '../style.less';

// const { RangePicker } = DatePicker;


// const rankingListData: { title: string; total: number }[] = [];


// for (let i = 0; i < 7; i += 1) {
//   rankingListData.push({
//     title: formatMessage({ id: 'dashboardanalysis.analysis.test' }, { no: i }),
//     total: 323234,
//   });
// }



const LocationCard = ({
  location,
  loading,
}: {
  location: {
    availableLocationCount: number,
    disabledLocationCount: number,
    locationCount: number,
    locationUsageRate: number,
    streetletCount: number,
    locationUsageRate7: WeekDataType[];
  },

  loading: boolean;
}) => {

  const getLocationList = ():{ title: string; total: string }[] => {
    let rankingListData: { title: string; total: string }[] = [];
    rankingListData.push({
        title: '货位数量',
        total: numeral(location.locationCount).format('0,0') ,
      })
      rankingListData.push({
          title: '可供入库的货位数量',
          total: numeral(location.availableLocationCount).format('0,0') ,
        })
        rankingListData.push({
          title: '可供入库的货位数量',
          total: numeral(location.availableLocationCount).format('0,0') ,
        })
        rankingListData.push({
          title: '巷道总数',
          total: numeral(location.streetletCount).format('0,0') ,
        })
        rankingListData.push({
          title: '当前的货位利用率',
          total: location.locationUsageRate*100+'%',
        })
        rankingListData.push({
          title: '禁用货位数量',
          total: numeral(location.disabledLocationCount).format('0,0') ,
        })

    return rankingListData

  }

  return (
    <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
      <div className={styles.salesCard}>


        <Row>
          <Col xl={16} lg={12} md={12} sm={24} xs={24}>
            <div className={styles.salesBar}>
              <Bar
                height={295}
                title={
                  <FormattedMessage
                    id="货位信息"
                    defaultMessage="货位信息"
                  />
                }
                data={location.locationUsageRate7.map(x => { return { x: moment(x.date).format('YYYY-MM-DD'), y: x.value } })}
              />
            </div>
          </Col>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <div className={styles.salesRank}>
              <h4 className={styles.rankingTitle}>
                <FormattedMessage
                  id="库位信息描述"
                  defaultMessage="库位信息描述"
                />
              </h4>
              <ul className={styles.rankingList}>
                {getLocationList().map((item, i) => (
                  <li key={item.title}>
                    <span className={styles.rankingItemTitle} title={item.title}>
                      {item.title}
                    </span>
                    <span className={styles.rankingItemValue}>
                      {item.total}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>

      </div>
    </Card>
  )
};

export default LocationCard;
