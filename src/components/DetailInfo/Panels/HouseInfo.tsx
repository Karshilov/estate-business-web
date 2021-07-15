import React, { useState, useEffect } from 'react'
import { Basement, Container } from '../../../components/BasicHTMLElement'
import { RentDetailModel } from '../../../utils/DataModel'
import { Avatar, Button, Card, Divider, Input, message, Tabs, Select, Skeleton, Tag, Typography } from 'antd'
import { useApi } from '../../../utils/api'
import ContentContainer from '../../../components/DetailInfo/ContentContainer'
import { detailOptions } from '../../../utils/DetailOptions'
const { Text, Title, Paragraph } = Typography;


const HouseInfo = (props: { data: RentDetailModel }) => {
    const { data } = props;
    return <div style={{ width: '100%', marginInline: '40px'}}>
        <Text style={{ fontSize: '1.5rem' }} strong>房屋信息</Text>
    </div>
}

export default HouseInfo;
