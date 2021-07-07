import React, { useEffect, useState, useRef } from "react";
import { Basement, Layer, Container } from "../components/BasicHTMLElement";
import { useHistory } from 'react-router-dom';
import { Form, Input, Tabs } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from "../store";
declare let TMap: any;

const PublishResources = () => {
  const history = useHistory();
  const [rentOrSell, setRentOrSell] = useState('rent');
  const [mapIns, setMapIns] = useState<Object>();
  const ref = useRef(null);

  const { isLogin, apiToken } = useSelector((state: StoreState) => state);

  useEffect(() => {
    if (isLogin) {
      if (ref.current) {
        const tmap = new TMap.Map('tmap-container', {
          center: new TMap.LatLng(31.883642, 118.81864),
          zoom: 17.2,
          pitch: 0,
          rotation: 45,
        })
        setMapIns(tmap)
      }
    }
    return () => {
      setMapIns(undefined)
    };
  }, [isLogin, ref])

  return <Basement style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Basement style={{ width: '80%', height: '80%' }}>
      <Layer style={{ right: '55%' }}>
        <Container>
          <Tabs defaultActiveKey="rent" onChange={(key) => { setRentOrSell(key) }}>
            <Tabs.TabPane key="rent" tab="我要出租">
              <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                <Form.Item name="neighboorhoodCity" label="小区所在城市">
                  <Input />
                </Form.Item>
                <Form.Item name="neighboorhood" label="小区">
                  <Input />
                </Form.Item>
              </Form>
            </Tabs.TabPane>
            <Tabs.TabPane key="sell" tab="我要卖房"></Tabs.TabPane>
          </Tabs>
        </Container>
      </Layer>
      <Layer style={{ left: '55%' }}>
        <Container style={{ height: '90%'}} bodyStyle={{ height: '100%' }}>
          <div id="tmap-container" ref={ref}></div>
        </Container>
      </Layer>
    </Basement>
  </Basement>
}

export default PublishResources;