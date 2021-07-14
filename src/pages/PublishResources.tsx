import React, { useEffect, useState, useRef, createElement } from "react";
import { Basement, Layer, Container } from "../components/BasicHTMLElement";
import InlineMultipleInput from '../components/InlineMultipleInput';
import { useHistory } from 'react-router-dom';
import { Button, Col, Form, Input, Row, Tabs, Steps, Select, Upload, Radio, Tooltip, Tag } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { tmapApi, useApi, apiKey } from "../utils/api";
import { StoreState } from "../store";
import { HomeOutlined, FormOutlined, AuditOutlined, UploadOutlined } from '@ant-design/icons'
import WashIcon from '../assets/equipments/wash.svg'
import AirCondIcon from '../assets/equipments/aircond.svg'
import BedIcon from '../assets/equipments/bed.svg'
import GasIcon from '../assets/equipments/gas.svg'
import RefrigeratorIcon from '../assets/equipments/refrigerator.svg'
import TVIcon from '../assets/equipments/tv.svg'
import WardrobeIcon from '../assets/equipments/wardrobe.svg'
import WarmIcon from '../assets/equipments/warm.svg'
import WaterHeaterIcon from '../assets/equipments/wheater.svg'
import WifiIcon from '../assets/equipments/wifi.svg'
import { count } from "yargs";
import { transpileModule } from "typescript";


declare let TMap: any;


const { CheckableTag } = Tag;

const PublishResources = () => {
  const history = useHistory();
  const [rentOrSell, setRentOrSell] = useState('rent');
  let mapIns: any = {};
  let markerLayer: any = {};
  const [price, setPrice] = useState(0);
  const ref = useRef(null);
  const api = useApi();
  const [step, setStep] = useState(0);
  const [rentForm] = Form.useForm();
  const [sellForm] = Form.useForm();

  const { isLogin, apiToken } = useSelector((state: StoreState) => state);

  const feature = ['洗衣机', '空调', '衣柜', '电视', '冰箱',
    '热水器', '床', '暖气', '宽带', '天然气'];
  const equipmentArr = [WashIcon, AirCondIcon, WardrobeIcon, TVIcon, RefrigeratorIcon,
    WaterHeaterIcon, BedIcon, WarmIcon, WifiIcon, GasIcon];
  const [featureState, setFeatureState] = useState(0);

  const createElements = () => {
    const tmap = new TMap.Map('tmap-container', {
      center: new TMap.LatLng(31.883642, 118.81864),
      zoom: 17.2,
      pitch: 0,
      rotation: 45,
    })
    mapIns = tmap;
    markerLayer = new TMap.MultiMarker({
      id: "marker-layer", //图层id
      map: mapIns,
      styles: { //点标注的相关样式
        "marker": new TMap.MarkerStyle({
          "width": 25,
          "height": 35,
          "anchor": { x: 16, y: 32 },
          "src": "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png"
        })
      },
      geometries: [{
        "id": "1",
        "styleId": 'marker',
        "position": new TMap.LatLng(31.883642, 118.81864),
      }]
    })
  }

  useEffect(() => {
    if (isLogin) {
      if (ref.current) {
        createElements();
      }
    }
  }, [isLogin, ref])

  const showPosition = async (addr: string) => {
    if (addr !== '') {
      const res = await api.get(`/tmap-ws/address?addr=${addr}`)
      if (res.data.success) {
        mapIns.setCenter(new TMap.LatLng(res.data.result.location.lat, res.data.result.location.lng))
        markerLayer.updateGeometries([{
          "styleId": "marker",
          "id": "1",
          "position": new TMap.LatLng(res.data.result.location.lat, res.data.result.location.lng),
        }])
      }
    }
  }

  const onRentPosCheck = () => {
    console.log('here')
    const allValues = rentForm.getFieldsValue(true);
    console.log('got')
    let baseString = '';
    if (allValues['neighboorhoodCity']) baseString += allValues['neighboorhoodCity'];
    if (allValues['neighboorhood']) baseString += allValues['neighboorhood'];
    if (allValues['exactPosition']) baseString += allValues['exactPosition']['a'] + allValues['exactPosition']['b'] + allValues['exactPosition']['c']
    showPosition(baseString)
  }

  const beforeUpload = (file: any, fileList: any) => {
    console.log(file, fileList)
  }

  const handleFeatureChange = (id: number) => {
    // console.log("PreSate：", featureState);
    const tmp = (1 << (feature.length - id - 1));
    setFeatureState(featureState ^ tmp);
  }

  const haveFeatureId = (id: number) => {
    if (featureState & (1 << (feature.length - id - 1)))
      return true;
    return false;
  }

  const featureStyle1: React.CSSProperties = {
    opacity: '20%',
    width: '20%',
  };

  const featureStyle2: React.CSSProperties = {
    opacity: '100%',
    width: '20%',
  };


  return <Basement style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
    <Basement style={{ width: '80%', minHeight: '80%' }}>
      <Layer style={{ right: '55%', top: 10 }}>
        <Container>
          <Tabs defaultActiveKey="rent" onChange={(key) => { setRentOrSell(key) }}>
            <Tabs.TabPane key="rent" tab="我要出租">
              <Steps current={step} size="small" style={{ margin: 20, padding: 30 }} onChange={(e) => { setStep(e) }}>
                <Steps.Step title="房源地址" icon={<HomeOutlined />} />
                <Steps.Step title="详细信息" icon={<FormOutlined />} />
                <Steps.Step title="提交审核" icon={<AuditOutlined />} />
              </Steps>
              {/*房源地址*/}
              <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} form={rentForm}>
                <Form.Item name="city" label="城市" hidden={step !== 0}>
                  <Input />
                </Form.Item>
                <Form.Item name="neighbourhood" label="小区" hidden={step !== 0}>
                  <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 6, span: 20 }} hidden={step !== 0}>
                  <Button type="default" onClick={onRentPosCheck}>检查地址</Button>
                </Form.Item>

                {/*详细信息*/}
                <Row wrap={false}>
                  <Form.Item labelCol={{ offset: 9 }} wrapperCol={{ span: 12 }} name="floor" label="楼层" hidden={step !== 1}>
                    <Input />
                  </Form.Item>

                  <Form.Item labelCol={{ offset: 3 }} wrapperCol={{ span: 10 }} name="totalFloor" label="总楼层" hidden={step !== 1}>
                    <Input />
                  </Form.Item>
                </Row>
                <Form.Item wrapperCol={{ span: 15 }} name="area" label="面积" hidden={step !== 1}>
                  <Input placeholder="请输入阿拉伯数字，单位/㎡" />
                </Form.Item>

                <Tooltip placement="top" title="请输入阿拉伯数字">
                  <Form.Item name="houseType" label="房型" hidden={step !== 1}>
                    <InlineMultipleInput placehoderList={['室', '厅', '卫']} />
                  </Form.Item>
                </Tooltip>

                <Form.Item name="decoration" label="装修情况" hidden={step !== 1}>
                  <Radio.Group defaultValue="a">
                    <Radio.Button value="豪装">豪装</Radio.Button>
                    <Radio.Button value="精装">精装</Radio.Button>
                    <Radio.Button value="中装">中装</Radio.Button>
                    <Radio.Button value="简装">简装</Radio.Button>
                    <Radio.Button value="毛胚">毛胚</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item name="equipments" label="配套设施" hidden={step !== 1}>
                  <Row>
                    {feature.map((tag, id) => (
                      <div style={haveFeatureId(id) ? featureStyle2 : featureStyle1}>
                        <img src={equipmentArr[id]} style={{ height: '30px', width: '100%', marginTop:'14px' }} onClick={() => handleFeatureChange(id)} />
                        <p style={{ textAlign: 'center', marginBottom: 0 }}>{tag}</p>
                      </div>
                    ))}
                  </Row>
                </Form.Item>

                <Form.Item name="photots" label="房屋内景" hidden={step !== 1}>
                  <Upload listType="text" multiple={true} maxCount={10} beforeUpload={beforeUpload}>
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                  </Upload>
                </Form.Item>


                {/*提交审核*/}

                <Form.Item name="features" label="添加标签" hidden={step !== 2}>
                  <Input />
                </Form.Item>

                <Form.Item name="price" label="价格" hidden={step !== 2}>
                  <Input placeholder="请输入阿拉伯数字，单位：元/月" type="number" />
                </Form.Item>

                <Form.Item name="rentType" label="支付方式" hidden={step !== 2}>
                  <Radio.Group defaultValue="a">
                    <Radio.Button value="押一付三">押一付三</Radio.Button>
                    <Radio.Button value="半年一付">半年一付</Radio.Button>
                    <Radio.Button value="一年一付">一年一付</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 6, span: 20 }} hidden={step !== 2}>
                  <Button type="default" onClick={onRentPosCheck}>提交审核</Button>
                </Form.Item>

              </Form>
            </Tabs.TabPane>

            <Tabs.TabPane key="sell" tab="我要卖房">
              <Steps current={step} size="small" style={{ margin: 20, padding: 30 }} onChange={(e) => { setStep(e) }}>
                <Steps.Step title="房源地址" icon={<HomeOutlined />} />
                <Steps.Step title="卖房者信息" icon={<FormOutlined />} />
                <Steps.Step title="提交审核" icon={<AuditOutlined />} />
              </Steps>

              <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} form={sellForm}>
                <Form.Item name="neighboorhoodCity" label="小区所在城市" hidden={step !== 0}>
                  <Input />
                </Form.Item>
                <Form.Item name="neighboorhood" label="小区" hidden={step !== 0}>
                  <Input />
                </Form.Item>
                <Form.Item name="exactPosition" label="房屋地址" hidden={step !== 0}>
                  <InlineMultipleInput placehoderList={['楼栋号', '单元号', '门牌号']} />
                </Form.Item>
                <Form.Item name="appellation" label="称呼" hidden={step !== 1}>
                  <Input />
                </Form.Item>
                <Form.Item name="phone" label="手机号" hidden={step !== 1}>
                  <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 6, span: 20 }} hidden={step !== 0}>
                  <Button type="default" onClick={onRentPosCheck}>检查地址</Button>
                </Form.Item>
                <Form.Item name="targetPrice" label="期望售价" hidden={step !== 2}>
                  <Input placeholder="请输入阿拉伯数字，单位/万元" type="number" />
                </Form.Item>
              </Form>
            </Tabs.TabPane>
          </Tabs>
        </Container>
      </Layer>
      <Layer style={{ left: '55%', top: 10 }}>
        <Container style={{ height: '70%' }} bodyStyle={{ height: '100%' }}>
          <div id="tmap-container" ref={ref} style={{ height: '100%' }}></div>
        </Container>
      </Layer>
    </Basement>
  </Basement>
}

export default PublishResources;