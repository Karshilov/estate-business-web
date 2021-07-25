import React, { useState, useEffect } from 'react'
import { Basement, Container } from '../BasicHTMLElement'
import {
    Layout, Menu, Breadcrumb, Avatar, Button, Card, Divider, Input,
    message, Pagination, Select, Skeleton, Tag, Typography, Upload, Tooltip,
    Col, Row, Descriptions, Form, Radio, Space, Modal, Collapse, Popconfirm
} from 'antd'
import { useApi, usePostImg, staticApi } from '../../utils/api'
import { useSelector } from 'react-redux'
import { StoreState } from '../../store'
import { GroupDetailModel, SearchItemModel, UserInfoModel } from "../../utils/DataModel"

import {
    TeamOutlined,
    UserOutlined,
    UploadOutlined,
    SettingOutlined,
    FormOutlined,
    LockOutlined,
    MenuUnfoldOutlined,
    SendOutlined,
    DownOutlined,
    UpOutlined,
    ExportOutlined,
    SearchOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { setFlagsFromString } from 'v8'
import moment from 'moment'

const { Panel } = Collapse;
const { Text, Title, Paragraph } = Typography;

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const GroupItem = (props: {
    teamInfo: GroupDetailModel
}) => {
    const api = useApi();
    const teamInfo = props.teamInfo

    const sendApply = async () => {
        console.log(teamInfo)
        const res = await api.post('/team/join', { "team_id": teamInfo.teamid })
        console.log(res)
        if(res.data.success) {
            message.success("已提交申请")
        }else{
            message.error(res.data.reason)
        }
    }

    return <Container style={{
        border: 'solid',
        borderWidth: '0.5px', borderColor: 'grey', height: 'fit-content'
    }} hoverable={false}>
        <p style={{ width: '100%', fontSize: '18px', marginBottom: 0, display: 'flex', alignItems: 'center' }}>
            <Row style={{ width: '100%', fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                <span>{teamInfo.name}</span>
                <div style={{ flexGrow: 1 }} />
                <Popconfirm
                    title="您确认要加入此团队吗"
                    onConfirm={sendApply}
                    okText="是"
                    cancelText="否"
                >
                    <Tooltip title="申请加入" placement='right'>
                        <PlusOutlined />
                    </Tooltip>
                </Popconfirm>
            </Row>
        </p>
        <Divider style={{ marginTop: '14px' }}></Divider>
        <p>
            <Row style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                <span>创建者：</span>
                <div style={{ flexGrow: 1 }}></div>
                <img style={{ height: '15%', width: '15%' }} src={teamInfo.leader.avatar}></img>
                <span style={{ marginLeft: '7px' }}>{teamInfo.leader.username}</span>
            </Row>
        </p>
        <p style={{ fontSize: '18px' }}>
            <Row style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                团队规模：
                <div style={{ flexGrow: 1 }} />
                <span>{teamInfo.member_ids.length}人</span>
            </Row>
        </p>
        <p style={{ fontSize: '18px' }}>
            <Row style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                创建时间：
                <div style={{ flexGrow: 1 }} />
                <span > {moment(teamInfo.create_time * 1000).format('YYYY / MM / DD')}</span>
            </Row>
        </p>
    </Container>
}

export default GroupItem;