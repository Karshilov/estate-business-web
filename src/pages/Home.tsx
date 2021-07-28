import React, { useState, useEffect } from "react";
import { Basement, Layer } from "../components/BasicHTMLElement";
import { useHistory } from 'react-router-dom';
import { Input, Button, Avatar, message, Select, Layout } from 'antd'
import homeIcon from '../assets/home/header-icon.svg';
import titleImg from '../assets/home/title.svg';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from "../store";
import { options } from '../utils/options'
import { city } from '../utils/city'
import { AntDesignOutlined, LogoutOutlined } from '@ant-design/icons'
import { useApi } from "../utils/api";
import HouseReco from '../components/DetailInfo/Panels/HouseReco'

const Home = () => {
  const history = useHistory();
  const [searchText, setSearchText] = useState('');
  const { isLogin, user } = useSelector((state: StoreState) => state);
  const api = useApi();
  const [avatarSrc, setAvatarSrc] = useState('')
  const [citySelect, setCitySelect] = useState('南京');
  const dispatch = useDispatch();

  const getUrl = async (value: string) => {
    const res = await api.get('/minio', { params: { type: 'avatar', name: value } })
    if (res.data.success) {
      setAvatarSrc(res.data.result);
    } else {
      message.error(res.data.reason);
    }
  }

  useEffect(() => {
    if (user) {
      getUrl(user?.avatar);
    }
  }, [])


  const logout = () => {
    dispatch({ type: 'logout' });
    history.push('/login');
  }

  const hoverTransform = "transition duration-300 linear transform hover:scale-110";

  const gotoGenerator = (value: string, params: any = undefined) => {
    return () => {
      if (params) history.push(`${value}/${params}`);
      else history.push(value);
    }
  }

  return <Basement>
    <Layer style={{ bottom: 'none', top: '75%', left: '15%', right: '15%' }}>
      <HouseReco></HouseReco>
      <Layout.Footer style={{ textAlign: 'center', background: '#fff' }}>
        Copyright © 2021 All Rights Reserved | Karshilov & Shane
      </Layout.Footer>
    </Layer>
    <Layer className="home-bg">
      <Layer className="mask" style={{ bottom: '25%' }}>
        <div className="remain-container">
          <div style={{ flexGrow: 3 }}></div>
          <div style={{ width: '100%', display: 'flex' }}>
            <div style={{ width: 'calc( 100px + 8% )' }}></div>
            <img src={titleImg} alt="" width="30%" style={{ marginTop: 40, marginBottom: 40 }} />
          </div>
          <div style={{ width: '100%', display: 'flex' }}>
            <div style={{ width: 'calc( 100px + 8% )' }}></div>
            <Input.Group>
              <Select defaultValue="南京" value={citySelect} onChange={(value, option) => { setCitySelect(value) }} size="large">
                {city.map(item => <Select.Option value={item} key={item}>{item}</Select.Option>)}
              </Select>
              <Input.Search
                value={searchText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearchText(e.target.value) }}
                placeholder="请输入房源信息进行检索"
                allowClear
                style={{ width: '45%' }}
                enterButton="搜索"
                size="large"
                onSearch={gotoGenerator('/rent-search', `${citySelect}@${searchText}`)}
              /></Input.Group>
          </div>
          <div style={{ flexGrow: 4 }}></div>
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
              src={avatarSrc}
            >
            </Avatar>
          </div>
          <LogoutOutlined size={36} hidden={!isLogin} style={{ marginRight: 40, fontSize: 32 }} onClick={logout}></LogoutOutlined>
        </div>
      </Layer>
    </Layer>
  </Basement>
}

export default Home;