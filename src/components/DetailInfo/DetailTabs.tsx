import React, { useState, useEffect } from 'react'
import { Basement, Container } from '../../components/BasicHTMLElement'
import { RentDetailModel } from '../../utils/DataModel'
import { Avatar, Button, Card, Divider, Input, message, Tabs, Select, Skeleton, Tag, Typography } from 'antd'
import { useApi } from '../../utils/api'
import ContentContainer from '../../components/DetailInfo/ContentContainer'
import { detailOptions } from '../../utils/DetailOptions'
import HouseInfo from './Panels/HouseInfo'
const { Text, Title, Paragraph } = Typography;

const DetailTabs = (props: { data: RentDetailModel }) => {
  const { data } = props;
  const [currentKey, setCurrentKey] = useState('house-info')

  return <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
    <div style={{ background: '#F3F4F6', display: 'flex', flexDirection: 'row', width: '100%', marginInline: '40px' }}>
      {detailOptions.map((item) => <div
        style={{ display: 'flex', flexDirection: 'column' }}
        className="p-1 m-3" onClick={() => { setCurrentKey(item.key) }}>
        <label style={{ fontSize: '1.1rem', fontWeight: 600 }}>{item.label}</label>
        <div style={{ height: 3, width: '100%', background: '#00896c', borderRadius: 1, marginTop: 10 }} hidden={item.key !== currentKey}></div>
      </div>)}
    </div>
    <Divider />
    <HouseInfo data={data} />
  </div>
}

export default DetailTabs;