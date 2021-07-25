import React, { useState, useEffect } from 'react'
import { Basement, Container } from '../../components/BasicHTMLElement'
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
    ExportOutlined
} from '@ant-design/icons';
import { setFlagsFromString } from 'v8'

const { Panel } = Collapse;
const { Text, Title, Paragraph } = Typography;

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const Broker = (props: {
    userInfo?: {
        username: string,
        avatar: string,
        nickname: string,
        gender: number | undefined,
        email: string | undefined,
        phone_number: string | undefined
    }
    isCreater?: boolean, // 是创建者，有标识
    canOperate?: boolean, // 可操作
    teamid?: string
    userid?: string
}) => {
    const api = useApi();
    const userInfo = props.userInfo;
    const [visible, setVisible] = useState(true);
    const title = <p style={{ marginBottom: 0 }}>
        {userInfo?.username ? userInfo?.username : '-'}
        <span style={{ background: 'red', color: '#fff', padding: '0 4px', marginLeft: '16px' }}
            hidden={!props.isCreater}>
            创建者
        </span>
    </p>

    const remove = async () => {
        const res = await api.put('/team', {
            params: {
                ids: [props.userid],
                teamid: props.teamid
            }
        })
        console.log(res)
        if (res.data.success) {
            message.success("成员已移除")
            setVisible(false);
        } else {
            message.error(res.data.reason)
        }
    }

    return <div style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center' }} hidden={!visible}>
        <Row wrap={false}>
            <div style={{ display: 'flex', width: 'fit-content', alignItems: 'center' }} >
                <span style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '110px',
                    height: '90%',
                    borderStyle: 'dashed',
                    borderWidth: '1px',
                    borderColor: 'rgb(235 235 235)',
                    background: 'rgb(250 250 250)'
                }}
                >
                    <Avatar size={94} shape='square' icon={<UserOutlined />} src={userInfo?.avatar}>
                    </Avatar>
                </span>
            </div>
            <Descriptions title={title} style={{ paddingLeft: '1rem', width: '70%' }} column={2}>
                <Descriptions.Item label="昵称">{userInfo?.nickname ? userInfo?.nickname : '-'}</Descriptions.Item>
                <Descriptions.Item label="性别">{userInfo?.gender === undefined ? "-" : (userInfo?.gender == 0 ? "男" : "女")}</Descriptions.Item>

                <Descriptions.Item label="邮箱">{userInfo?.email ? userInfo?.email : '-'}</Descriptions.Item>
                <Descriptions.Item label="手机号">{userInfo?.phone_number ? userInfo?.phone_number : '-'}</Descriptions.Item>
            </Descriptions>
            <div style={{ display: 'flex', alignItems: 'center' }} hidden={true || !props.canOperate}>
                <Popconfirm
                    title="您确认要移除该成员吗"
                    onConfirm={remove}
                    okText="是"
                    cancelText="否"
                >
                    <Tooltip title="移除该成员">
                        <a style={{ fontSize: '20px', marginLeft: '1em', fontWeight: 'normal' }}
                            hidden={!props.canOperate}>
                            <ExportOutlined />
                        </a>
                    </Tooltip>
                </Popconfirm>
            </div>
        </Row>
    </div >
}

export default Broker;