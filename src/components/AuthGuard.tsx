import React, { useState, useEffect } from "react";

type Props = {
    history?: any;
    children?: React.ReactNode
  }
  

const AuthGuard: React.FC<Props> = ({ children, history }: Props) => {
    return <>{children}</>
};

export default AuthGuard