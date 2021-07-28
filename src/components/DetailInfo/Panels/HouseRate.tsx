import React, { useState, useEffect } from 'react'
import { Basement, Container } from '../../../components/BasicHTMLElement'
import { RentDetailModel } from '../../../utils/DataModel'
import { Avatar, Button, Card, Divider, Input, message, Tabs, Select, Skeleton, Tag, Typography, Rate, Row } from 'antd'
import { useApi } from '../../../utils/api'
import moment from 'moment'
const { Text, Title, Paragraph } = Typography;


const HousePay = (props: { data: RentDetailModel }) => {
    const { data } = props;
    const api = useApi();
    const [rate, setRate] = useState(0)

    const sendRate = async (value: number) => {
        const res = await api.post('/rent/rate',
            { "house_id": props.data.id, "rate_score": value, "rate_comment": "12345" }
        )
        console.log("rate:", res)

    }

    return <div style={{ width: '100%', marginInline: '40px', marginTop: '50px' }} id="house-rate">
        <Row wrap={false}>
            <Text style={{ fontSize: '1.5rem' }} strong>评价打分</Text>
            <Rate style={{ marginLeft: '10px' }} allowClear={false} disabled={rate !== 0} onChange={(value) => { { setRate(value); sendRate(value) } }}></Rate>
        </Row>
    </div>
}

export default HousePay;


