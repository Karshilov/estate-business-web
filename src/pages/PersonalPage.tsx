import React, { useState, useEffect } from 'react'
import { Basement, Container } from '../components/BasicHTMLElement'
import {
    Layout, Menu, Breadcrumb, Avatar, Button, Card, Divider, Input,
    message, Pagination, Select, Skeleton, Tag, Typography, Upload, Tooltip,
    Col, Row, Descriptions, Form, Radio
} from 'antd'
import { useApi } from '../utils/api'
import ContentContainer from '../components/DetailInfo/ContentContainer'
import 'antd/dist/antd.css'
import '../index.css'

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
    zIndex: 10
}

const focusStyle: React.CSSProperties = {
    position: 'absolute',
    zIndex: 10
}

const PersonalPage = () => {
    const [mouseOver, setMouseOver] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(1);

    const onMouseOver = () => {
        setMouseOver(true);
    }

    const onMouseLeave = () => {
        setMouseOver(false);
    }

    const onSelect = (e: any) => {
        setSelectedMenu(e.key);
    }

    return <Basement style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Container style={{ width: '90%', marginTop: '1rem' }} hoverable={false}>
            <Row wrap={false}>
                <div onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}
                    style={{ display: 'flex', width: 'fit-content' }} className="avatar-uploader"
                >
                    <Upload listType="picture-card"
                        showUploadList={false}
                        className="avatar-uploader"
                    >
                        <Avatar size={84} shape='square' icon={<UserOutlined />} src="https://img2.baidu.com/it/u=3175463323,1252831295&fm=26&fmt=auto&gp=0.jpg">
                        </Avatar>
                        <Tooltip title="上传头像">
                            <UploadOutlined style={mouseOver ? focusStyle : UnfocusStyle}></UploadOutlined>
                        </Tooltip>
                    </Upload>
                </div>
                <Descriptions title="用户名" style={{ paddingLeft: '1rem', width: '50%' }} column={2}>
                    <Descriptions.Item label="昵称">Karshilov</Descriptions.Item>
                    <Descriptions.Item label="性别">女</Descriptions.Item>
                    <Descriptions.Item label="邮箱">12345@qq.com</Descriptions.Item>
                    <Descriptions.Item label="手机号">123456</Descriptions.Item>
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
                    <Menu theme="light" mode="inline" defaultSelectedKeys={['1']} onSelect={onSelect} inlineCollapsed={true}>
                        <Menu.Item key="1" icon={<UserSwitchOutlined />}>
                            我的预约
                        </Menu.Item>
                        <Menu.Item key="2" icon={<StarOutlined />}>
                            我的评分
                        </Menu.Item>
                        <SubMenu key="sub1" title="个人设置" icon={<SettingOutlined />} >
                            <Menu.Item key="3" icon={<FormOutlined />}>个人信息</Menu.Item>
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
                                    <Button type="default" htmlType="submit">修改信息</Button>
                                </Form.Item>
                            </Form>
                        </div>
                        <div style={{ padding: 24, background: '#fff' }} hidden={selectedMenu != 4}>
                            <Form labelCol={{ span: 7 }} >
                                <Form.Item wrapperCol={{ span: 9 }} name="newPassword" label="新密码" >
                                    <Input />
                                </Form.Item>
                                <Form.Item wrapperCol={{ span: 9 }} name="confirmNewPassword" label="确认密码" >
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