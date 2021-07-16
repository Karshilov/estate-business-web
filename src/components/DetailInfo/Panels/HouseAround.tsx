import React, { useState, useEffect } from 'react'
import { Basement, Container } from '../../../components/BasicHTMLElement'
import { RentDetailModel } from '../../../utils/DataModel'
import { Avatar, Button, Card, Divider, Input, message, Tabs, Select, Skeleton, Tag, Typography } from 'antd'
import { useApi } from '../../../utils/api'
import { defaultMarker, highlightMarker } from '../../../utils/marker'
import { poi } from '../../../utils/poi'
declare let TMap: any;
const { Text, Title, Paragraph } = Typography;


const HouseAround = (props: { data: RentDetailModel }) => {
  const { data } = props;
  const ref = React.useRef<HTMLDivElement>(null)
  let mapIns: any = {};
  let markerLayer: any = {};
  const api = useApi();
  const [category, setCategory] = useState('美食');

  const showPosition = async (addr: string) => {
    if (addr !== '') {
      console.log(addr)
      const res = await api.get(`/tmap-ws/address`, { params: { addr } })
      if (res.data.success) {
        //  return res.data.result.location
        const lat = res.data.result.location.lat;
        const lng = res.data.result.location.lng;
        const data = await api.get(`/tmap-ws/place?keyword=${addr}&lat=${lat}&lng=${lng}&radius=${1000}&category=${category}`)
        if (data.data.success) {
          console.log(data.data.result)
        } else {
          message.error(data.data.message)
        }
        return {
          center: res.data.result.location,
          points: data.data.result.data
        }
      } else {
        message.error(res.data.message)
      }
    }
  }

  const createElements = async () => {
    const res = await showPosition(data.city + data.title.split('·')[1].split(/\s+/)[0])
    if (!res) return;
    const tmap = new TMap.Map('house-around', {
      center: new TMap.LatLng(res.center.lat, res.center.lng),
      zoom: 16.2,
      pitch: 0,
      rotation: 45,
    })
    mapIns = tmap;
    markerLayer = new TMap.MultiMarker({
      id: "marker-layer", //图层id
      map: mapIns,
      styles: { //点标注的相关样式
        "marker": new TMap.MarkerStyle({
          "width": 20,
          "height": 20,
          "anchor": { x: 10, y: 20 },
          "src": defaultMarker
        }),
        "h-marker": new TMap.MarkerStyle({
          "width": 20,
          "height": 20,
          "anchor": { x: 10, y: 20 },
          "src": highlightMarker
        }),
      },
      geometries: [{
        "id": "1",
        "styleId": 'marker',
        "title": data.title,
        "position": new TMap.LatLng(res.center.lat, res.center.lng),
      }, ...res.points.map((item: any) => ({
        "id": item.id,
        "styleId": 'marker',
        "title": item.title,
        "distance": item._distance,
        "position": new TMap.LatLng(item.location.lat, item.location.lng)
      }))]
    })
    markerLayer.on('click', function (evt: any) {
      console.log(evt)
      const point = res.points.find((item: any) => item.id === evt.geometry.id)
      const infowindow = new TMap.InfoWindow({
        content: evt.geometry.title === data.title ? `<span>${evt.geometry.title}</span>`
          : `<span>${evt.geometry.title + ' - '}</span><span style="color: blue">${evt.geometry.distance}m</span>`, //信息窗口内容
        position: new TMap.LatLng(evt.latLng.lat, evt.latLng.lng), //显示信息窗口的坐标
        map: mapIns,
        offset: { x: 0, y: -10 }
      });
      const pos = evt.geometry.title === data.title ? new TMap.LatLng(res.center.lat, res.center.lng) : new TMap.LatLng(point.location.lat, point.location.lng)
      infowindow.on('closeclick', function (e: any) {
        infowindow.destroy();
        markerLayer.updateGeometries([{
          "styleId": "marker",
          "id": evt.geometry.id,
          "title": evt.geometry.title,
          "distance": evt.geometry.distance,
          "position": pos
        }])
      })
      markerLayer.updateGeometries([{
        "styleId": "h-marker",
        "id": evt.geometry.id,
        "title": evt.geometry.title,
        "distance": evt.geometry.distance,
        "position": pos
      }])
    })
  }

  const updateElements = () => {
    
  }

  useEffect(() => {
    const container = ref.current;
    if (container) {
      createElements();
    }
  }, [])


  return <div style={{ width: '100%', marginInline: '40px', marginTop: '40px' }}>
    <Text style={{ fontSize: '1.5rem' }} strong>位置周边</Text>
    <div style={{ position: 'relative', width: '100%', height: '70vh', marginTop: 30 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} ref={ref} id="house-around"></div>
      <div style={{ position: 'absolute', top: 20, left: 20, padding: 4, background: '#fff', display: 'flex', zIndex: 2000 }}>
      {poi.map((item) => <div
        key={item}
        style={{ display: 'flex', flexDirection: 'column' }}
        className="p-1 m-1" onClick={() => { setCategory(item) }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>{item}</label>
        <div style={{ height: 3, width: 'auto', background: '#00896c', borderRadius: 1, marginTop: 5 }} hidden={item !== category}></div>
      </div>)}
      </div>
    </div>
  </div>
}

export default HouseAround;