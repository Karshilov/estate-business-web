import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Login from '../pages/Login';
import { StoreState } from "../store";

type Props = {
  history?: any;
  children?: React.ReactNode
}


const AuthGuard: React.FC<Props> = ({ children, history }: Props) => {
  const dispatch = useDispatch();

// 获取登录状态
  const { isLogin } = useSelector((state: StoreState) => state);

// token过期检验待添加

  return <>{isLogin ? children : <Login isPrepared={true} />}</>;
};

export default AuthGuard