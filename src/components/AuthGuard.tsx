import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Login from '../pages/Login';
import { StoreState } from "../store";
import { useApi } from "../utils/api";

type Props = {
  history?: any;
  children?: React.ReactNode
}


const AuthGuard: React.FC<Props> = ({ children, history }: Props) => {
  const dispatch = useDispatch();
  const api = useApi();

// 获取登录状态
  const { isLogin } = useSelector((state: StoreState) => state);

  const getResult = async () => {
    const res = await api.get('/test');
    return res.data.success;
  }

// token过期检验待添加
  useEffect(() => {
    getResult().then((value) => {
      if (value) return;
      else {
        dispatch({ type: 'logout' });
      }
    })
  }, [])

  return <>{isLogin ? children : <Login isPrepared={true} />}</>;
};

export default AuthGuard