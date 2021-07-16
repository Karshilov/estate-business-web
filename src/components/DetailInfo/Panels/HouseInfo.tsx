import React, { useState, useEffect } from 'react'
import { Basement, Container } from '../../../components/BasicHTMLElement'
import { RentDetailModel } from '../../../utils/DataModel'
import { Avatar, Button, Card, Divider, Input, message, Tabs, Select, Skeleton, Tag, Typography } from 'antd'
import { useApi } from '../../../utils/api'
import ContentContainer from '../../../components/DetailInfo/ContentContainer'
import { detailOptions } from '../../../utils/DetailOptions'
import WashIcon from '../../../assets/equipments/wash.svg'
import AirCondIcon from '../../../assets/equipments/aircond.svg'
import BedIcon from '../../../assets/equipments/bed.svg'
import GasIcon from '../../../assets/equipments/gas.svg'
import RefrigeratorIcon from '../../../assets/equipments/refrigerator.svg'
import TVIcon from '../../../assets/equipments/tv.svg'
import WardrobeIcon from '../../../assets/equipments/wardrobe.svg'
import WarmIcon from '../../../assets/equipments/warm.svg'
import WaterHeaterIcon from '../../../assets/equipments/wheater.svg'
import WifiIcon from '../../../assets/equipments/wifi.svg'
import moment from 'moment'
const { Text, Title, Paragraph } = Typography;


const HouseInfo = (props: { data: RentDetailModel }) => {
  const { data } = props;
  const feature = ['洗衣机', '空调', '衣柜', '电视', '冰箱',
    '热水器', '床', '暖气', '宽带', '天然气'];
  const equipmentArr = [WashIcon, AirCondIcon, WardrobeIcon, TVIcon, RefrigeratorIcon,
    WaterHeaterIcon, BedIcon, WarmIcon, WifiIcon, GasIcon];

  return <div style={{ width: '100%', marginInline: '40px' }}>
    <Text style={{ fontSize: '1.5rem' }} strong>房屋信息</Text>
    <div style={{ width: '100%', display: 'flex', marginTop: 40 }}>
      <div style={{ width: '20%', fontSize: '1.1rem', color: '#9CA3AF' }}>基本信息</div>
      <div style={{ width: '80%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: '100%', display: 'flex' }}>
          <div style={{ width: '33%' }}>
            <div style={{ fontSize: '1rem' }} className="m-4">面积：{data.area}㎡</div>
            <div style={{ fontSize: '1rem' }} className="m-4">楼层：{(data.floor > data.total_floor / 3 * 2 ? '高楼层' : data.floor < data.total_floor / 3 ? '低楼层' : '中楼层') +
              ' / ' + data.total_floor + '楼'}</div>
            <div style={{ fontSize: '1rem' }} className="m-4">用水：民水</div>
            <div style={{ fontSize: '1rem' }} className="m-4">采暖：{(data.city === '北京' || data.city === '大连' || data.city === '青岛' || data.city === '济南') ? '集中供暖' : '暂无数据'}
            </div>
          </div>
          <div style={{ width: '33%' }}>
            <div style={{ fontSize: '1rem' }} className="m-4">维护：{moment(data.last_modify).format('YYYY - MM - DD')}</div>
            <div style={{ fontSize: '1rem' }} className="m-4">电梯：{data.total_floor >= 7 ? '有电梯' : '无电梯'}</div>
            <div style={{ fontSize: '1rem' }} className="m-4">用电：民电</div>
            <div style={{ fontSize: '1rem' }} className="m-4">租期：暂无数据</div>
          </div>
          <div style={{ width: '33%' }}>
            <div style={{ fontSize: '1rem' }} className="m-4">入住：随时入住</div>
            <div style={{ fontSize: '1rem' }} className="m-4">车位：有</div>
            <div style={{ fontSize: '1rem' }} className="m-4">燃气：有</div>
            <div style={{ fontSize: '1rem' }} className="m-4">看房：需提前预约</div>
          </div>
        </div>
        <Divider />
      </div>
    </div>
    <div style={{ width: '100%', display: 'flex', marginTop: 40, flexDirection: 'column' }}>
      <div style={{ width: '100%', display: 'flex' }}>
        <div style={{ width: '20%', fontSize: '1.1rem', color: '#9CA3AF' }}>配套设施</div>
        <div style={{ width: '80%', display: 'flex', flexWrap: 'wrap' }}>
          {feature.map((item, index) => {
            return <div
              key={item}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: 10,
                marginInline: 20,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: (data.equipments & (1 << (9 - index))) ? 1 : 0.4
              }}>
              <img src={equipmentArr[index]} alt="" style={{ width: 30 }} />
              <div style={{ margin: 10 }}>{item}</div>
            </div>
          })}
        </div>
      </div>
      <Divider />
    </div>
  </div>
}

export default HouseInfo;
/*
面积：110.00㎡朝向：南 北 维护：今天入住：随时入住 楼层：中楼层/11层电梯：有 车位：暂无数据用水：民水 用电：民电燃气：有 采暖：暂无数据
租期：暂无数据
咨询租期
 看房：需提前预约*/