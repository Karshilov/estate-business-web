/* eslint-disable jsx-a11y/anchor-is-valid */
import { message, Typography, Row, Col } from "antd";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const { Text } = Typography;

interface RecommendDetailModel {
  id: string;
  title: string;
  photos: string[];
  area: number;
  create_time: number;
  floor: number;
  total: number;
  price: number;
  features: string[];
}

const RecommendItem = (props: { data: RecommendDetailModel }) => {
  const { data } = props;
  const history = useHistory();

  return <div style={{ width: '100%', flexDirection: 'column', display: 'flex', padding: 10 }} onClick={() => { history.push(`/rent/detail/${data.id}`) }}>
    <img src={data.photos[0]} alt="" style={{ width: '100%' }} />
    <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
      <Text style={{ fontSize: '1rem', fontWeight: 'bold', width: '60%' }} ellipsis>{data.title}</Text>
      <div style={{ flexGrow: 1 }}></div>
      <Text style={{ color: 'red' }}>{data.price}</Text>
      <Text style={{ color: 'red' }}>元/月</Text>
    </div>
    <p className="item-info" style={{ marginBottom: '8px' }}>
      <a style={{ color: '#A9A9A9', cursor: 'default' }}>{data.title.split('·')[1].split(/\s+/)[0]}</a>
      <i style={{ marginLeft: '8px', marginRight: '8px' }}>/</i>
      <a style={{ color: '#A9A9A9', cursor: 'default' }}>{data.area}㎡</a>
      <i style={{ marginLeft: '8px', marginRight: '8px' }}>/</i>
      <a style={{ color: '#A9A9A9', cursor: 'default' }}>{String(data.floor) + "楼"}</a>
      <i style={{ marginLeft: '8px', marginRight: '8px' }}>/</i>
      <a style={{ color: '#A9A9A9', cursor: 'default' }}>{String(data.area) + "层"}</a>
    </p>
  </div>
}

export default RecommendItem;