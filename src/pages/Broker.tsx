import React, { useState, useEffect } from 'react'
import { Basement, Container } from '../components/BasicHTMLElement'
import {
    Layout, Menu, Breadcrumb, Avatar, Button, Card, Divider, Input,
    message, Pagination, Select, Skeleton, Tag, Typography, Upload, Tooltip,
    Col, Row, Descriptions, Form, Radio, Space, Modal, Collapse
} from 'antd'
import { useApi, usePostImg, staticApi } from '../utils/api'
import ContentContainer from '../components/DetailInfo/ContentContainer'
import { useSelector } from 'react-redux'
import { StoreState } from '../store'
import { SearchItemModel } from "../utils/DataModel"
import VirtualList from '../components/ItemList/VirtualList'
import GroupSearch from "./GroupPage/GroupSearch"

import {
    TeamOutlined,
    UserOutlined,
    UploadOutlined,
    SettingOutlined,
    FormOutlined,
    LockOutlined,
    MenuUnfoldOutlined,
    SendOutlined
} from '@ant-design/icons';

const { Panel } = Collapse;
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

const Broker = () => {
    const [mouseOver, setMouseOver] = useState(false);
    const [selectedSettingMenu, setSelectedSettingMenu] = useState("1");
    const [userInfo, setUserInfo] = useState({
        username: "-",
        avatar: "",
        nickname: "-",
        gender: -1,
        email: "-",
        phone_number: "-"
    })
    const api = useApi();
    const api2 = usePostImg();
    const [pswForm] = Form.useForm();
    const [infoForm] = Form.useForm();
    const [createForm] = Form.useForm();

    const { user } = useSelector((state: StoreState) => state, (left: StoreState, right: StoreState) => left.user === right.user)

    const [pageAndPageSize, setPageAndPageSize] = useState([1, 3]);
    const [totalNum, setTotalNum] = useState(1);
    const [resourceList, setResourceList] = useState<Array<SearchItemModel>>([])

    const [createVisible, setCreateVisible] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);


    const showDrawer = () => {
        setCreateVisible(true);
    };
    const onClose = () => {
        setCreateVisible(false);
    };

    const onMouseOverAvatar = () => {
        setMouseOver(true);
    }

    const onMouseLeaveAvator = () => {
        setMouseOver(false);
    }

    const onSelectSettingMenu = (e: any) => {
        setSelectedSettingMenu(e.key);
    }

    useEffect(
        () => {
            getUserInfo();
        }, [selectedSettingMenu]
    )


    const getUserInfo = async () => {
        console.log(user?.userid)
        const res = await api.get('/user', {
            params: {
                id: user?.userid
            }
        })
        if (res.data.success) {
            setUserInfo(res.data.result);
            infoForm.setFieldsValue(userInfo)
        } else {
            message.error(res.data.reason)
        }
    }

    const handleInfoSubmit = async (values: any) => {
        // console.log(values);
        const checkReg = /\s+/;
        if (values.username && values.username.search(checkReg) !== -1) message.error('请不要使用空白字符');
        else if (values.nickname && values.nickname.search(checkReg) !== -1) message.error('请不要使用空白字符');
        else if (values.email && values.email.search(checkReg) !== -1) message.error('请不要使用空白字符');
        else if (values.phone_number && values.phone_number.search(checkReg) !== -1) message.error('请不要使用空白字符');
        else {
            const newInfo = {
                username: (values.username && values.username != "") ? values.username : userInfo.username,
                nickname: (values.nickname && values.nickname != "") ? values.nickname : userInfo.nickname,
                email: (values.email && values.email != "") ? values.email : userInfo.email,
                phone_number: (values.phone_number && values.phone_number != "") ? values.phone_number : userInfo.phone_number,
                gender: (values.gender == 0 || values.gender == 1) ? values.gender : userInfo.gender,
                avatar: userInfo.avatar
            };

            const res = await api.put('/user', newInfo);
            // console.log(res);
            if (res.data.success) {
                message.success('提交成功')
            } else {
                message.warning(res.data.reason)
            }
            setUserInfo(newInfo);
        }
    }

    const handlePasswordSubmit = async (values: any) => {
        // console.log(values);
        const checkReg = /\s+/;
        if (!values.new_password || values.new_password == "") message.warning("未输入新密码");
        else if (!values.confirm_password || values.confirm_password == "") message.warning("未再次输入新密码");
        else if (!values.verify || values.verify == "") message.warning("未输入验证码");
        else if (values.confirm_password !== values.new_password) message.warning("两次输入密码不一致");
        else if (values.new_password.search(checkReg) !== -1) message.warning("请不要使用空白字符");
        else if (values.confirm_password.search(checkReg) !== -1) message.warning("请不要使用空白字符");
        else {
            const res = await api.post('/user/password', {
                verify: values.verify,
                new_password: values.new_password
            });
            console.log(res);
            if (res.data.success) {
                message.success('提交成功')
                pswForm.resetFields();
            } else {
                message.warning(res.data.reason)
            }
        }
    }

    const sendVerify = async () => {
        //console.log("send")
        const res = await staticApi.get('/email', {
            params: {
                to: userInfo.email
            }
        })
        console.log(res);
        if (res.data.success) {
            setUserInfo(res.data.result);
        } else {
            message.error(res.data.reason)
        }
        console.log(userInfo)
        getUserInfo();
    }

    const beforeAvatarUpLoad = async (file: any, fileList: any) => {
        //console.log(file);
        if (file.type !== "image/jpeg" && file.type !== "image/png") {
            message.warning("图片应为 jpeg 或 png 格式");
            return Upload.LIST_IGNORE;
        }
        const res = await api.get('/upload', {
            params: {
                type: "avatar",
                file_name: file.name
            }
        });
        //console.log("res:", res);
        const fd = new FormData()
        for (const r in res.data.result.url.formData) {
            fd.append(r, res.data.result.url.formData[r])
        }
        fd.append("file", file);
        const res2 = await api2.post(res.data.result.url.postURL, fd)
        //console.log("res2:", res2);
        const res3 = await api.post('/user/avatar', { avatar: res.data.result.key })
        //console.log("res3:", res3);
        getUserInfo();
        return true;
    }

    return <Basement style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Container style={{ width: '80%', marginTop: '1rem' }} hoverable={false}>
            <Row wrap={false}>
                <div onMouseOver={onMouseOverAvatar} onMouseLeave={onMouseLeaveAvator}
                    style={{ display: 'flex', width: 'fit-content' }} className="avatar-uploader"
                >
                    <Upload listType="picture-card"
                        showUploadList={false}
                        className="avatar-uploader "
                        beforeUpload={beforeAvatarUpLoad}
                    >
                        <Avatar size={94} shape='square' icon={<UserOutlined />} src={userInfo.avatar}>
                        </Avatar>
                        <Tooltip title="上传头像">
                            <UploadOutlined style={mouseOver ? focusStyle : UnfocusStyle} />
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
            <Layout hidden={false} >
                <Sider
                    style={{
                        padding: '0 10px',
                        background: '#fff',
                    }}
                    width='15%'
                    collapsed={false}
                >
                    <Menu theme="light" mode="inline" onSelect={onSelectSettingMenu}>
                        <Menu.Item key="1" icon={<FormOutlined />}>修改信息</Menu.Item>
                        <Menu.Item key="2" icon={<LockOutlined />}>修改密码</Menu.Item>
                    </Menu>
                </Sider>
                <Content style={{ margin: '1.5em 1.5em', background: '#fff' }}>
                    <div style={{ padding: '1.5em 0' }} hidden={selectedSettingMenu != "1"}>
                        <Form labelCol={{ span: 7 }} onFinish={handleInfoSubmit} form={infoForm}>
                            <Form.Item wrapperCol={{ span: 9 }} name="username" label="用户名" >
                                <Input placeholder={userInfo.username} onPressEnter={(e) => { e.preventDefault() }} />
                            </Form.Item>
                            <Form.Item wrapperCol={{ span: 9 }} name="nickname" label="昵称" >
                                <Input placeholder={userInfo.nickname} onPressEnter={(e) => { e.preventDefault() }} />
                            </Form.Item>
                            <Form.Item wrapperCol={{ span: 20 }} name="gender" label="性别" >
                                <Radio.Group>
                                    <Radio.Button value={0} style={{ width: '64px', textAlign: 'center' }}>男</Radio.Button>
                                    <Radio.Button value={1} style={{ width: '64px', textAlign: 'center' }}>女</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item wrapperCol={{ span: 9 }} name="email" label="邮箱">
                                <Input placeholder={userInfo.email} onPressEnter={(e) => { e.preventDefault() }} />
                            </Form.Item>
                            <Form.Item wrapperCol={{ span: 9 }} name="phone_number" label="手机号" >
                                <Input placeholder={userInfo.phone_number} onPressEnter={(e) => { e.preventDefault() }} />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 10 }}>
                                <Button type="default" htmlType="submit">修改信息</Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div style={{ padding: '1.5em 0' }} hidden={selectedSettingMenu != "2"}>
                        <Form labelCol={{ span: 7 }} onFinish={handlePasswordSubmit} form={pswForm}>
                            <Form.Item wrapperCol={{ span: 9 }} name="new_password" label="新密码" >
                                <Input.Password onPressEnter={(e) => { e.preventDefault() }} />
                            </Form.Item>
                            <Form.Item wrapperCol={{ span: 9 }} name="confirm_password" label="再次输入密码" >
                                <Input.Password onPressEnter={(e) => { e.preventDefault() }} />
                            </Form.Item>
                            <Form.Item wrapperCol={{ span: 9 }} name="verify" label="验证码" >
                                <Row wrap={false}>
                                    <Input onPressEnter={(e) => { e.preventDefault() }} />
                                    <Button type="default" htmlType="button" onClick={sendVerify}>获取验证码</Button>
                                </Row>
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 10 }}>
                                <Button type="default" htmlType="submit">修改密码</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Content>
            </Layout>
        </Container>
        <Button>23</Button>
        <Container style={{ width: '80%', marginTop: '1rem' }} hoverable={false}>
            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontSize: '20px' }}>
                <TeamOutlined />我的团队
            </p>

            <Button type="primary" onClick={() => setCreateVisible(true)}>
                创建团队
            </Button>
            <Button type="primary" style={{ marginLeft: '14px' }} onClick={() => setSearchVisible(true)}>
                加入团队
            </Button>
        </Container>

        <Modal
            title="创建团队"
            centered
            visible={createVisible}
            onOk={() => { setCreateVisible(false) }}
            onCancel={() => setCreateVisible(false)}
            width={800}
            maskClosable={false}
            okText="创建"
            cancelText="取消"
        >
            <Form labelCol={{ span: 8 }} onFinish={() => { }} form={createForm} style={{ marginTop: '24px' }}>
                <Form.Item wrapperCol={{ span: 9 }} name="verify" label="团队名" >
                    <Row wrap={false}>
                        <Input onPressEnter={(e) => { e.preventDefault() }} />
                    </Row>
                </Form.Item>
            </Form>
        </Modal>

        <Modal
            title="加入团队"
            centered
            visible={searchVisible}
            onCancel={() => setSearchVisible(false)}
            width='70%'
            maskClosable={false}
            footer={null}
            bodyStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0', width: '100%' }}
            style={{ marginTop: '1.5em' }}
        >
            <div style={{ background: 'rgb(247 247 247)', width: '100%' }}>
                <GroupSearch />
            </div>
        </Modal>
    </Basement >
}

export default Broker;