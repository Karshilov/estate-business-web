import React, { useState, useEffect } from "react";
import moment from 'moment';
import { useHistory } from "react-router-dom";
import { Avatar } from 'antd'

const RichAvatar = (props: { src: string | any, style?: React.CSSProperties, id: string | any, size?: number }) => {
    const history = useHistory();

    const onClick = () => {
        history.push(`/personal-page/${props.id}`);
    }

    return <div onClick={onClick}><Avatar style={props.style} src={props.src} size={props.size ?? 32}></Avatar></div>
}

export default RichAvatar;