import React, { useState, useEffect } from 'react'
import { Basement, Container } from '../components/BasicHTMLElement'
import {
    Layout, Menu, Breadcrumb, Avatar, Button, Card, Divider, Input,
    message, Pagination, Select, Skeleton, Tag, Typography, Upload, Tooltip,
    Col, Row, Descriptions, Form, Radio, Space, Modal, Collapse, Popconfirm, Drawer, Table
} from 'antd'
import { useApi, usePostImg, staticApi } from '../utils/api'
import ContentContainer from '../components/DetailInfo/ContentContainer'
import { useSelector } from 'react-redux'
import { StoreState } from '../store'
import { GroupDetailModel, SearchItemModel, UserInfoModel } from "../utils/DataModel"
import VirtualList from '../components/ItemList/VirtualList'
import GroupSearch from "./GroupPage/GroupSearch"
import Member from '../components/MemberList/Member'
import moment from 'moment';

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
    SearchOutlined,
} from '@ant-design/icons';
import { setFlagsFromString } from 'v8'
import { UserInfo } from 'os'

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
    const api = useApi();
    const api2 = usePostImg();
    const [pswForm] = Form.useForm();
    const [infoForm] = Form.useForm();
    const [createForm] = Form.useForm();

    const { user } = useSelector((state: StoreState) => state, (left: StoreState, right: StoreState) => left.user === right.user)
    const [userInfo, setUserInfo] = useState({
        username: "-",
        avatar: "",
        nickname: "-",
        gender: -1,
        email: "-",
        phone_number: "-",
    })
    const [teamInfo, setTeamInfo] = useState<GroupDetailModel>()
    const [applyInfo, setApplyInfo] = useState<{
        id: string,
        create_date: number,
        user: {
            username: string,
            avatar: string,
            nickname: string,
            gender: number | undefined,
            email: string | undefined,
            phone_number: string | undefined
        }
    }[]>()
    const [drawerVisible, setDrawerVisible] = useState(false)

    const [pageAndPageSize, setPageAndPageSize] = useState([1, 3]);
    const [totalNum, setTotalNum] = useState(1);
    const [resourceList, setResourceList] = useState<Array<SearchItemModel>>([])

    const [createVisible, setCreateVisible] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);
    const [myApplyVisible, setMyApplyVisible] = useState(false);
    const [settingVisible, setSettingVisible] = useState(false)

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
        const res = await api.get('/user', {
            params: {
                id: user?.userid
            }
        })
        console.log(res)
        if (res.data.success) {
            setUserInfo(res.data.result);
            setTeamInfo(res.data.result.team);
            infoForm.setFieldsValue(res.data.result)
        } else {
            message.error(res.data.reason)
        }
    }

    const getApply = async () => {
        console.log(teamInfo?.teamid)
        const res = await api.get('/team/apply', {
            params: {
                team_id: teamInfo?.teamid
            }
        })
        console.log("apply:", res)
        if (res.data.success) {
            setApplyInfo(res.data.result)
        }
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

    const createTeam = async (values: any) => {
        const checkReg = /\s+/;
        if (!values.teamname) message.warning("??????????????????")
        else if (values.teamname.search(checkReg) != -1) message.warning("???????????????????????????")
        else {
            console.log(values.teamname)
            const res = await api.post('/team', { "name": values.teamname })
            console.log("create res: ", res)
            if (res.data.success) {
                message.success("???????????????")
            } else {
                message.error(res.data.reason)
            }
            setCreateVisible(false)
        }
    }

    const deleteTeam = async () => {
        // console.log("team:", teamInfo)
        const res = await api.delete('/team', { params: { id: teamInfo?.teamid } })
        console.log("del:", res)
        if (res.data.success) {
            message.success("?????????????????????")
            setTeamInfo(undefined)
        } else {
            message.error(res.data.reason)
        }
    }

    const getMyApply = async () => {
        const res = await api.get('/team/join');
        console.log("myapp:",res)
    }

    return <Basement style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Container style={{ width: '80%', marginTop: '1rem' }} hoverable={false}>
            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontSize: '20px' }}>
                <UserOutlined />????????????
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <a style={{ fontSize: '14px', marginLeft: '1em' }}
                        onClick={() => { setSettingVisible(true) }}>
                        ????????????
                    </a>
                </div>
            </p>
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
                        <Tooltip title="????????????">
                            <UploadOutlined style={mouseOver ? focusStyle : UnfocusStyle} />
                        </Tooltip>
                    </Upload>
                </div>
                <Descriptions title={userInfo.username ? userInfo.username : '-'} style={{ paddingLeft: '1rem', width: '50%' }} column={2}>
                    <Descriptions.Item label="??????">{userInfo.nickname ? userInfo.nickname : '-'}</Descriptions.Item>
                    <Descriptions.Item label="??????">{userInfo.gender === undefined ? "-" : (userInfo.gender == 0 ? "???" : "???")}</Descriptions.Item>
                    <Descriptions.Item label="??????">{userInfo.email ? userInfo.email : '-'}</Descriptions.Item>
                    <Descriptions.Item label="?????????">{userInfo.phone_number ? userInfo.phone_number : '-'}</Descriptions.Item>
                </Descriptions>
            </Row>
        </Container>
        <Container style={{ width: '80%', marginTop: '1rem' }} hoverable={false}>
            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontSize: '20px' }}>
                <TeamOutlined />????????????
                <div style={{ display: 'flex', alignItems: 'center' }}
                    hidden={teamInfo == undefined || teamInfo?.leader.userid !== user?.userid}>
                    <a style={{ fontSize: '14px', marginLeft: '1em' }}
                        onClick={() => { getApply(); setDrawerVisible(true) }}>
                        ????????????
                    </a>
                    <Drawer
                        title="???????????????"
                        placement='right'
                        closable={true}
                        onClose={() => { setDrawerVisible(false) }}
                        visible={drawerVisible}
                        width='40%'
                    >
                        {
                            applyInfo?.map((item) => {
                                //console.log(item)
                                const res = <Container style={{
                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    marginBottom: '20px', border: 'solid',
                                    borderWidth: '0.5px', borderColor: 'grey'
                                }} hoverable={false}>
                                    <Member userInfo={item.user} applyid={item.id} />
                                </Container>
                                return res
                            })}
                    </Drawer>
                    <Popconfirm
                        title="???????????????????????????"
                        onConfirm={deleteTeam}
                        okText="???"
                        cancelText="???"
                    >
                        <a style={{ fontSize: '14px', marginLeft: '1em' }}>
                            ????????????
                        </a>
                    </Popconfirm>
                </div>
            </p>
            <div hidden={teamInfo != undefined}>
                <p style={{
                    marginLeft: '21px', display: 'flex', alignItems: 'center',
                    justifyContent: 'flex-start', fontSize: '20px', color: 'grey'
                }} hidden={false}>
                    ???????????????????????????
                </p>
                <Space>
                    <Button type="primary" onClick={() => setCreateVisible(true)} hidden={false}>
                        ????????????
                    </Button>
                    <Button type="primary" onClick={() => setSearchVisible(true)} hidden={false}>
                        ????????????
                    </Button>

                    <Button type="primary" onClick={() => { setMyApplyVisible(true); getMyApply()}} hidden={false}>
                        ????????????
                    </Button>
                </Space>
            </div>
            <div hidden={teamInfo == undefined}>
                <Divider style={{ marginTop: '10px', marginBottom: 0 }}></Divider>
            </div>
            <Row wrap={false} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1em' }} hidden={teamInfo == undefined}>
                <Container style={{
                    marginTop: '20px', width: '30%', border: 'solid',
                    borderWidth: '0.5px', borderColor: 'grey', height: 'fit-content'
                }} hoverable={false}>
                    <p style={{ fontSize: '18px', marginBottom: 0, display: 'flex', alignItems: 'center' }}>
                        <SearchOutlined />????????????
                    </p>
                    <Divider style={{ marginTop: '14px' }}></Divider>
                    <p style={{ fontSize: '18px' }}>
                        <span>????????????</span>
                        <span style={{ float: 'right' }}>{teamInfo?.name}</span>
                    </p>
                    <p>
                        <Row style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                            <span>????????????</span>
                            <div style={{ flexGrow: 1 }}></div>
                            <img style={{ height: '15%', width: '15%' }} src={teamInfo?.leader.avatar} alt=""></img>
                            <span style={{ marginLeft: '7px' }}>{teamInfo?.leader.username}</span>
                        </Row>
                    </p>
                    <p style={{ fontSize: '18px' }}>
                        ???????????????
                        <span style={{ float: 'right' }}>{teamInfo?.member_ids.length}???</span>
                    </p>
                    <p style={{ fontSize: '18px' }}>
                        ???????????????
                        <span style={{ float: 'right' }}> {moment(teamInfo?.create_time ? teamInfo?.create_time * 1000 : 0).format('YYYY / MM / DD')}</span>
                    </p>
                </Container>
                <Container style={{
                    marginTop: '20px', width: '65%', height: 'fit-content',
                    border: 'solid', borderWidth: '1px', borderColor: 'grey',
                }} hoverable={false}>
                    <p style={{ fontSize: '18px', marginBottom: 0, display: 'flex', alignItems: 'center' }}>
                        <MenuUnfoldOutlined />????????????
                    </p>
                    <Divider style={{ marginTop: '14px' }}></Divider>
                    {
                        teamInfo?.member_ids.map((item) => {
                            const res = <div style={{ marginBottom: '1em' }}>
                                <Member userInfo={item}
                                    isCreater={item.userid === teamInfo?.leader.userid}
                                    canOperate={teamInfo?.leader.userid === user?.userid && item.userid !== teamInfo?.leader.userid}
                                    teamid={teamInfo?.teamid}
                                    userid={item.userid}
                                /></div>
                            return res
                        })
                    }
                </Container>
            </Row>
        </Container>
        {/*??????*/}
        <Modal
            title="????????????"
            centered
            visible={createVisible}
            onOk={() => { createForm.submit() }}
            onCancel={() => { setCreateVisible(false); createForm.resetFields() }}
            width={600}
            maskClosable={false}
            okText="??????"
            cancelText="??????"
            bodyStyle={{ padding: '0 24px' }}
        >
            <Form labelCol={{ span: 8 }} onFinish={createTeam} form={createForm} style={{ marginTop: '24px' }}>
                <Form.Item wrapperCol={{ span: 10 }} name="teamname" label="?????????" >
                    <Row wrap={false}>
                        <Input onPressEnter={(e) => { e.preventDefault() }} />
                    </Row>
                </Form.Item>
            </Form>
        </Modal>
        {/*??????*/}
        <Modal
            title="????????????"
            centered
            visible={searchVisible}
            onCancel={() => setSearchVisible(false)}
            destroyOnClose={true}
            width='80%'
            maskClosable={false}
            footer={null}
            bodyStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0', width: '100%' }}
            style={{ marginTop: '1.5em' }}
        >
            <div style={{ background: 'rgb(247 247 247)', width: '100%' }}>
                <GroupSearch />
            </div>
        </Modal>
        {/*????????????*/}
        <Modal
            title="????????????"
            centered
            visible={myApplyVisible}
            onCancel={() => { setMyApplyVisible(false); }}
            width={800}
            maskClosable={false}
            footer={null}
        >
        </Modal>
        <Modal
            title="????????????"
            centered
            visible={settingVisible}
            onCancel={() => { setSettingVisible(false); }}
            width={1000}
            maskClosable={false}
            footer={null}
        >
            <Layout style={{ color: '#fff' }}>
                <Sider
                    style={{
                        padding: '0 0',
                        background: '#fff',
                    }}
                    width='15%'
                    collapsed={false}
                >
                    <Menu theme="light" mode="inline" onSelect={onSelectSettingMenu} style={{}}>
                        <Menu.Item key="1" icon={<FormOutlined />}>????????????</Menu.Item>
                        <Menu.Item key="2" icon={<LockOutlined />}>????????????</Menu.Item>
                    </Menu>
                </Sider>
                <Content style={{ margin: '1.5em 1.5em', background: '#fff' }} hidden={selectedSettingMenu == "sub1"}>
                    <div style={{ padding: '1.5em 0' }} hidden={selectedSettingMenu != "1"}>
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
                    <div style={{ padding: '1.5em 0' }} hidden={selectedSettingMenu != "2"}>
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
        </Modal>
    </Basement >
}

export default Broker;