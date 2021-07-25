import React, { useState, useEffect } from "react";
import moment from 'moment';
import { useHistory } from "react-router-dom";
import { Avatar } from 'antd'

const RichAvatar = (props: { src: string | any, style?: React.CSSProperties, id: string }) => {
    const history = useHistory();

    const onClick = () => {
        history.push(`/personal-page/${props.id}`);
    }

    return <Avatar style={props.style} src={props.src}></Avatar>
}

export default RichAvatar;