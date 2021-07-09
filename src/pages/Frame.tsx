import React, { useEffect, useState } from "react";
import { Basement, Layer } from "../components/BasicHTMLElement";
import { Link, useHistory } from 'react-router-dom';
import { options } from '../utils/options'
import { StoreState } from "../store";
import { useSelector } from 'react-redux';
import { Avatar, Layout } from "antd";
import { AntDesignOutlined, LogoutOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux';
import primaryIcon from '../assets/primary-icon.png';
declare let TMap: any;

type Props = {
  history: any;
  children: React.ReactNode
}

const Frame = ({ children, history }: Props) => {
  const hoverTransform = "transition duration-300 linear transform hover:scale-110";
  const { isLogin, apiToken } = useSelector((state: StoreState) => state);
  const dispatch = useDispatch();
  const route = useHistory();

  const logout = () => {
    dispatch({ type: 'logout' });
    route.push('/login');
  }

  const goHome = () => {
    route.push('/');
  }

  console.log(history.location.pathname)

  return history.location.pathname === '/' ? <>{children}</> : <div style={{ background: '#f7f7f7', minHeight: '100%', position: 'relative', width: '100%' }}>
    <Basement style={{ paddingTop: history.location.pathname === '/' ? 0 : 80 }}>
      {children}
    </Basement>
    <Layer hidden={history.location.pathname === '/'} style={{ bottom: 'calc(100% - 90px)' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 80,
          display: 'flex',
          alignItems: 'center',
          boxShadow: '4px 4px 4px rgba(11, 52, 110, 0.15)',
          background: '#F2F2F8'
        }}
      >
        <div className="head-icon" style={{ marginLeft: '10%' }}>
          <img src={primaryIcon} alt="" style={{ height: 40 }} onClick={goHome} />
          <label className="font-semibold" style={{ color: '#00896C', fontSize: 20 }} onClick={goHome}>檐椽网</label>
        </div>
        <div style={{ flexGrow: 1 }} />
        {options.map((item) =>
          <div className={`frame-option ${hoverTransform}`} style={{
            margin: 20
          }}
            key={item.path}
          >
            <Link to={item.path} style={{
              color: history.location.pathname === item.path ? '#000' : '#4B5563',
              fontWeight: history.location.pathname === item.path ? 600 : 400,
            }}>{item.label}</Link></div>)}
        <div style={{ flexGrow: 1 }} />
        <div className={"frame-option " + hoverTransform} style={{ margin: 20 }} hidden={isLogin}>
          <Link to='/register' style={{ color: '#000' }}>注册</Link>
        </div>
        <button
          className={"head-option bg-prim p-3 " + hoverTransform}
          style={{
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            filter: 'drop-shadow(3px 3px 4px rgba(0, 0, 0, 0.25))',
            marginRight: 40,
            outline: 'none',
          }}
          type="button"
          hidden={isLogin}
        ><Link to='/login' style={{ color: '#fff' }}>登录</Link></button>
        <div hidden={!isLogin} style={{ margin: 20 }}>
          <Avatar size={36}
            icon={<AntDesignOutlined />}>
          </Avatar>
        </div>
        <LogoutOutlined hidden={!isLogin} style={{ marginRight: 40, fontSize: 32 }} onClick={logout}></LogoutOutlined>
      </div>
    </Layer>
    <Layout.Footer style={{ textAlign: 'center', background: '#f7f7f7' }}>
      Copyright © 2021 All Rights Reserved | Karshilov
    </Layout.Footer>
  </div>;
}

export default Frame;

