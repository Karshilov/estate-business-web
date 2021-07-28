import React, { useState, useEffect } from 'react'
import { Basement, Container } from '../../../components/BasicHTMLElement'
import { RentDetailModel } from '../../../utils/DataModel'
import { Avatar, Button, Card, Divider, Input, message, Tabs, Select, Skeleton, Tag, Typography } from 'antd'
import { useApi } from '../../../utils/api'
import { defaultMarker, highlightMarker } from '../../../utils/marker'
import { poi } from '../../../utils/poi'
declare let TMap: any;
const { Text, Title, Paragraph } = Typography;
let mapIns: any = {};
let markerLayer: any = {};

type ReturnType = {
  address: string;
  category: string;
  title: string;
  location: {
    lat: number;
    lng: number;
  };
  type: string;
  ad_info: {
    adcode: number;
    district: string;
    city: string;
    province: string;
  };
  tel: string;
  _distance: string;
  id: string;
}

const HouseAround = (props: { data: RentDetailModel }) => {
  const { data } = props;
  const ref = React.useRef<HTMLDivElement>(null)
  const api = useApi();
  const [category, setCategory] = useState('美食');
  const [pointList, _setPointList] = useState<Array<ReturnType>>([])
  const [ctr, _setCtr] = useState([0, 0]);
  const [currentSelected, setCurrentSelected] = useState('');
  const plRef = React.useRef(pointList)
  const ctrRef = React.useRef(ctr)

  const setPointList = (data: Array<ReturnType>) => {
    plRef.current = data;
    _setPointList(data);
  }

  const setCtr = (data: number[]) => {
    ctrRef.current = data;
    _setCtr(data);
  }

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

  const onClickHandler = function (evt: any) {
    console.log(evt, plRef.current)
    const point = plRef.current.find((item: any) => item.id === evt.geometry.id)!
    setCurrentSelected(evt.geometry.title)
    const infowindow = new TMap.InfoWindow({
      content: evt.geometry.title === data.title ? `<span>${evt.geometry.title}</span>`
        : `<span>${evt.geometry.title + ' - '}</span><span style="color: blue">${evt.geometry.distance}m</span>`, //信息窗口内容
      position: new TMap.LatLng(evt.latLng.lat, evt.latLng.lng), //显示信息窗口的坐标
      map: mapIns,
      offset: { x: 0, y: -10 }
    });
    const pos = evt.geometry.title === data.title ? new TMap.LatLng(ctrRef.current[0], ctrRef.current[1]) : new TMap.LatLng(point.location.lat, point.location.lng)
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
  };

  const createElements = async () => {
    const res = await showPosition(data.city + data.title.split('·')[1].split(/\s+/)[0])
    if (!res) return;
    setPointList(res.points);
    setCtr([res.center.lat, res.center.lng]);
    mapIns = new TMap.Map('house-around', {
      center: new TMap.LatLng(res.center.lat, res.center.lng),
      zoom: 16.2,
      pitch: 0,
      rotation: 45,
    })
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
    markerLayer.on('click', onClickHandler)
  }

  const updateElements = async () => {
    const res = await showPosition(data.city + data.title.split('·')[1].split(/\s+/)[0])
    if (!res) return;
    setPointList(res.points);
    if (Object.keys(markerLayer).length === 0) return;
    console.log(markerLayer)
    markerLayer.setGeometries([{
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
    }))])
  }

  const transformer = (item: any) => { 
    return () => {
      setCurrentSelected(item.title); 
      if (Object.keys(mapIns).length === 0) return 0;
      mapIns.setCenter(new TMap.LatLng(item.location.lat, item.location.lng));
    }
  }

  useEffect(() => {
    const container = ref.current;
    if (container) {
      createElements();
    }
  }, [])

  useEffect(() => {
    const container = ref.current;
    if (container && markerLayer !== {}) {
      updateElements();
    }
  }, [category])

  useEffect(() => {
    console.log([pointList])
  }, [pointList])


  return <div style={{ width: '100%', marginLeft: '40px', marginRight: '40px', marginTop: '40px' }} id="around">
    <Text style={{ fontSize: '1.5rem' }} strong>位置周边</Text>
    <div style={{ position: 'relative', width: '100%', height: '70vh', marginTop: 30 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} ref={ref} id="house-around"></div>
      <div style={{ 
        position: 'absolute', top: 20, left: 20, padding: 4, background: '#fff', zIndex: 2000, opacity: 0.85,
      }}>
        <div style={{ display: 'flex', width: '100%', paddingLeft: 25, paddingRight: 25 }}>
          {poi.map((item) => <div
            key={item}
            style={{ display: 'flex', flexDirection: 'column', paddingTop: '0.25rem', paddingBottom: '0.25rem', marginLeft: 10, marginRight: 10 }}
            className="m-1" onClick={() => { setCategory(item) }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item}</label>
            <div style={{ height: 3, width: 'auto', background: '#00896c', borderRadius: 1, marginTop: 5 }} hidden={item !== category}></div>
          </div>)}
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', maxHeight: '50vh', overflow: 'scroll' }}>
          {pointList === [] ? null : pointList.map((item) => <div style={{ width: '90%' }} className="p-1" key={item.id} onClick={transformer(item)}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', paddingLeft: 25, paddingRight: 25 }}>
              <div style={{ width: '100%', display: 'flex', marginTop: 5, marginBottom: 5 }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: item.title === currentSelected ? 'blue' : 'black' }}>{item.title}</span>
                <div style={{ width: '30px'}}></div>
                <span style={{ fontSize: '0.9rem', color: 'blue' }}>{item._distance}m</span>
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '0.7rem', marginTop: 5, marginBottom: 5 }}>{item.address}</div>
            </div>
            <div style={{ width: '100%', height: 1, background: '#E5E7EB', marginLeft: 25, marginRight: 25, marginTop: 10, marginBottom: 10 }}/>
          </div>)}
        </div>
      </div>
    </div>
  </div>
}

export default HouseAround;