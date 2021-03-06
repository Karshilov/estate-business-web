import React, { useState, useEffect } from 'react'
import { Basement, Container } from '../components/BasicHTMLElement'
import {
    Layout, Menu, Breadcrumb, Avatar, Button, Card, Divider, Input,
    message, Pagination, Select, Skeleton, Tag, Typography, Upload, Tooltip,
    Col, Row, Descriptions, Form, Radio, Space
} from 'antd'
import { useApi, usePostImg, staticApi } from '../utils/api'
import ContentContainer from '../components/DetailInfo/ContentContainer'
import { useSelector } from 'react-redux'
import { StoreState } from '../store'
import { SearchItemModel } from "../utils/DataModel"
import VirtualList from '../components/ItemList/VirtualList'

import {
    UserOutlined,
    UploadOutlined,
    SettingOutlined,
    StarOutlined,
    UserSwitchOutlined,
    FormOutlined,
    LockOutlined,
    HomeOutlined
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
    const [selectedMenu, setSelectedMenu] = useState("5");
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
    const { user } = useSelector((state: StoreState) => state, (left: StoreState, right: StoreState) => left.user === right.user)
    const id = (props.match.params.id ? props.match.params.id : user?.userid);
    const [isOwn, setIsOwn] = useState(false);

    const [pageAndPageSize, setPageAndPageSize] = useState([1, 3]);
    const [pageAndPageSize2, setPageAndPageSize2] = useState([1, 3]);
    const [pageAndPageSize3, setPageAndPageSize3] = useState([1, 3]);
    const [totalNum, setTotalNum] = useState(1);
    const [resourceList, setResourceList] = useState<Array<SearchItemModel>>([])

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

    useEffect(
        () => {
            if (selectedMenu === "1")
                getAppointment();
            if (selectedMenu === "2")
                getRate();
            if (selectedMenu === "5")
                getHouseSource();
        }, [selectedMenu, pageAndPageSize, pageAndPageSize2, pageAndPageSize3]
    )

    const getHouseSource = async () => {
        const res = await api.get('/user/rent', {
            params: {
                id: id,
                page_size: pageAndPageSize[1],
                page_num: pageAndPageSize[0]
            }
        }
        )
        console.log("source:", res);
        if (res.data.success) {
            setResourceList(res.data.result.list)
            setTotalNum(res.data.result.total)
        } else {
            message.error(res.data.reason)
        }
    }

    const getRate = async () => {
        const res = await api.get('/user/rate', {
            params: {
                id: id,
                page_size: pageAndPageSize3[1],
                page_num: pageAndPageSize3[0]
            }
        }
        )
        console.log("rate: ", res);
        if (res.data.success) {
            setResourceList(res.data.result.list)
            setTotalNum(res.data.result.total)
        } else {
            message.error(res.data.reason)
        }
    }

    const getAppointment = async () => {
        const res = await api.get('/user/appointment', {
            params: {
                id: id,
                page_size: pageAndPageSize2[1],
                page_num: pageAndPageSize2[0]
            }
        }
        )
        //console.log("app:", res);
        if (res.data.success) {
            setResourceList(res.data.result.list)
            setTotalNum(res.data.result.total)
        } else {
            message.error(res.data.reason)
        }
    }

    const getUserInfo = async () => {
        console.log(user?.userid)
        const res = await api.get('/user', {
            params: {
                id: id
            }
        })
        if (res.data.success) {
            setUserInfo(res.data.result);
            infoForm.setFieldsValue(res.data.result)
        } else {
            message.error(res.data.reason)
        }
        if (id !== user?.userid) {
            setIsOwn(false);
        }
        else
            setIsOwn(true);
    }

    const handleInfoSubmit = async (values: any) => {
        // console.log(values);
        const checkReg = /\s+/;
        if (values.username && values.username.search(checkReg) !== -1) message.error('???????????????????????????');
        else if (values.nickname && values.nickname.search(checkReg) !== -1) message.error('???????????????????????????');
        else if (values.email && values.email.search(checkReg) !== -1) message.error('???????????????????????????');
        else if (values.phone_number && values.phone_number.search(checkReg) !== -1) message.error('???????????????????????????');
        else {
            const newInfo = {
                username: (values.username && values.username !== "") ? values.username : userInfo.username,
                nickname: (values.nickname && values.nickname !== "") ? values.nickname : userInfo.nickname,
                email: (values.email && values.email !== "") ? values.email : userInfo.email,
                phone_number: (values.phone_number && values.phone_number !== "") ? values.phone_number : userInfo.phone_number,
                gender: (values.gender == 0 || values.gender == 1) ? values.gender : userInfo.gender,
                avatar: userInfo.avatar
            };

            const res = await api.put('/user', newInfo);
            // console.log(res);
            if (res.data.success) {
                message.success('????????????')
            } else {
                message.warning(res.data.reason)
            }
            setUserInfo(newInfo);
        }
    }

    const handlePasswordSubmit = async (values: any) => {
        // console.log(values);
        const checkReg = /\s+/;
        if (!values.new_password || values.new_password == "") message.warning("??????????????????");
        else if (!values.confirm_password || values.confirm_password == "") message.warning("????????????????????????");
        else if (!values.verify || values.verify == "") message.warning("??????????????????");
        else if (values.confirm_password !== values.new_password) message.warning("???????????????????????????");
        else if (values.new_password.search(checkReg) !== -1) message.warning("???????????????????????????");
        else if (values.confirm_password.search(checkReg) !== -1) message.warning("???????????????????????????");
        else {
            const res = await api.post('/user/password', {
                verify: values.verify,
                new_password: values.new_password
            });
            console.log(res);
            if (res.data.success) {
                message.success('????????????')
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
            message.warning("???????????? jpeg ??? png ??????");
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
                    {isOwn && (
                        <Upload listType="picture-card"
                            showUploadList={false}
                            className="avatar-uploader "
                            beforeUpload={beforeAvatarUpLoad}
                        >
                            <Avatar size={94} shape='square' icon={<UserOutlined />} src={userInfo.avatar}>
                            </Avatar>
                            <Tooltip title="????????????">
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
                <Descriptions title={userInfo.username ? userInfo.username : '-'} style={{ paddingLeft: '1rem', width: '50%' }} column={2}>
                    <Descriptions.Item label="??????">{userInfo.nickname ? userInfo.nickname : '-'}</Descriptions.Item>
                    <Descriptions.Item label="??????">{userInfo.gender === undefined || userInfo.gender === -1 ? "-" : (userInfo.gender == 0 ? "???" : "???")}</Descriptions.Item>
                    <Descriptions.Item label="??????">{userInfo.email ? userInfo.email : '-'}</Descriptions.Item>
                    <Descriptions.Item label="?????????">{userInfo.phone_number ? userInfo.phone_number : '-'}</Descriptions.Item>
                </Descriptions>
            </Row>
        </Container>

        <Container style={{ width: '80%', marginTop: '1rem' }} hoverable={false}>
            <Layout>
                <Sider
                    style={{
                        padding: '0 10px',
                        background: '#fff',
                    }}
                    width='15%'
                    collapsed={false}
                >
                    <Menu theme="light" mode="inline" defaultSelectedKeys={['5']} onSelect={onSelectMenu}>
                        <Menu.Item key="5" icon={<HomeOutlined />}>
                            {isOwn ? "????????????" : (userInfo.gender !== 1 ? "????????????" : "????????????")}
                        </Menu.Item>
                        {isOwn &&
                            <Menu.Item key="1" icon={<UserSwitchOutlined />}>
                                ????????????
                            </Menu.Item>
                        }
                        <Menu.Item key="2" icon={<StarOutlined />}>
                            {isOwn ? "????????????" : (userInfo.gender !== 1 ? "????????????" : "????????????")}
                        </Menu.Item>
                        {isOwn && (
                            <SubMenu key="sub1" title="????????????" icon={<SettingOutlined />} >
                                <Menu.Item key="3" icon={<FormOutlined />}>????????????</Menu.Item>
                                <Menu.Item key="4" icon={<LockOutlined />}>????????????</Menu.Item>
                            </SubMenu>
                        )}
                    </Menu>
                </Sider>
                <Layout style={{ margin: '0 0.5em' }}>
                    <Content style={{ margin: '1.5em 1.5em', background: '#fff' }}>
                        {/*??????*/}
                        <div hidden={selectedMenu !== "5"}>
                            <VirtualList list={resourceList} type="source" other={!isOwn} />
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '1em' }} hidden={resourceList.length === 0}>
                                <Pagination {...{ defaultCurrent: 1, pageSize: pageAndPageSize[1], total: totalNum, showSizeChanger: false }} responsive onChange={(pg, pgsz) => {
                                    setPageAndPageSize([pg, pageAndPageSize[1]]);
                                }} />
                            </div>
                        </div>
                        {/*??????*/}
                        <div hidden={selectedMenu !== "1"}>
                            <VirtualList list={resourceList} type="appointment" other={!isOwn} />
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '1em' }} hidden={resourceList.length === 0}>
                                <Pagination {...{ defaultCurrent: 1, pageSize: pageAndPageSize2[1], total: totalNum, showSizeChanger: false }} responsive onChange={(pg, pgsz) => {
                                    setPageAndPageSize2([pg, pageAndPageSize2[1]]);
                                }} />
                            </div>
                        </div>
                        {/*??????*/}
                        <div hidden={selectedMenu !== "2"}>
                            <VirtualList list={resourceList} type="rate" other={!isOwn} />
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '1em' }} hidden={resourceList.length == 0}>
                                <Pagination {...{ defaultCurrent: 1, pageSize: pageAndPageSize3[1], total: totalNum, showSizeChanger: false }} responsive onChange={(pg, pgsz) => {
                                    setPageAndPageSize3([pg, pageAndPageSize3[1]]);
                                }} />
                            </div>
                        </div>
                        <div style={{ padding: '1.5em 0' }} hidden={selectedMenu !== "3" || !isOwn}>
                            <Form labelCol={{ span: 7 }} onFinish={handleInfoSubmit} form={infoForm}>
                                <Form.Item wrapperCol={{ span: 9 }} name="username" label="?????????" >
                                    <Input placeholder={userInfo.username} onPressEnter={(e) => { e.preventDefault() }} />
                                </Form.Item>
                                <Form.Item wrapperCol={{ span: 9 }} name="nickname" label="??????" >
                                    <Input placeholder={userInfo.nickname} onPressEnter={(e) => { e.preventDefault() }} />
                                </Form.Item>
                                <Form.Item wrapperCol={{ span: 20 }} name="gender" label="??????" >
                                    <Radio.Group>
                                        <Radio.Button value={0} style={{ width: '64px', textAlign: 'center' }}>???</Radio.Button>
                                        <Radio.Button value={1} style={{ width: '64px', textAlign: 'center' }}>???</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item wrapperCol={{ span: 9 }} name="email" label="??????">
                                    <Input placeholder={userInfo.email} onPressEnter={(e) => { e.preventDefault() }} />
                                </Form.Item>
                                <Form.Item wrapperCol={{ span: 9 }} name="phone_number" label="?????????" >
                                    <Input placeholder={userInfo.phone_number} onPressEnter={(e) => { e.preventDefault() }} />
                                </Form.Item>
                                <Form.Item wrapperCol={{ offset: 10 }}>
                                    <Button type="default" htmlType="submit">????????????</Button>
                                </Form.Item>
                            </Form>
                        </div>
                        <div style={{ padding: '1.5em 0' }} hidden={selectedMenu !== "4" || !isOwn}>
                            <Form labelCol={{ span: 7 }} onFinish={handlePasswordSubmit} form={pswForm}>
                                <Form.Item wrapperCol={{ span: 9 }} name="new_password" label="?????????" >
                                    <Input.Password onPressEnter={(e) => { e.preventDefault() }} />
                                </Form.Item>
                                <Form.Item wrapperCol={{ span: 9 }} name="confirm_password" label="??????????????????" >
                                    <Input.Password onPressEnter={(e) => { e.preventDefault() }} />
                                </Form.Item>
                                <Form.Item wrapperCol={{ span: 9 }} name="verify" label="?????????" >
                                    <Row wrap={false}>
                                        <Input onPressEnter={(e) => { e.preventDefault() }} />
                                        <Button type="default" htmlType="button" onClick={sendVerify}>???????????????</Button>
                                    </Row>
                                </Form.Item>
                                <Form.Item wrapperCol={{ offset: 10 }}>
                                    <Button type="default" htmlType="submit">????????????</Button>
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