import React, { useState, useEffect } from "react";
import moment from 'moment';
import { message, Skeleton } from "antd";
import { Container } from "../../components/BasicHTMLElement";
import { useApi } from "../../utils/api";
import RichAvatar from "../../components/RichAvatar";
import ReactHtmlParser from 'react-html-parser';

interface BlogDetailModel {
    id: string;
    abstract: string;
    body: string;
    title: string;
    create_time: number;
    modiy_time: number;
    user: {
        username: string;
        avatar: string;
        nickname: string;
        gender: number;
        userid: string;
    }
}

const BlogDetail = (props: { match: any }) => {
    const id = props.match.params.id;
    const [detail, setDetail] = useState<BlogDetailModel | undefined>(undefined)
    const api = useApi();

    const getDetail = async () => {
        const res = await api.get('/blog/detail', { params: { id } })
        console.log(res.data.result)
        if (res.data.success) {
            setDetail(res.data.result);
        } else {
            message.error(res.data.reason)
        }
    }

    useEffect(() => {
        getDetail();
    }, [])

    const transform = function (node: any) {
        if (node.type === 'script') {
            return null;
        }
    }


    return <Container style={{ width: '70%', marginTop: 50, marginLeft: '15%', marginRight: '15%' }} bodyStyle={{ width: '100%', paddingBlock: 35, paddingInline: 30 }}>
        {detail ? <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 25 }}>{detail.title}</div>
            <div id="head-line" style={{ display: 'flex', alignItems: 'center' }} >
                <RichAvatar src={detail.user.avatar} id={detail.user.userid} style={{ marginRight: 10 }} size={48} />
                <div id="user" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{detail.user.nickname}</span>
                    <span style={{ color: '#333' }}>{moment(detail.create_time * 1000).format('YYYY/MM/DD')}</span>
                </div>
            </div>
            <div style={{ marginTop: 25 }} className="ck-blurred ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline">{ReactHtmlParser(detail.body, { transform })}</div>
        </div> : <Skeleton avatar paragraph={{ rows: 6 }} />}
    </Container>
}

export default BlogDetail;