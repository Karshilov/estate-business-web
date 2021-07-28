import React, { useState, useEffect } from 'react'
import { Basement, Container } from '../../../components/BasicHTMLElement'
import { RentDetailModel } from '../../../utils/DataModel'
import { Avatar, Button, Card, Divider, Input, message, Tabs, Select, Skeleton, Tag, Typography } from 'antd'
import { useApi } from '../../../utils/api'
import ContentContainer from '../../../components/DetailInfo/ContentContainer'
import { detailOptions } from '../../../utils/DetailOptions'
import moment from 'moment'
const { Text, Title, Paragraph } = Typography;


const HouseDesc = (props: { data: RentDetailModel }) => {
  const { data } = props;

  return <div style={{ width: '100%', marginLeft: '40px', marginRight: '40px' }} id="house-desc">
    <Text style={{ fontSize: '1.5rem' }} strong>房屋介绍</Text>
    <div style={{ width: '100%', display: 'flex' }}>
      <Card.Meta
        avatar={<Avatar src="https://git.karshilov.com/avatars/cf963f3dc28db7361bdd68426e4ca5b4?size=580" size={50} />}
        title={data.owner.username}
        description="找不到工作的人"
        style={{ marginTop: 40 }}
      />
      <div style={{ flexGrow: 1 }}></div>
      <Button type="primary" style={{ marginRight: 20, marginTop: 50 }}>邮件联系</Button>
    </div>
    <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
      {data.photos.map((url) => <img key={url} src={url} alt="" style={{ width: '26%', margin: '3%' }} />)}
    </div>
  </div>
}

export default HouseDesc;