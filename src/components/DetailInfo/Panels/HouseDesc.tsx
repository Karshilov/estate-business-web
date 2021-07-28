import React, { useState, useEffect } from 'react'
import { Basement, Container } from '../../../components/BasicHTMLElement'
import { RentDetailModel } from '../../../utils/DataModel'
import { Avatar, Button, Card, Divider, Input, message, Tabs, Select, Skeleton, Tag, Typography } from 'antd'
import { useApi } from '../../../utils/api'
import ContentContainer from '../../../components/DetailInfo/ContentContainer'
import { detailOptions } from '../../../utils/DetailOptions'
import moment from 'moment'
import RichAvatar from '../../RichAvatar'
const { Text, Title, Paragraph } = Typography;


const HouseDesc = (props: { data: RentDetailModel }) => {
  const { data } = props;

  return <div style={{ width: '100%', marginLeft: '40px', marginRight: '40px' }} id="house-desc">
    <Text style={{ fontSize: '1.5rem' }} strong>房屋介绍</Text>
    <div style={{ width: '100%', display: 'flex' }}>
      <Card.Meta
        avatar={<RichAvatar src={data.owner.avatar} id={data.owner.userid} size={50} />}
        title={data.owner.username}
        description={(data.owner.team !== undefined && data.owner.team !== null) ? data.owner.team.name : '暂无团队'}
      />
      <div style={{ flexGrow: 1 }}></div>
      <Button type="primary" style={{ marginRight: 20, marginTop: 30 }}>邮件联系</Button>
    </div>
    <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
      {data.photos.map((url) => <img key={url} src={url} alt="" style={{ width: '26%', height: '20vh', objectFit: 'contain', margin: '3%' }} />)}
    </div>
  </div>
}

export default HouseDesc;