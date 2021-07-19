import React, { useState, useEffect } from 'react'
import { Basement, Container } from '../components/BasicHTMLElement'
import {
    Layout, Menu, Breadcrumb, Avatar, Button, Card, Divider, Input,
    message, Pagination, Select, Skeleton, Tag, Typography, Upload, Tooltip,
    Col, Row, Descriptions, Form, Radio
} from 'antd'
import { useApi } from '../utils/api'
import ContentContainer from '../components/DetailInfo/ContentContainer'
import { useSelector } from 'react-redux'
import { StoreState } from '../store'

import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined,
    ShopOutlined,
    TeamOutlined,
    UserOutlined,
    UploadOutlined,
    VideoCameraOutlined,
    SettingOutlined,
    StarOutlined,
    UserSwitchOutlined,
    FormOutlined,
    LockOutlined
} from '@ant-design/icons';


const { Text, Title, Paragraph } = Typography;

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const UnfocusStyle: React.CSSProperties = {
    display: 'none',
    position: 'absolute',
    zIndex: 10,
    fontSize: '34px'
}

const focusStyle: React.CSSProperties = {
    position: 'absolute',
    zIndex: 10,
    fontSize: '34px'
}

const PersonalPage = (props: { match: any }) => {
    const [mouseOver, setMouseOver] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(1);
    const [userInfo, setUserInfo] = useState({
        username: "-",
        avatar: "",
        nickname: "-",
        gender: -1,
        email: "-",
        phone_number: "-"
    })
    const api = useApi();
    const id = props.match.params.id;
    const { user } = useSelector((state: StoreState) => state, (left: StoreState, right: StoreState) => left.user === right.user)
    const [isOwn, setIsOwn] = useState(false); 

    const onMouseOverAvatar = () => {
        setMouseOver(true);
    }

    const onMouseLeaveAvator = () => {
        setMouseOver(false);
    }

    const onSelectMenu = (e: any) => {
        setSelectedMenu(e.key);
    }

    useEffect(
        () => {
            getUserInfo();
        }, [id]
    )

    const getUserInfo = async () => {
        console.log('fetching info')
        if (id && id !== user?.userid) {
            const res = await api.get('/user', {
                params: {
                    id: id
                }
            })
            if (res.data.success) {
                setUserInfo(res.data.result);
            } else {
                message.error(res.data.reason)
            }
            setIsOwn(false);
        } else {
            const res = await api.get('/user')
            console.log(res);
            if (res.data.success) {
                setUserInfo(res.data.result);
            } else {
                message.error(res.data.reason)
            }
            setIsOwn(true);
        }
    }

    const upLoadAvator = async (file: any, FileList: any) => {


    }

    return <Basement style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Container style={{ width: '90%', marginTop: '1rem' }} hoverable={false}>
            <Row wrap={false}>
                <div onMouseOver={onMouseOverAvatar} onMouseLeave={onMouseLeaveAvator}
                    style={{ display: 'flex', width: 'fit-content' }} className="avatar-uploader"
                >
                    <Upload listType="picture-card"
                        showUploadList={false}
                        className="avatar-uploader"
                        disabled = {isOwn===false}
                    >
                        <Avatar size={94} shape='square' icon={<UserOutlined />} src={userInfo.avatar}>
                        </Avatar>
                        <Tooltip title="上传头像">
                            <UploadOutlined style={mouseOver ? focusStyle : UnfocusStyle} hidden={isOwn===false}/>
                        </Tooltip>
                    </Upload>
                </div>
                <Descriptions title={userInfo.username} style={{ paddingLeft: '1rem', width: '40%' }} column={2}>
                    <Descriptions.Item label="昵称">{userInfo.nickname}</Descriptions.Item>
                    <Descriptions.Item label="性别">{userInfo.gender == -1 ? "-" : (userInfo.gender == 0 ? "男" : "女")}</Descriptions.Item>
                    <Descriptions.Item label="邮箱">{userInfo.email}</Descriptions.Item>
                    <Descriptions.Item label="手机号">{userInfo.phone_number}</Descriptions.Item>
                </Descriptions>
            </Row>
        </Container>

        <Container style={{ width: '90%', marginTop: '1rem' }} hoverable={false}>
            <Layout>
                <Sider
                    style={{
                        padding: '0 10px',
                        background: '#fff',
                    }}
                    width='15%'
                >
                    <Menu theme="light" mode="inline" defaultSelectedKeys={['1']} onSelect={onSelectMenu} inlineCollapsed={true}>
                        <Menu.Item key="1" icon={<UserSwitchOutlined />}>
                            我的预约
                        </Menu.Item>
                        <Menu.Item key="2" icon={<StarOutlined />}>
                            我的评分
                        </Menu.Item>
                        <SubMenu key="sub1" title="个人设置" icon={<SettingOutlined />} >
                            <Menu.Item key="3" icon={<FormOutlined />}>修改信息</Menu.Item>
                            <Menu.Item key="4" icon={<LockOutlined />}>修改密码</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout style={{ margin: '0 7px' }}>
                    <Content style={{ margin: '30px 30px', overflow: 'initial' }}>
                        <div style={{ padding: 24, background: '#fff' }} hidden={selectedMenu != 1}>
                            我的预约

                        </div>
                        <div style={{ padding: 24, background: '#fff' }} hidden={selectedMenu != 2}>
                            我的评分

                        </div>
                        <div style={{ padding: 24, background: '#fff' }} hidden={selectedMenu != 3}>
                            <Form labelCol={{ span: 7 }} >
                                <Form.Item wrapperCol={{ span: 9 }} name="username" label="用户名" >
                                    <Input />
                                </Form.Item>
                                <Form.Item wrapperCol={{ span: 9 }} name="nickname" label="昵称" >
                                    <Input />
                                </Form.Item>
                                <Form.Item wrapperCol={{ span: 20 }} name="gender" label="性别" >
                                    <Radio.Group >
                                        <Radio.Button value={0} style={{ width: '64px', textAlign: 'center' }}>男</Radio.Button>
                                        <Radio.Button value={1} style={{ width: '64px', textAlign: 'center' }}>女</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item wrapperCol={{ span: 9 }} name="email" label="邮箱" >
                                    <Input />
                                </Form.Item>
                                <Form.Item wrapperCol={{ span: 9 }} name="photoNumber" label="手机号" >
                                    <Input />
                                </Form.Item>
                                <Form.Item wrapperCol={{ offset: 10 }}>
                                    <Button type="default" htmlType="submit">修改密码</Button>
                                </Form.Item>
                            </Form>
                        </div>
                        <div style={{ padding: 24, background: '#fff' }} hidden={selectedMenu != 4}>
                            <Form labelCol={{ span: 7 }} >
                                <Form.Item wrapperCol={{ span: 9 }} name="newPassword" label="新密码" >
                                    <Input />
                                </Form.Item>
                                <Form.Item wrapperCol={{ span: 9 }} name="confirmNewPassword" label="再次输入密码" >
                                    <Input />
                                </Form.Item>
                                <Form.Item wrapperCol={{ span: 9 }} name="verify" label="验证码" >
                                    <Row wrap={false}>
                                        <Input />
                                        <Button type="default" htmlType="submit">获取验证码</Button>
                                    </Row>
                                </Form.Item>
                                <Form.Item wrapperCol={{ offset: 10 }}>
                                    <Button type="default" htmlType="button" onClick={() => { }}>修改密码</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Container>
    </Basement >
}

export default PersonalPage;