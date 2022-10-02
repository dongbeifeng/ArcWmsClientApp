// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  history: {
    type: 'hash', // 默认是 browser
  },
  antd: {
    // dark: true,
    // compact: true,
  },
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/loc/SideView/',
          name: '侧视图',
          icon: 'smile',
          exact: true,
          hideInMenu: true,
          component: './loc/SideView',
        },
        {
          path: '/dbg/logslist',
          name: '日志列表',
          icon: 'smile',
          exact: true,
          hideInMenu: true,
          component: './dbg/LogList',
        },
        {
          path: '/dbg/trace-log/:requestId/:time',
          hide: true,
          component: './dbg/TraceLog',
        },
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/user/login',
              name: 'login',
              component: './user/login',
            },
            {
              path: '/user',
              redirect: '/user/login',
            }, // {
            //   name: 'register-result',
            //   icon: 'smile',
            //   path: '/user/register-result',
            //   component: './user/register-result',
            // },
            // {
            //   name: 'register',
            //   icon: 'smile',
            //   path: '/user/register',
            //   component: './user/register',
            // },
            {
              component: '404',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              name: '首页',
              icon: 'smile',
              path: '/',
              component: './DashboardAnalysis',
            },
            {
              path: 'loc',
              name: '位置',
              icon: 'environment',
              routes: [
                {
                  path: 'streetlets',
                  name: '巷道列表',
                  icon: 'smile',
                  component: './loc/StreetletList',
                },
                {
                  path: 'sideview',
                  name: '侧视图',
                  icon: 'smile',
                },
                {
                  path: 'storage-locations',
                  name: '货位列表',
                  icon: 'smile',
                  component: './loc/StorageLocationList',
                },
                {
                  path: 'key-points',
                  name: '关键点列表',
                  icon: 'smile',
                  component: './loc/KeyPointList',
                },
                {
                  path: 'outlets',
                  name: '出口列表',
                  icon: 'smile',
                  component: './loc/OutletList',
                },
              ],
            },
            {
              path: 'matl',
              name: '库存',
              icon: 'appstore',
              routes: [
                {
                  path: 'materials',
                  name: '物料主数据列表',
                  icon: 'smile',
                  component: './matl/MaterialList',
                },
                {
                  path: 'import-materials',
                  name: '导入物料主数据',
                  icon: 'smile',
                  component: './matl/ImportMaterials',
                },
                {
                  path: 'unitloads',
                  name: '货载列表',
                  icon: 'smile',
                  component: './matl/UnitloadList',
                },
                {
                  path: 'unitloads/:palletCode',
                  name: '货载详情',
                  hideInMenu: true,
                  component: './matl/UnitloadDetail',
                },
                {
                  path: 'flows',
                  name: '流水列表',
                  icon: 'smile',
                  component: './matl/FlowList',
                },
                {
                  path: 'change-inventory-status',
                  name: '更改库存状态',
                  icon: 'smile',
                  component: './matl/ChangeInventoryStatus',
                },
                {
                  path: 'palletize-standalonely',
                  name: '独立组盘',
                  icon: 'smile',
                  component: './matl/PalletizeStandalonely',
                },
              ],
            },
            {
              path: 'order',
              name: '出入',
              icon: 'swap',
              routes: [
                {
                  path: 'inbound-orders',
                  name: '入库单列表',
                  icon: 'smile',
                  component: './ibo/List',
                },
                {
                  path: 'create-inbound-order',
                  name: '创建入库单',
                  component: './ibo/CreateUpdateForm',
                },
                {
                  path: 'edit-inbound-order/:inboundOrderId',
                  name: '修改入库单',
                  component: './ibo/CreateUpdateForm',
                  hideInMenu: true,
                },
                {
                  path: 'inbound-orders/:inboundOrderId',
                  name: '入库单详情',
                  component: './ibo/Detail',
                  hideInMenu: true,
                },
                {
                  path: 'inbound-orders/palletize/:inboundOrderId',
                  name: '入库单组盘',
                  component: './ibo/Palletize',
                  hideInMenu: true,
                },
                {
                  path: 'outbound-orders',
                  name: '出库单列表',
                  icon: 'smile',
                  component: './obo/List',
                },
                {
                  path: 'create-outbound-order',
                  name: '创建出库单',
                  component: './obo/CreateUpdateForm',
                },
                {
                  path: 'edit-outbound-order/:outboundOrderId',
                  name: '修改出库单',
                  component: './obo/CreateUpdateForm',
                  hideInMenu: true,
                },
                {
                  path: 'outbound-orders/:outboundOrderId',
                  name: '出库单详情',
                  component: './obo/Detail',
                  hideInMenu: true,
                },
              ],
            },
            {
              path: 'tsk',
              name: '任务',
              icon: 'ArrowRight',
              routes: [
                {
                  path: 'tasks',
                  name: '任务列表',
                  icon: 'smile',
                  component: './tsk/TaskList',
                },
                {
                  path: 'archived-tasks',
                  name: '历史任务',
                  icon: 'smile',
                  component: './tsk/ArchivedTaskList',
                },
                {
                  path: 'manual-task',
                  name: '手工任务',
                  icon: 'smile',
                  component: './tsk/ManualTask',
                },
                {
                  name: '更改货载位置',
                  icon: 'smile',
                  path: 'change-unitload-location',
                  component: './tsk/ChangeUnitloadLocation',
                },
              ],
            },
            {
              path: 'rpt',
              name: '报表',
              icon: 'BarChart',
              routes: [
                {
                  path: 'inventory-report',
                  name: '实时库存',
                  icon: 'smile',
                  component: './rpt/InventoryReport',
                },
                {
                  path: 'monthly-report',
                  name: '库存月报',
                  icon: 'smile',
                  component: './rpt/MonthlyReport',
                },
                {
                  path: 'age-report',
                  name: '库龄报表',
                  icon: 'smile',
                  component: './rpt/AgeReport',
                },
              ],
            },
            {
              path: 'sys',
              name: '系统',
              icon: 'setting',
              routes: [
                {
                  path: 'users',
                  name: '用户列表',
                  icon: 'smile',
                  component: './sys/UserList',
                },
                {
                  path: 'roles',
                  name: '角色列表',
                  icon: 'smile',
                  component: './sys/RoleList',
                },
                {
                  path: 'app-settings',
                  name: '参数列表',
                  icon: 'smile',
                  component: './sys/AppSettingList',
                },
                {
                  path: 'ops',
                  name: '操作记录',
                  icon: 'smile',
                  component: './sys/OpList',
                },
                {
                  path: 'trigger',
                  name: '触发器',
                  icon: 'smile',
                  component: './sys/TriggerList',
                },
              ],
            },
            {
              path: 'dbg',
              name: '调试',
              icon: 'tool',
              routes: [
                {
                  path: 'logs',
                  name: '日志列表',
                  icon: 'smile',
                  exact: true,
                  redirect: 'logslist',
                  component: './dbg/LogList',
                },
                {
                  path: 'check',
                  name: '下架检查一次',
                  icon: 'smile',
                  component: './Welcome',
                },
                {
                  path: 'delete-logs',
                  name: '删除日志',
                  icon: 'smile',
                  component: './Welcome',
                },
                {
                  path: 'simulate-request',
                  name: '模拟请求',
                  icon: 'smile',
                  component: './dbg/SimulateRequest',
                },
                {
                  path: 'simulate-completion',
                  name: '模拟完成',
                  icon: 'smile',
                  component: './dbg/SimulateCompletion',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
