/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, CSSProperties } from 'react'
import { SearchItemModel } from '../../utils/DataModel'
import { Divider, Tag } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons'
import moment from 'moment';

const Item = (props: { data: SearchItemModel, style?: CSSProperties }) => {
  useEffect(() => {
    console.log('created')
  }, [])

  return (
    <div className="item" id={props.data.id} style={{ width: '100%', display: 'flex', marginTop: '20px', marginBottom: '20px' }}>
      <div className="item-content" style={{ height: '162px', width: '200px' }}>
        <img src={props.data.cover} alt="" style={{ width: '100%', height: '100%' }} />
      </div>
      <div style={{ marginLeft: '28px', flexGrow: 0, width:'100%' }}>
        <p className="item-title" style={{ marginBottom: '8px', fontWeight: 'bold', display:'flex', justifyContent:'space-between'}}>
          <span style={{fontSize:'26px'}}>{props.data.title}</span>
          <a style={{color: 'red'}}>
            <span style={{fontSize:'28px'}}>{props.data.price}</span>
            <span style={{fontSize:'14px'}}>元/月</span>
          </a>  
        </p>

        <p className="item-info" style={{ marginBottom: '8px', fontSize: '1.2rem' }}>
          <a style={{ color: '#A9A9A9' }}>{props.data.title.split('·')[1].split(/\s+/)[0]}</a>
          <i style={{ marginLeft: '8px', marginRight: '8px' }}>/</i>
          <a style={{ color: '#A9A9A9' }}>{props.data.area}㎡</a>
          <i style={{ marginLeft: '8px', marginRight: '8px' }}>/</i>
          <a style={{ color: '#A9A9A9' }}>{String(props.data.floor) + "楼"}</a>
          <i style={{ marginLeft: '8px', marginRight: '8px' }}>/</i>
          <a style={{ color: '#A9A9A9' }}>{String(props.data.area) + "层"}</a>
        </p>

        <Tag color='#f2f5f7' style={{ height: '25px', borderRadius: '3px', fontSize: '16px', color: '#8aa3b8' }}>Tag 1</Tag>
        <Tag color='#f2f5f7' style={{ height: '25px', borderRadius: '3px', fontSize: '16px', color: '#8aa3b8' }}>Tag 2</Tag>
        <Tag color='#f2f5f7' style={{ height: '25px', borderRadius: '3px', fontSize: '16px', color: '#8aa3b8' }}>Tag 3</Tag>

        <Divider style={{ marginBottom: 0, marginTop: '24px' }}></Divider>
        <p className="item-root" style={{ display: 'flex', justifyContent: 'space-start', color: '#c7c7c7' }}>
          <ClockCircleOutlined style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }} />
          <span style={{ fontSize: '15px' }}>
            {"创建时间：" + moment(props.data.create_time * 1000).format('YYYY / MM / DD')}
          </span>
        </p>
      </div>
    </div >

  );

}

export default Item;