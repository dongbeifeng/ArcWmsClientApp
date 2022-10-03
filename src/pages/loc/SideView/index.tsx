import type { ISideViewData, ISideViewLocation } from "@/models/loc";
import { disableLocationInbound, disableLocationOutbound, enableLocationInbound, enableLocationOutbound, getStreetletOptions, getSideViewData, setHeightLimit, setStorageGroup, setWeightLimit } from "@/services/loc";

import Selecto from "react-selecto";
import orderBy from 'lodash/orderBy';

import './css.css'
import { uniq } from "lodash";
import { useEffect, useRef, useState } from "react";
import { Button, Checkbox, Input, message, Radio, Spin } from "antd";
import { InputNumber } from "antd";
import { Modal } from "antd";
import { Form } from "antd";
import ButtonGroup from "antd/es/button/button-group";
import { handleAction } from "@/utils/myUtils";
import { Rack } from "./Rack";
import LocationDetail from "./LocationDetail";
import { constructUserAgent } from "@microsoft/signalr/dist/esm/Utils";

const rackLabels = {
  "Left2": '左二',
  "Left1": '左一',
  "Right1": '右一',
  "Right2": '右二',
}

const rackOrders = {
  "Left2": -2,
  "Left1": -1,
  "Right1": 1,
  "Right2": 2,
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const colSortOrders = [
  { label: '从左向右', value: 'asc' },
  { label: '从右向左', value: 'desc' },
];

type RackLabel = string;
type LevelNo = number;
type RackData = Record<LevelNo, ISideViewLocation[]>;

/**
  streetlet 是从 sideViewData 重塑的对象，不是数组，例：
  {
    // Left2 表示左侧二深的货架
    "Left2": {
      // 2层
      2: [
        {
          // 1列
          1: ISideViewLocation
        }, {
          // 2列
          2: ISideViewLocation
        },
        ...
      ],

      // 1层
      1: [...],
    }，
    "Left1": ...,
    "Right1": ...,
    "Right2": ,,,
  }
*/
type StreetletData = Record<RackLabel, RackData>;

type DialogType = 'enableInbound' | 'disableInbound' | 'enableOutbound' | 'disableOutbound' | 'setStorageGroup' | 'setWeightLimit' | 'setHeightLimit';

const titleObj: Record<DialogType, string> = {
  'disableInbound': '禁止入站',
  'disableOutbound': '禁止出站',
  'enableInbound': '允许入站',
  'enableOutbound': '允许出站',
  'setStorageGroup': '设置分组',
  'setWeightLimit': '设置限重',
  'setHeightLimit': '设置限高',
}


function findProp<K extends keyof any, V>(obj: Record<K, V>, key: K, defaultValue: V) {
  if (!obj[key]) {
    // eslint-disable-next-line no-param-reassign
    obj[key] = defaultValue;
  }
  return obj[key] as V;
}

export default function SideView() {
  const ref = useRef<Selecto>(null);
  const [currentStreetletCode, setCurrentStreetletCode] = useState<string>();
  const [sideViewData, setSideViewData] = useState<ISideViewData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [streetlet, setStreetlet] = useState<StreetletData>();
  const [drag, setDrag] = useState<boolean>(false);
  const [streetletList, setStreetletList] = useState<string[]>();
  const [currentLocationCode, setCurrentLocationCode] = useState<string>('');
  const [isShowDetail, setIsShowDetail] = useState<boolean>(false);
  const [colSortOrder, setColSortOrder] = useState<'asc' | 'desc'>('asc');

  const [highlightedValue, setHighlightedValue] = useState<{
    storageGroup?: string,
    specification?: string,
    heightLimit?: number,
    weightLimit?: number
  }>();

  const [dialogVisable, setDialogVisable] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<DialogType>();

  const [form] = Form.useForm<{
    comment: string,
    heightLimit: number,
    weightLimit: number,
    storageGroup: string,
  }>();

  function getSelectedLocationIds() {
    if (ref.current) {
      return ref.current.getSelectedTargets().map(el => +(el.dataset.locationId || -1));
    }
    return [];
  }

  function clearSelection() {
    if (ref.current) {
      ref.current.getSelectedTargets().forEach(el => {
        el.classList.remove("selected");
      });
      ref.current.setSelectedTargets([]);
    }
  }

  const loadData = async (streetletCode: string) => {
    if (currentStreetletCode === streetletCode) {
      return;
    }

    setLoading(true);
    try {
      const res = await getSideViewData(streetletCode);
      if (res.success) {
        setCurrentStreetletCode(streetletCode);
        setSideViewData(res.data);
        const tempStreetlet: StreetletData = {};
        res.data?.locations.forEach(loc => {
          const rackLabel = loc.side + loc.deep;
          const rack: RackData = findProp(tempStreetlet, rackLabel, {});
          const level: ISideViewLocation[] = findProp(rack, loc.level, []);
          level.push(loc);
        });
        setStreetlet(tempStreetlet);
      } else {
        message.error(res.errorMessage, 15);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : error;
      message.error(`加载数据失败：${msg}`, 15);
    } finally {
      clearSelection();
      cancelHighlight();
      setLoading(false);
    }
  }

  useEffect(() => {
    const fn = async () => {
      setLoading(true);
      try {
        const ret = await getStreetletOptions();
        if (!ret.success) {
          throw new Error(ret.errorMessage);
        }
        const arr = ret.data || [];
        setStreetletList(arr.map(x => x.streetletCode));
        if (!currentStreetletCode && arr.length > 0) {
          await loadData(arr[0].streetletCode);
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : error;
        message.error(`加载数据失败：${msg}`, 15);
      } finally {
        setLoading(false);
      }
    }
    fn();
  }, []);




  function getGroups() {
    if (!sideViewData) {
      return [];
    }
    return uniq(sideViewData.locations.filter(loc => loc.exists).map(loc => loc.storageGroup));
  }

  function getHeightLimits() {
    if (!sideViewData) {
      return [];
    }
    return uniq(sideViewData.locations.filter(loc => loc.exists).map(loc => loc.heightLimit));
  }

  function getWeightLimits() {
    if (!sideViewData) {
      return [];
    }
    return uniq(sideViewData.locations.filter(loc => loc.exists).map(loc => loc.weightLimit));
  }

  function getSpecifications() {
    if (!sideViewData) {
      return [];
    }
    return uniq(sideViewData.locations.filter(loc => loc.exists).map(loc => loc.specification));
  }


  function setHighlight(predicate: (el: HTMLElement) => boolean) {
    const elements = document.getElementsByClassName("cbox");
    for (let i = 0; i < elements.length; i += 1) {
      const el = elements[i] as HTMLElement;
      if (!el.classList.contains('notexists') && predicate(el)) {
        el.classList.add("highlight");
      } else {
        el.classList.remove("highlight");
      }
    }
  }

  function cancelHighlight() {
    const elements = document.getElementsByClassName("cbox");
    for (let i = 0; i < elements.length; i += 1) {
      elements[i].classList.remove("highlight");
    }
    setHighlightedValue(undefined);
  }



  function showDialog(type: DialogType) {
    if (getSelectedLocationIds().length === 0) {
      message.warn("未选择任何货位！");
    }
    else {
      form.resetFields()
      setDialogType(type);
      setDialogVisable(true)
    }
  }


  async function handleOk() {
    const fieldsValue = await form.validateFields();
    setLoading(true);
    const args = {
      locationIds: getSelectedLocationIds(),
      ...fieldsValue,
    }
    try {
      const success = await handleAction(() => {
        switch (dialogType) {
          case "enableInbound":
            return enableLocationInbound(args);
          case "disableInbound":
            return disableLocationInbound(args);
          case "enableOutbound":
            return enableLocationOutbound(args);
          case "disableOutbound":
            return disableLocationOutbound(args);
          case "setStorageGroup":
            return setStorageGroup(args);
          case "setWeightLimit":
            return setWeightLimit(args);
          case "setHeightLimit":
            return setHeightLimit(args);
          default:
            throw new Error('不支持的对话框类型');
        }
      });

      if (success) {
        if (currentStreetletCode) {
          await loadData(currentStreetletCode);
        }
        setDialogVisable(false);
      }
    } finally {
      setLoading(false);
    }

  }

  function handleCancel() {
    setDialogVisable(false)
  }

  function showDetail(code: string) {
    setCurrentLocationCode(code)
    setIsShowDetail(true)
  }
  return (
    <Spin spinning={loading}>
      <div className="viewport">
        <ButtonGroup>
          {
            streetletList && streetletList.map(x =>
            (
              <Button
                type={currentStreetletCode === x ? 'primary' : 'default'}
                onClick={async () => { await loadData(x); }}
                key={x}>
                {x}
              </Button>))
          }
        </ButtonGroup>

        <div className="container">
          <Selecto
            ref={ref}
            dragContainer={".elements"}
            selectableTargets={drag ? [".selecto-area .cbox"] : []}
            hitRate={1}
            selectByClick={true}
            selectFromInside={true}
            ratio={0}
            continueSelect={true}
            onSelect={e => {
              e.added.forEach(el => {
                el.classList.add("selected");
              });
              e.removed.forEach(el => {
                el.classList.remove("selected");
              });
            }}
          ></Selecto>

          <div className="elements selecto-area" id="selecto1">
            {
              streetlet &&
              orderBy(Object.keys(streetlet), x => rackOrders[x]).map(rackLabel => {
                return (
                  <Rack key={rackLabel} dispalyText={rackLabels[rackLabel]} rack={streetlet[rackLabel]} colSortOrder={colSortOrder} showDetail={showDetail} />
                );
              })
            }
          </div>
          <div className="empty elements"></div>
        </div>
        <div style={{ marginTop: 16 }}>
          <span
            style={{ marginRight: 16 }}>
            分组：
            <Radio.Group
              onChange={(e) => {
                setHighlightedValue({
                  storageGroup: e.target.value
                });
                setHighlight(el => el.dataset.storageGroup === e.target.value);
              }}
              value={highlightedValue?.storageGroup}
              optionType="button"
              buttonStyle="solid">
              {
                getGroups().map(x => { return <Radio.Button value={x} key={x}>{x}</Radio.Button > })
              }
            </Radio.Group>
          </span>
          <span
            style={{ marginRight: 16 }}>
            规格：
            <Radio.Group
              onChange={(e) => {
                setHighlightedValue({
                  specification: e.target.value
                });
                setHighlight(el => el.dataset.specification === e.target.value)
              }}
              value={highlightedValue?.specification}
              optionType="button"
              buttonStyle="solid">
              {
                getSpecifications().map(x => { return <Radio.Button value={x} key={x}>{x}</Radio.Button > })
              }
            </Radio.Group>
          </span>
          <span
            style={{ marginRight: 16 }}>
            限高：
            <Radio.Group
              onChange={(e) => {
                setHighlightedValue({
                  heightLimit: +e.target.value
                });
                setHighlight(el => +(el.dataset.heightLimit ?? -1) === +e.target.value)
              }}
              value={highlightedValue?.heightLimit}
              optionType="button"
              buttonStyle="solid">
              {
                getHeightLimits().map(x => { return <Radio.Button value={x} key={x}>{x}</Radio.Button > })
              }
            </Radio.Group>
          </span>
          <span
            style={{ marginRight: 16 }}>
            限重：
            <Radio.Group
              onChange={(e) => {
                setHighlightedValue({
                  weightLimit: +e.target.value
                });
                setHighlight(el => +(el.dataset.weightLimit ?? -1) === +e.target.value)
              }}
              value={highlightedValue?.weightLimit}
              optionType="button"
              buttonStyle="solid">
              {
                getWeightLimits().map(x => { return <Radio.Button value={x} key={x}>{x}</Radio.Button > })
              }
            </Radio.Group>
          </span>

          <span
            style={{ marginRight: 16 }}>
            {highlightedValue && <Button type="dashed"
              onClick={cancelHighlight} >取消高亮</Button>}
          </span>
        </div>
        <div style={{ marginTop: 16 }}>
          <Checkbox onChange={(e) => setDrag(e.target.checked)}>拖选</Checkbox>

          <Button style={{ marginRight: 8 }} onClick={() => showDialog('enableInbound')} >允许入站</Button>
          <Button style={{ marginRight: 8 }} onClick={() => showDialog('disableInbound')}>禁止入站</Button>
          <Button style={{ marginRight: 8 }} onClick={() => showDialog('enableOutbound')} >允许出站</Button>
          <Button style={{ marginRight: 8 }} onClick={() => showDialog('disableOutbound')}>禁止出站</Button>
          <Button style={{ marginRight: 8 }} onClick={() => showDialog('setStorageGroup')} >设置分组</Button>
          <Button style={{ marginRight: 8 }} onClick={() => showDialog('setHeightLimit')}>设置限高</Button>
          <Button style={{ marginRight: 8 }} onClick={() => showDialog('setWeightLimit')}>设置限重</Button>

          <Radio.Group
            options={colSortOrders}
            onChange={e => setColSortOrder(e.target.value)}
            value={colSortOrder}
            optionType="button"
            buttonStyle="solid"
          />

        </div>
        {
          dialogType &&
          <Modal
            title={titleObj[dialogType]}
            visible={dialogVisable}
            confirmLoading={loading}
            onOk={handleOk}
            onCancel={handleCancel}
            maskClosable={false}
          >
            <Form
              {...layout}
              name="comment"
              initialValues={{ comment: "" }}
              form={form}
            >
              {
                (() => {
                  switch (dialogType) {
                    case "enableInbound":
                    case "disableInbound":
                    case "enableOutbound":
                    case "disableOutbound":
                      return (
                        <Form.Item
                          label='备注信息'
                          name="comment"
                          rules={[{ required: true, message: '请填写备注' }]}
                        >
                          <Input maxLength={200} autoComplete='off' />
                        </Form.Item>
                      );
                    case "setStorageGroup":
                      return (
                        <Form.Item
                          label='分组'
                          name="storageGroup"
                          rules={[{ required: true, message: '请填写分组' }]}
                        >
                          <Input maxLength={200} autoComplete='off' />
                        </Form.Item>);
                    case "setWeightLimit":
                      return (
                        <Form.Item
                          label='限重'
                          name="weightLimit"
                          rules={[{ required: true, message: '请填写限重' }]}
                        >
                          <InputNumber min={0} max={99999} defaultValue={0} autoComplete='off' />
                        </Form.Item>
                      );
                    case "setHeightLimit":
                      return (
                        <Form.Item
                          label='限高'
                          name="heightLimit"
                          rules={[{ required: true, message: '请填写限高' }]}
                        >
                          <InputNumber min={0} max={99999} defaultValue={0} autoComplete='off' />
                        </Form.Item>
                      );
                    default:
                      return <></>
                  }
                })()
              }

            </Form>
          </Modal>
        }
        <LocationDetail locationCode={currentLocationCode} isShow={isShowDetail} setShow={setIsShowDetail} />
      </div>

    </Spin >
  );
}
