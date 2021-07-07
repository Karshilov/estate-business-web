import React, { useState, useEffect } from "react";
import { Basement, Layer } from "../components/BasicHTMLElement";
import { useHistory } from 'react-router-dom';
import { Input, Button, Avatar } from 'antd'
import homeIcon from '../assets/home/header-icon.svg';
import titleImg from '../assets/home/title.svg';
import numIcon from '../assets/home/num-icon.svg';
import userIcon from '../assets/home/user-icon.svg';
import cooperationIcon from '../assets/home/cooperation-icon.svg';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from "../store";
import { options } from '../utils/options'
import { AntDesignOutlined, LogoutOutlined } from '@ant-design/icons'

const Home = () => {
  const history = useHistory();
  const [searchText, setSearchText] = useState('');
  const { isLogin, apiToken } = useSelector((state: StoreState) => state);
  const dispatch = useDispatch();

  const logout = () => {
    dispatch({ type: 'logout'});
    history.push('/login');
  }

  const hoverTransform = "transition duration-300 linear transform hover:scale-110";

  const gotoGenerator = (value: string, params: any = undefined) => {
    return () => {
      if (params) history.push(value, params);
      else history.push(value);
    }
  }

  return <Basement>
    <Layer className="home-bg">
      <Layer className="mask">
        <div className="remain-container">
          <Layer>
            <img src={numIcon} alt="" height={60} style={{ position: 'absolute', right: '12%', top: '20%' }} />
          </Layer>
          <Layer>
            <img src={userIcon} alt="" height={80} style={{ position: 'absolute', right: '8%', top: '65%' }} />
          </Layer>
          <Layer>
            <img src={cooperationIcon} alt="" height={100} style={{ position: 'absolute', left: '30%', bottom: '10%' }} />
          </Layer>
          <div style={{ flexGrow: 2 }}></div>
          <img src={titleImg} alt="" width="30%" style={{ margin: 40 }} />
          <Input.Search
            value={searchText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearchText(e.target.value) }}
            placeholder="请输入房源信息进行检索"
            allowClear
            style={{ width: '45%' }}
            enterButton="搜索"
            onSearch={gotoGenerator('search', { keywords: searchText })}
          />
          <div style={{ flexGrow: 3 }}></div>
        </div>
        <div className="head-container">
          <div className="head-icon" style={{ marginLeft: '10%' }}>
            <img src={homeIcon} alt="" height={50} />
          </div>
          <div style={{ flexGrow: 1 }} />
          {options.map((opt) => <div key={opt.path}
            className={"head-option " + hoverTransform} style={{ margin: 20 }} onClick={gotoGenerator(opt.path)}>
            {opt.label}
          </div>)}
          <div style={{ flexGrow: 1 }} />
          <div className={"head-option " + hoverTransform} style={{ margin: 20 }} onClick={gotoGenerator('register')} hidden={isLogin}>注册</div>
          <button
            className={"head-option bg-prim p-3 " + hoverTransform}
            style={{
              borderRadius: 6,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              filter: 'drop-shadow(3px 3px 4px rgba(0, 0, 0, 0.25))',
              marginRight: 40,
              outline: 'none',
            }}
            type="button"
            onClick={gotoGenerator('login')}
            hidden={isLogin}
          >登录</button>
          <div hidden={!isLogin} style={{ margin: 20 }}>
            <Avatar size={36}
              icon={<AntDesignOutlined />}>
            </Avatar>
          </div>
          <LogoutOutlined size={36} hidden={!isLogin} style={{ marginRight: 40, fontSize: 32 }} onClick={logout}></LogoutOutlined>
        </div>
      </Layer>
    </Layer>
  </Basement>
}

export default Home;