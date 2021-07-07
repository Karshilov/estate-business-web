import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { EInput, Container, Basement, Layer } from '../components/BasicHTMLElement';
import { Alert, Button, Carousel, Form, Input, message, Row, Col } from 'antd';
import { banner } from '../utils/banner'
import borkerAvatar from '../assets/avatar/broker-default.svg';
import userAvatar from '../assets/avatar/user-default.svg';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import primaryIcon from '../assets/primary-icon.png';
import { staticApi } from "../utils/api";


const Register = () => {
    const [chosen, setChosen] = useState(false);
    const [userOrBroker, setUserOrBroker] = useState(false);
    const history = useHistory();

    const onChoose = (role: boolean) => {
        setUserOrBroker(role);
        setChosen(true);
    }

    const onFinish = async (values: any) => {
        const checkReg = /\s+/;
        console.log(values)
        if (values.password !== values.repeat) message.error('两次密码不一致')
        else {
            if (!values.username) message.error('用户名不要为空')
            else if (!values.nickname) message.error('昵称不要为空')
            else if (!values.email) message.error('邮件不得为空')
            else if (!values.password) message.error('密码不得为空')
            else if (values.username.search(checkReg) !== -1) message.error('请不要使用空白字符')
            else if (values.password.search(checkReg) !== -1) message.error('请不要使用空白字符')
            else if (values.email.search(checkReg) !== -1) message.error('请不要使用空白字符')
            else if (values.nickname.search(checkReg) !== -1) message.error('请不要使用空白字符')
            else {
                const res = await staticApi.post('/signup', {
                    username: values.username,
                    password: values.password,
                    nickname: values.nickname,
                    email: values.email,
                    role: userOrBroker ? 'client' : 'broker'
                });
                if (res.data.success) {
                    message.success('注册成功！3秒钟后自动跳转登录')
                    setTimeout(() => {
                        history.push('/login')
                    }, 3000);
                    return;
                } else {
                    message.warning(res.data.reason)
                    return;
                }
            }
        }
    };

    return <Basement style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '80%', textAlign: 'center', padding: 50 }}>
            <Carousel autoplay autoplaySpeed={4000} easing="ease-in-out">
                {banner.map((item, index) => <div key={index}>
                    <h3 style={{
                        height: '240px',
                        color: '#fff',
                        lineHeight: '240px',
                        textAlign: 'center',
                        background: '#5DAC81',
                        fontSize: 32
                    }}>{item}</h3>
                </div>)}
            </Carousel>
            <SwitchTransition>
                <CSSTransition key={chosen ? 'yes' : 'no'} addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}
                    classNames='fade'>
                    {chosen ? <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                        <Container style={{ width: '80%' }}
                            bodyStyle={{ width: '100%', display: 'flex' }}
                        >
                            <div style={{ width: '45%' }}>
                                <img src={primaryIcon} alt="" style={{ fill: '#00896c', height: 40, marginLeft: '8%' }} />
                                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: 10, fontSize: 20 }}>
                                    <h1>{userOrBroker ? '租客注册' : '经纪人注册'}</h1>
                                </div>
                                <Form style={{ marginTop: 10 }} labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }} onFinish={onFinish}>
                                    <Form.Item name="username" label="用户名"><Input /></Form.Item>
                                    <Form.Item name="password" label="密码"><Input.Password /></Form.Item>
                                    <Form.Item name="repeat" label="确认密码"><Input.Password /></Form.Item>
                                    <Form.Item name="email" label="邮箱"><Input /></Form.Item>
                                    <Form.Item name="nickname" label="昵称"><Input /></Form.Item>
                                    <Form.Item name="role" label="身份">
                                        <div style={{display: 'flex', justifyContent: 'flex-start'}}>{userOrBroker ? '租客' : '经纪人'}</div>
                                    </Form.Item>
                                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                        <Button type="primary" htmlType="submit">确认注册</Button>
                                    </Form.Item>
                                </Form>
                                <div style={{ marginTop: 40 }}>
                                    <p style={{ fontSize: 10, fontWeight: 500 }}>注意: 每个账号只能绑定一种身份</p>
                                </div>
                            </div>
                            <div style={{ width: '55%', paddingLeft: '10%', paddingTop: 40 }}>
                                <h3 style={{
                                    height: '300px',
                                    color: '#fff',
                                    lineHeight: '300px',
                                    textAlign: 'center',
                                    background: '#5DAC81',
                                    fontSize: 32,
                                }}>这里应该有张图</h3>
                            </div>
                        </Container>
                    </div>
                        : <div style={{ width: '100%', display: 'flex', flexDirection: 'row', marginTop: 40 }}>
                            <div style={{ flexGrow: 2 }}></div>
                            <Container style={{ width: '30%', margin: 10 }}
                                bodyStyle={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                                onClick={() => { onChoose(false) }}
                            >
                                <img src={borkerAvatar} alt="" width="70%"></img>
                                <div style={{ marginTop: '4%', fontSize: 30, fontWeight: 600 }}>注册经纪人</div>
                            </Container>
                            <div style={{ flexGrow: 1 }}></div>
                            <Container style={{ width: '30%', margin: 10 }}
                                bodyStyle={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                                onClick={() => { onChoose(true) }}
                            >
                                <img src={userAvatar} alt="" width="80%" style={{ marginTop: '-4%' }}></img>
                                <div style={{ fontSize: 30, fontWeight: 600 }}>注册租客</div>
                            </Container>
                            <div style={{ flexGrow: 2 }}></div>
                        </div>}
                </CSSTransition>
            </SwitchTransition>
        </div>
    </Basement>
};

export default Register;