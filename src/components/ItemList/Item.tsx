/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, CSSProperties } from 'react'
import { SearchItemModel } from '../../utils/DataModel'
import { Divider, Tag, Skeleton, Tooltip, message } from 'antd';
import { ClockCircleOutlined, AuditOutlined, CheckOutlined, WarningOutlined, StarOutlined, VideoCameraOutlined} from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import moment from 'moment';
import { useApi } from '../../utils/api';

const Item = (props: { data: SearchItemModel, style?: CSSProperties, type?: string, other?: boolean }) => {
  const history = useHistory();
  const api = useApi();

  const onSubmitGenerator = (value: string) => {
    return async (e: any) => {
      e.stopPropagation();
      const res = await api.post('/rent/realsee', { house_id: value })
      if (res.data.success) {
        message.success('申请成功')
      } else {
        message.error(res.data.reason)
      }
    }
  }

  return (
    <div
      className="item"
      id={props.data.id}
      style={{ width: '100%', display: 'flex', marginTop: '20px', marginBottom: '20px' }}
      onClick={() => { history.push(`/rent/detail/${props.data.id}`) }}>
      <div className="item-content" style={{ height: '162px', width: '200px' }}>
        <img src={props.data.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ marginLeft: '28px', flexGrow: 0, width: '100%' }}>
        <p className="item-title" style={{ marginBottom: '8px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '26px' }}>{props.data.title}</span>
          <a style={{ color: 'red', cursor: 'default' }} >
            <span style={{ fontSize: '28px' }} hidden={props.type !== undefined}>{props.data.price}</span>
            <span style={{ fontSize: '14px' }} hidden={props.type !== undefined}>元/月</span>
            <span style={{ fontSize: '24px', color: '#35bc33', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              hidden={props.data.status !== 'approve' || props.type !== 'source' || props.other}>
              审核通过<CheckOutlined />
            </span>
            <span style={{ fontSize: '24px', color: 'grey', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              hidden={props.data.status !== 'audit' || props.type !== 'source'}>
              审核中<AuditOutlined />
            </span>
            <Tooltip title={props.data.reason}>
              <span style={{ fontSize: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                hidden={props.data.status !== 'reject' || props.type !== 'source'}>
                未通过审核<WarningOutlined />
              </span>
            </Tooltip>
            <span style={{ fontSize: '24px', color: 'rgb(241 78 78)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              hidden={props.type !== 'rate' || props.data.rate_score === undefined}>
              评分：{props.data.rate_score}<StarOutlined />
            </span>
          </a>
          <a style={{ color: 'red', cursor: 'default', display: 'flex', alignItems: 'center' }} hidden={props.type !== 'appointment' || props.data.appointment_time === undefined}>
            <span style={{ fontSize: '20px', color: 'rgb(241 78 78)' }} >
              {"预约时间：" + moment(props.data.appointment_time * 1000).format('YYYY / MM / DD')}
            </span>
          </a>
        </p>

        <p className="item-info" style={{ marginBottom: '8px', fontSize: '1.2rem' }}>
          <a style={{ color: '#A9A9A9', cursor: 'default' }}>{props.data.title.split('·')[1].split(/\s+/)[0]}</a>
          <i style={{ marginLeft: '8px', marginRight: '8px' }}>/</i>
          <a style={{ color: '#A9A9A9', cursor: 'default' }}>{props.data.area}㎡</a>
          <i style={{ marginLeft: '8px', marginRight: '8px' }}>/</i>
          <a style={{ color: '#A9A9A9', cursor: 'default' }}>{String(props.data.floor) + "楼"}</a>
          <i style={{ marginLeft: '8px', marginRight: '8px' }}>/</i>
          <a style={{ color: '#A9A9A9', cursor: 'default' }}>{String(props.data.area) + "层"}</a>
        </p>

        {props.data.features.map((item) => <Tag key={item} color='#f2f5f7' style={{ height: '25px', borderRadius: '3px', fontSize: '16px', color: '#8aa3b8' }}>{item}</Tag>)}

        <Divider style={{ marginBottom: 0, marginTop: '24px' }}></Divider>
        <p className="item-root" style={{ display: 'flex', justifyContent: 'space-start', color: '#c7c7c7' }}>
          <ClockCircleOutlined style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }} />
          <span style={{ fontSize: '15px' }}>
            {"创建时间：" + moment(props.data.create_time * 1000).format('YYYY / MM / DD')}
          </span>
          <div style={{ flexGrow: 1}}></div>
          <div style={{ fontSize: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: '#333', fontWeight: 550 }} 
            hidden={props.data.realsee !== null}
            onClick={onSubmitGenerator(props.data.id)}
            >申请VR扫描<VideoCameraOutlined /></div>
        </p>
      </div>
    </div>
  );
}

export default Item;