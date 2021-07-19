import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { EInput, Container, Basement, Layer } from '../components/BasicHTMLElement';
import { Alert, Button, Carousel, Form, Input, message } from 'antd';
import { banner } from '../utils/banner'
import borkerAvatar from '../assets/avatar/broker-default.svg';
import userAvatar from '../assets/avatar/user-default.svg';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import primaryIcon from '../assets/primary-icon.png';
import { staticApi } from "../utils/api";
import { useDispatch } from 'react-redux';
declare let TMap: any;

const Login = (props: { isPrepared?: boolean }) => {
  const [chosen, setChosen] = useState(false);
  const [userOrBroker, setUserOrBroker] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const onChoose = (role: boolean) => {
    setUserOrBroker(role);
    setChosen(true);
  }

  const onFinish = async (values: any) => {
    const checkReg = /\s+/;
    if (!values.username) message.error('用户名不要为空')
    else if (!values.password) message.error('密码不得为空')
    else if (values.username.search(checkReg) !== -1) message.error('请不要使用空白字符')
    else if (values.password.search(checkReg) !== -1) message.error('请不要使用空白字符')
    else {
      const res = await staticApi.post('/auth', {
        username: values.username,
        password: values.password,
      });
      if (res.data.success) {
        console.log(res.data)
        dispatch({ type: 'user', payload: res.data.result})
        dispatch({ type: 'login', payload: res.data.result.token })
      } else {
        message.warning(res.data.reason)
        return;
      }
      if (!props.isPrepared) {
        history.push('/');
      }
    }
  };

  return <Basement style={{ display: 'flex', justifyContent: 'center', paddingTop: 50 }}>
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
                  <h1>{userOrBroker ? '租客登录' : '经纪人登录'}</h1>
                </div>
                <Form style={{ marginTop: 10 }} labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }} onFinish={onFinish}>
                  <Form.Item name="username" label="用户名"><Input /></Form.Item>
                  <Form.Item name="password" label="密码"><Input.Password /></Form.Item>
                  <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
                    <Button type="primary" htmlType="submit">登录</Button>
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
                <div style={{ marginTop: '4%', fontSize: 30, fontWeight: 600 }}>经纪人登录</div>
              </Container>
              <div style={{ flexGrow: 1 }}></div>
              <Container style={{ width: '30%', margin: 10 }}
                bodyStyle={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                onClick={() => { onChoose(true) }}
              >
                <img src={userAvatar} alt="" width="80%" style={{ marginTop: '-4%' }}></img>
                <div style={{ fontSize: 30, fontWeight: 600 }}>租客登录</div>
              </Container>
              <div style={{ flexGrow: 2 }}></div>
            </div>}
        </CSSTransition>
      </SwitchTransition>
    </div>
  </Basement>
};

export default Login;