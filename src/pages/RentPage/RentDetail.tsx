import React, { useState, useEffect } from 'react'
import { Basement, Container } from '../../components/BasicHTMLElement'
import { RentDetailModel } from '../../utils/DataModel'
import { Avatar, Button, Card, Divider, Input, message, Pagination, Select, Skeleton, Tag, Typography } from 'antd'
import { useApi } from '../../utils/api'
import { city } from '../../utils/city'
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons'
import moment from 'moment'

const { Text, Title, Paragraph } = Typography;


const RentDetail = (props: { match: any }) => {
  const [info, setInfo] = useState<RentDetailModel[]>([])
  const [citySelect, setCitySelect] = useState('南京');
  const [active, setActive] = useState(0)
  const api = useApi();
  const id = props.match.params.id;

  const getInfo = async () => {
    const res = await api.get('/rent/detail', { params: { id } })
    if (res.data.success) {
      setInfo([res.data.result])
    } else {
      message.error(res.data.reason)
    }
  }

  const gotoNext = () => {
    if (active < info[0].photos.length - 1) setActive(active + 1)
  }
  const gotoPre = () => {
    if (active > 0) setActive(active - 1)
  }

  useEffect(() => {
    if (id) {
      getInfo()
    }
  }, [id])

  const ContentContainer = () => {
    return <Container style={{ width: '75%', background: '#fff' }} bodyStyle={{ display: 'flex', flexDirection: 'row' }} hoverable={false}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', marginTop: 20 }} className="m-8">
        <Title level={2} >{info[0].title}</Title>
        <Text style={{ marginBottom: 30, marginTop: -10, fontFamily: 'Quicksand', color: '#9CA3AF' }} >房源维护时间：{moment(info[0].last_modify).format('YYYY / MM / DD')}</Text>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
          <div style={{ width: '55%', display: 'flex', flexDirection: 'column' }}>
            <img src={info[0].photos[active]} alt="" style={{ width: '100%', objectFit: 'cover', height: '28vh' }}></img>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', marginTop: 15 }}>
              <div style={{ background: '#00896c', display: 'flex', alignItems: 'center' }}>
                <CaretLeftOutlined disabled={active <= 0} onClick={gotoPre} style={{ color: '#fff' }} />
              </div>
              {info[0].photos.map((url, index) => {
                return <img src={url}
                  style={{
                    height: '100%',
                    width: '20%',
                    objectFit: 'cover',
                    outline: index === active ? '3px solid #00896c' : 'none',
                    marginInline: 10
                  }}
                  hidden={index > active + 5 || index < active - (active + 5 - info[0].photos.length)}
                  alt=""
                  onClick={() => { setActive(index) }}></img>
              })}
              <div style={{ background: '#00896c', display: 'flex', alignItems: 'center' }}>
                <CaretRightOutlined disabled={active >= info[0].photos.length - 1} onClick={gotoNext} style={{ color: '#fff' }} />
              </div>
            </div>
          </div>
          <div style={{ width: '40%', marginLeft: '20px' }}>
            <Card style={{ width: '100%' }} bodyStyle={{ display: 'flex', flexDirection: 'column', paddingTop: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={{ color: 'red', fontSize: '2rem' }}>{info[0].price}</Text>
                <Text style={{ color: 'red' }}>元/月</Text>
                <div style={{ flexGrow: 1 }}></div>
                <Text style={{ color: 'red' }}>{info[0].rent_type}</Text>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                {info[0].features.map((item) => <Tag color='#f2f5f7' style={{ height: '25px', borderRadius: '3px', fontSize: '16px', color: '#8aa3b8' }}>{item}</Tag>)}
              </div>
              <Divider />
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '70%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text style={{ color: 'grey' }}>租赁方式：</Text>
                    <Text >{info[0].title.split('·')[0]}</Text>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text style={{ color: 'grey' }}>房屋类型：</Text>
                    <Text >{info[0].house_type + " " + info[0].area + "㎡ " + info[0].decoration}</Text>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text style={{ color: 'grey' }}>房屋楼层：</Text>
                    <Text >
                      {(info[0].floor > info[0].total_floor / 3 * 2 ? '高楼层' : info[0].floor < info[0].total_floor / 3 ? '低楼层' : '中楼层') +
                        ' / ' + info[0].total_floor + '楼'}</Text>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text style={{ color: 'grey' }}>风险提示：</Text>
                    <a href="https://m.ke.com/text/disclaimer">用户风险提示</a>
                  </div>
                  <Divider />
                  <Card>
                    <Card.Meta
                      avatar={<Avatar src="https://git.karshilov.com/avatars/cf963f3dc28db7361bdd68426e4ca5b4?size=580" size={50} />}
                      title={info[0].owner.username}
                      description="找不到工作的人"
                    />
                    <div style={{ marginTop: 20 }}>
                      <Button type="primary" style={{ marginRight: 20 }}>电话联系</Button>
                      <Button>在线咨询</Button>
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
      </div>
    </Container>;
  }


  return <Basement style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ width: '75%', background: '#fff', marginBottom: 40, marginTop: 20 }} className="shadow-sm">
      <Input.Group compact style={{ marginTop: 40, marginBottom: 20, marginLeft: 40, height: 40 }}>
        <Select defaultValue="南京" value={citySelect} onChange={(value, option) => { setCitySelect(value) }}>
          {city.map(item => <Select.Option value={item}>{item}</Select.Option>)}
        </Select>
        <Input style={{ width: '50%' }} placeholder="请输入小区名称进行搜索" />
      </Input.Group>
    </div>
    {info[0] ? <ContentContainer /> :
      <Container style={{ width: '65%', background: '#fff' }} bodyStyle={{ display: 'flex', flexDirection: 'row' }} hoverable={false}>
        <div style={{ width: '55%', display: 'flex', flexDirection: 'column' }} className="m-8 p-3">
          <Skeleton.Avatar size={300} shape="square" />
        </div>
        <div style={{ width: '40%', display: 'flex', flexDirection: 'column' }} className="m-8 p-3">
          <Skeleton active />
        </div>
      </Container>}
  </Basement>
}

export default RentDetail;