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
import GroupItem from './GroupItem'

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
    SearchOutlined
} from '@ant-design/icons';
import { setFlagsFromString } from 'v8'
import moment from 'moment'
import ContentContainer from '../DetailInfo/ContentContainer'

const { Panel } = Collapse;
const { Text, Title, Paragraph } = Typography;

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const GroupList = (props: {
    list: GroupDetailModel[]
}) => {
    const columns: GroupDetailModel[][] = [[], []];

    props.list.forEach((item, index) => {
        columns[index % 2].push(item)
    })

    return <div style={{ width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '90%',display:'flex' }}>
            <div style={{ width: '40%' }}>
                {columns[0].map(item => <GroupItem teamInfo={item} />)}
            </div>
            <div style={{ flexGrow: 1 }}></div>
            <div style={{ width: '40%' }}>
                {columns[1].map(item => <GroupItem teamInfo={item} />)}
            </div>
        </div>
    </div >
}

export default GroupList;