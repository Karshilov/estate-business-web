import React, { useState, useEffect } from 'react'
import { Basement, Container } from '../../components/BasicHTMLElement'
import { RentDetailModel } from '../../utils/DataModel'
import { Avatar, Button, Card, Divider, Input, message, Pagination, Select, Skeleton, Tag, Typography } from 'antd'
import { useApi } from '../../utils/api'
import ContentContainer from '../../components/DetailInfo/ContentContainer'
const { Text, Title, Paragraph } = Typography;

const RentDetail = (props: { match: any }) => {
  const [info, setInfo] = useState<RentDetailModel[]>([])
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

  useEffect(() => {
    if (id) {
      getInfo()
    }
  }, [id])

  return <Basement style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {info[0] ? <ContentContainer data={info[0]} /> :
      <Container style={{ width: '75%', background: '#fff', marginTop: 40 }} bodyStyle={{ display: 'flex', flexDirection: 'row' }} hoverable={false}>
        <div style={{ width: '55%', display: 'flex', flexDirection: 'column' }} className="m-8 p-3">
          <Skeleton.Avatar size={300} shape="square" />
        </div>
        <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }} className="m-8 p-3">
          <Skeleton active />
        </div>
      </Container>}
  </Basement>
}

export default RentDetail;