import React, { useState, useEffect } from 'react'
import { Basement, Container } from '../../../components/BasicHTMLElement'
import { RentDetailModel } from '../../../utils/DataModel'
import { Avatar, Button, Card, Divider, Input, message, Tabs, Select, Skeleton, Tag, Typography } from 'antd'
import { useApi } from '../../../utils/api'
import moment from 'moment'
declare let TMap: any;
const { Text, Title, Paragraph } = Typography;


const HouseAround = (props: { data: RentDetailModel }) => {
  const { data } = props;
  const ref = React.useRef<HTMLDivElement>(null)
  let mapIns: any = {};
  let markerLayer: any = {};

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
    const container = ref.current;
    if (container) {
      createElements();
    }
  }, [])


  return <div style={{ width: '100%', marginInline: '40px' }}>
    <Text style={{ fontSize: '1.5rem' }} strong>费用详情</Text>
    <div style={{ width: '100%', height: '50vh' }} ref={ref} id="house-around"></div>
  </div>
}

export default HouseAround;