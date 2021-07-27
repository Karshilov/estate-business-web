import React, { useState, useEffect } from 'react'
import { Basement, Container } from '../../components/BasicHTMLElement'
import { RentDetailModel } from '../../utils/DataModel'
import { message, Button, Card, Divider, DatePicker, Tag, Typography, Modal } from 'antd'
import { useApi } from '../../utils/api'
import DetailTabs from '../../components/DetailInfo/DetailTabs'
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons'
import moment from 'moment'
import RichAvatar from '../RichAvatar'

const { Text, Title, Paragraph } = Typography;


const ContentContainer = (props: { data: RentDetailModel }) => {
  const [active, setActive] = useState(0)
  const [appointmentTime, setAppointmentTime] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data } = props;
  const api = useApi();

  const gotoNext = () => {
    console.log(active, data.photos.length)
    if (active < data.photos.length - 1) setActive(active + 1)
  }

  const gotoPre = () => {
    if (active > 0) setActive(active - 1)
  }

  const handleOk = async () => {
    const res = await api.post('/rent/appointment', { house_id: props.data.id, appointment_time: Math.floor(appointmentTime / 1000) })
    if (res.data.success) {
      message.success('预约成功')
    } else {
      message.error(res.data.reason)
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    console.log(data,)
  }, [])

  return <Container style={{ width: '75%', background: '#fff', marginTop: 40 }} bodyStyle={{ display: 'flex', flexDirection: 'row' }} hoverable={false}>
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', marginTop: 20 }} className="m-8">
      <Title level={2} >{data.title}</Title>
      <Text style={{ marginBottom: 30, marginTop: -10, fontFamily: 'Quicksand', color: '#9CA3AF' }} >房源维护时间：{moment(data.last_modify).format('YYYY / MM / DD')}</Text>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '55%', display: 'flex', flexDirection: 'column' }}>
          <img src={data.photos[active]} alt="" style={{ width: '100%', objectFit: 'cover' }}></img>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', marginTop: 15 }}>
            <div style={{ background: '#00896c', display: 'flex', alignItems: 'center' }}>
              <CaretLeftOutlined disabled={active <= 0} onClick={gotoPre} style={{ color: '#fff' }} />
            </div>
            {data.photos.map((url, index) => {
              return <img src={url}
                key={url}
                style={{
                  height: '100%',
                  width: '16%',
                  objectFit: 'cover',
                  outline: index === active ? '3px solid #00896c' : 'none',
                  marginInline: 'auto'
                }}
                hidden={index > active + 4 || index < active - Math.max((active + 5 - data.photos.length), 0)}
                alt=""
                onClick={() => { setActive(index) }}></img>
            })}
            <div style={{ background: '#00896c', display: 'flex', alignItems: 'center' }}>
              <CaretRightOutlined disabled={active >= data.photos.length - 1} onClick={gotoNext} style={{ color: '#fff' }} />
            </div>
          </div>
        </div>
        <div style={{ width: '40%', marginLeft: '20px' }}>
          <Card style={{ width: '100%' }} bodyStyle={{ display: 'flex', flexDirection: 'column', paddingTop: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={{ color: 'red', fontSize: '2rem' }}>{data.price}</Text>
              <Text style={{ color: 'red' }}>元/月</Text>
              <div style={{ flexGrow: 1 }}></div>
              <Text style={{ color: 'red' }}>{data.rent_type}</Text>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
              {data.features.map((item) => <Tag key={item} color='#f2f5f7' style={{ height: '25px', borderRadius: '3px', fontSize: '16px', color: '#8aa3b8' }}>{item}</Tag>)}
            </div>
            <Divider />
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
              <div style={{ width: '70%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={{ color: 'grey' }}>租赁方式：</Text>
                  <Text >{data.title.split('·')[0]}</Text>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={{ color: 'grey' }}>房屋类型：</Text>
                  <Text >{data.house_type + " " + data.area + "㎡ " + data.decoration}</Text>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={{ color: 'grey' }}>房屋楼层：</Text>
                  <Text >
                    {(data.floor > data.total_floor / 3 * 2 ? '高楼层' : data.floor < data.total_floor / 3 ? '低楼层' : '中楼层') +
                      ' / ' + data.total_floor + '楼'}</Text>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={{ color: 'grey' }}>风险提示：</Text>
                  <a href="https://m.ke.com/text/disclaimer">用户风险提示</a>
                </div>
                <Divider />
                <Card>
                  <Card.Meta
                    avatar={<RichAvatar src={data.owner.avatar} id={data.owner.userid} size={50} />}
                    title={data.owner.username}
                    description={(data.owner.team !== undefined && data.owner.team !== null) ? data.owner.team.name : '暂无团队'}
                  />
                  <div style={{ marginTop: 20 }}>
                    <Button type="primary" style={{ marginRight: 20 }}>邮件联系</Button>
                    <Button onClick={() => { setIsModalVisible(true) }}>预约看房</Button>
                    <Modal title="预约看房" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText="确定" cancelText="取消">
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 550, marginBottom: 25 }}>
                          请选择预约看房的时间
                        </div>
                        <DatePicker
                          format="YYYY-MM-DD HH:mm:ss"
                          showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                          onChange={(value) => {
                            setAppointmentTime(+(value!))
                          }}
                        />
                      </div>
                    </Modal>
                  </div>
                </Card>
              </div>
              <div style={{ width: '30%', display: 'flex', flexDirection: 'column', padding: 10 }}>
                <div style={{ width: 80, height: 80, background: '#00896c', color: '#fff', padding: 10 }}>这里也许有个二维码</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <DetailTabs data={data} />
    </div>
  </Container>;
}

export default ContentContainer;