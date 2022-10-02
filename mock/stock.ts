import { Request, Response } from 'express';

const testStock = [
    {
      key:'1',
      StockId: 1,
      Material: '计算机',
      Batch: '2020-01-06',
      InventoryStatus: '正常',
      Quantity: 12321,
      Uom: '台',
    },{
      key:'2',
      StockId: 2,
      Material: '计算机',
      Batch: '2020-01-06',
      InventoryStatus: '正常',
      Quantity: 12321,
      Uom: '台',

    },{
      key:'3',
      StockId: 3,
      Material: '计算机',
      Batch: '2020-01-06',
      InventoryStatus: '正常',
      Quantity: 12321,
      Uom: '台',
    }];


export default {
  'GET /report/stocks': {
    success: true,
    data: testStock,
    total: 25,
  },
};
