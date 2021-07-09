import React, { useEffect, useState, useRef, createElement } from "react";
import { Basement, Layer, Container } from "../components/BasicHTMLElement";
import InlineMultipleInput from '../components/InlineMultipleInput';
import { useHistory } from 'react-router-dom';
import { Button, Col, Form, Input, Row, Tabs, Steps } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { tmapApi, useApi, apiKey } from "../utils/api";
import { StoreState } from "../store";
import { HomeOutlined, UserOutlined, AuditOutlined } from '@ant-design/icons'
declare let TMap: any;

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
          "styleId":"marker",
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

  return <Basement style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
    <Basement style={{ width: '80%', minHeight: '80%' }}>
      <Layer style={{ right: '55%', top: 10 }}>
        <Container>
          <Tabs defaultActiveKey="rent" onChange={(key) => { setRentOrSell(key) }}>
            <Tabs.TabPane key="rent" tab="我要出租">
              <Steps current={step} size="small" style={{ margin: 20, padding: 30 }} onChange={(e) => { setStep(e) }}>
                <Steps.Step title="房源地址" icon={<HomeOutlined />} />
                <Steps.Step title="房东信息" icon={<UserOutlined />} />
                <Steps.Step title="提交审核" icon={<AuditOutlined />} />
              </Steps>
              <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} form={rentForm}>
                <Form.Item name="neighboorhoodCity" label="小区所在城市" hidden={step !== 0}>
                  <Input />
                </Form.Item>
                <Form.Item name="neighboorhood" label="小区" hidden={step !== 0}>
                  <Input />
                </Form.Item>
                <Form.Item name="exactPosition" label="房屋地址" hidden={step !== 0}>
                  <InlineMultipleInput placehoderList={['楼栋号', '单元号', '门牌号']} />
                </Form.Item>
                <Form.Item name="targetPrice" label="期望租价/月" hidden={step !== 2}>
                  <Input placeholder="请输入阿拉伯数字，单位/元" type="number" />
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
              </Form>
            </Tabs.TabPane>
            <Tabs.TabPane key="sell" tab="我要卖房">
              <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} form={sellForm}>
                <Form.Item name="neighboorhoodCity" label="小区所在城市">
                  <Input />
                </Form.Item>
                <Form.Item name="neighboorhood" label="小区">
                  <Input />
                </Form.Item>
                <Form.Item name="exactPosition" label="房屋地址">
                  <InlineMultipleInput placehoderList={['楼栋号', '单元号', '门牌号']} />
                </Form.Item>
                <Form.Item name="targetPrice" label="期望售价">
                  <Input placeholder="请输入阿拉伯数字，单位/元" type="number" />
                </Form.Item>
                <Form.Item name="appellation" label="称呼">
                  <Input />
                </Form.Item>
                <Form.Item name="phone" label="手机号">
                  <Input />
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