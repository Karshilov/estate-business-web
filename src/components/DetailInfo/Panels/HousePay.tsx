import React, { useState, useEffect } from 'react'
import { Basement, Container } from '../../../components/BasicHTMLElement'
import { RentDetailModel } from '../../../utils/DataModel'
import { Avatar, Button, Card, Divider, Input, message, Tabs, Select, Skeleton, Tag, Typography } from 'antd'
import { useApi } from '../../../utils/api'
import moment from 'moment'
const { Text, Title, Paragraph } = Typography;


const HousePay = (props: { data: RentDetailModel }) => {
  const { data } = props;

  return <div style={{ width: '100%', marginLeft: '40px', marginRight: '40px' }} id="house-pay">
    <Text style={{ fontSize: '1.5rem' }} strong>费用详情</Text>
    <div style={{ width: '100%', display: 'flex', marginTop: 20 }}>
      <Text strong style={{ fontSize: '1rem' }}>年租价 当租期不足1年时租金可能会上浮，详询管家</Text>
    </div>
    <div style={{ width: '100%', display: 'flex', marginTop: 20 }}>
      <div style={{ width: '15%', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
        <Text style={{ fontSize: '1rem' }}>付款方式</Text>
        <div style={{ marginTop: 20 }}>
          <Text>{data.rent_type}</Text>
        </div>
      </div>
      <div style={{ width: '15%', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
        <Text style={{ fontSize: '1rem' }}>租金 (元/月)</Text>
        <div style={{ marginTop: 20 }}>
          <Text style={{ color: 'red' }}>{data.price}</Text>
        </div>
      </div>
      <div style={{ width: '15%', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
        <Text style={{ fontSize: '1rem' }}>押金 (元)</Text>
        <div style={{ marginTop: 20 }}>
          <Text style={{ color: 'red' }}>{data.price}</Text>
        </div>
      </div>
      <div style={{ width: '15%', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
        <Text style={{ fontSize: '1rem' }}>服务费 (元)</Text>
        <div style={{ marginTop: 20 }}>
          <Text>0</Text>
        </div>
      </div>
      <div style={{ width: '15%', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
        <Text style={{ fontSize: '1rem' }}>中介费 (元)</Text>
        <div style={{ marginTop: 20 }}>
          <Text>需咨询</Text>
        </div>
      </div>
    </div>
  </div>
}

export default HousePay;