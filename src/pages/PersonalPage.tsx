import React, { useState, useEffect } from 'react'
import { Basement, Container } from '../components/BasicHTMLElement'
import {
    Layout, Menu, Breadcrumb, Avatar, Button, Card, Divider, Input,
    message, Pagination, Select, Skeleton, Tag, Typography, Upload, Tooltip,
    Col, Row, Descriptions, Form, Radio, Space
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
        }, [id, selectedMenu]
    )


    const getUserInfo = async () => {
        console.log(user?.userid)
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

    const handleInfoSubmit = async (values: any) => {
        console.log(values);
        const checkReg = /\s+/;
        if (values.username && values.username.search(checkReg) !== -1) message.error('请不要使用空白字符');
        if (values.nickname && values.nickname.search(checkReg) !== -1) message.error('请不要使用空白字符');
        if (values.email && values.email.search(checkReg) !== -1) message.error('请不要使用空白字符');
        if (values.phone_number && values.phone_number.search(checkReg) !== -1) message.error('请不要使用空白字符');
        const res = await api.put('/user', {
            username: (values.username && values.username != "") ? values.username : userInfo.username,
            nickname: (values.nickname && values.nickname != "") ? values.nickname : userInfo.nickname,
            email: (values.email && values.email != "") ? values.email : userInfo.email,
            phone_number: (values.phone_number && values.phone_number != "") ? values.phone_number : userInfo.phone_number,
            gender: (values.gender == 0 || values.gender == 1) ? values.gender : userInfo.gender,
        });
        console.log(res);
        if (res.data.success) {
            message.success('提交成功')
        } else {
            message.warning(res.data.reason)
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
                    {isOwn && (
                        <Upload listType="picture-card"
                            showUploadList={false}
                            className="avatar-uploader "
                        >
                            <Avatar size={94} shape='square' icon={<UserOutlined />} src={userInfo.avatar}>
                            </Avatar>
                            <Tooltip title="上传头像">
                                <UploadOutlined style={mouseOver ? focusStyle : UnfocusStyle} />
                            </Tooltip>
                        </Upload>
                    )}
                    {!isOwn && (
                        <span style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '110px',
                            height: '110px',
                            borderStyle: 'dashed',
                            borderWidth: '1px',
                            borderColor: 'rgb(235 235 235)',
                            background: 'rgb(250 250 250)'
                        }}
                        >
                            <Avatar size={94} shape='square' icon={<UserOutlined />} src={userInfo.avatar}>
                            </Avatar>
                        </span>
                    )}
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
                            {isOwn ? "我的预约" : (userInfo.gender !== 1 ? "他的预约" : "她的预约")}
                        </Menu.Item>
                        <Menu.Item key="2" icon={<StarOutlined />}>
                            {isOwn ? "我的评分" : (userInfo.gender !== 1 ? "他的预约" : "她的预约")}
                        </Menu.Item>
                        {isOwn && (
                            <SubMenu key="sub1" title="个人设置" icon={<SettingOutlined />} >
                                <Menu.Item key="3" icon={<FormOutlined />}>修改信息</Menu.Item>
                                <Menu.Item key="4" icon={<LockOutlined />}>修改密码</Menu.Item>
                            </SubMenu>
                        )}
                    </Menu>
                </Sider>
                <Layout style={{ margin: '0 7px' }}>
                    <Content style={{ margin: '30px 30px', overflow: 'initial' }}>
                        <div style={{ padding: 24, background: '#fff' }} hidden={selectedMenu != 1}>
                            预约

                        </div>
                        <div style={{ padding: 24, background: '#fff' }} hidden={selectedMenu != 2}>
                            评分
                        </div>
                        <div style={{ padding: 24, background: '#fff' }} hidden={selectedMenu != 3 || !isOwn}>
                            <Form labelCol={{ span: 7 }} onFinish={handleInfoSubmit} >
                                <Form.Item wrapperCol={{ span: 9 }} name="username" label="用户名" >
                                    <Input placeholder={userInfo.username} />
                                </Form.Item>
                                <Form.Item wrapperCol={{ span: 9 }} name="nickname" label="昵称" >
                                    <Input placeholder={userInfo.nickname} />
                                </Form.Item>
                                <Form.Item wrapperCol={{ span: 20 }} name="gender" label="性别" >
                                    <Radio.Group defaultValue={userInfo.gender}>
                                        <Radio.Button value={0} style={{ width: '64px', textAlign: 'center' }}>男</Radio.Button>
                                        <Radio.Button value={1} style={{ width: '64px', textAlign: 'center' }}>女</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item wrapperCol={{ span: 9 }} name="email" label="邮箱">
                                    <Input placeholder={userInfo.email} />
                                </Form.Item>
                                <Form.Item wrapperCol={{ span: 9 }} name="phone_number" label="手机号" >
                                    <Input placeholder={userInfo.phone_number} />
                                </Form.Item>
                                <Form.Item wrapperCol={{ offset: 10 }}>
                                    <Button type="default" htmlType="submit">修改信息</Button>
                                </Form.Item>
                            </Form>
                        </div>
                        <div style={{ padding: 24, background: '#fff' }} hidden={selectedMenu != 4 || !isOwn}>
                            <Form labelCol={{ span: 7 }}>
                                <Form.Item wrapperCol={{ span: 9 }} name="newPassword" label="新密码" >
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item wrapperCol={{ span: 9 }} name="confirmNewPassword" label="再次输入密码" >
                                    <Input.Password />
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