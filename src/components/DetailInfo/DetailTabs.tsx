import React, { useState, useEffect } from 'react'
import { Basement, Container } from '../../components/BasicHTMLElement'
import { RentDetailModel } from '../../utils/DataModel'
import { Avatar, Button, Card, Divider, Input, message, Tabs, Select, Skeleton, Tag, Typography } from 'antd'
import { useApi } from '../../utils/api'
import ContentContainer from '../../components/DetailInfo/ContentContainer'
const { Text, Title, Paragraph } = Typography;

const DetailTabs = (props: { data: RentDetailModel }) => {
    const { data } = props;

    return <Container style={{ width: '75%', background: '#fff', marginTop: 40 }} bodyStyle={{ display: 'flex', flexDirection: 'row' }} hoverable={false}>

    </Container>
}