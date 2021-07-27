import React, { useState, useEffect } from "react";
import moment from 'moment';
import { Button, message, Popconfirm, Skeleton } from "antd";
import { Container } from "../../components/BasicHTMLElement";
import { useApi } from "../../utils/api";
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from "../../store";
import { useHistory } from "react-router-dom";
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
    const { isLogin, user } = useSelector((state: StoreState) => state);
    const [detail, setDetail] = useState<BlogDetailModel | undefined>(undefined)
    const [visible, setVisible] = useState(false);
    const api = useApi();
    const history = useHistory();

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

    function gotoModify () {
        history.push(`/blog-publish/${id}`)
    }

    async function onConfirm(e: any) {
        const res = await api.delete('/blog/detail', { params: { id } })
        if (res.data.success) {
            message.success('删除成功')
        } else {
            message.error(res.data.reason)
        }
        setVisible(false);
        history.go(-1);
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
                <div style={{ flexGrow: 1 }}></div>
                <div hidden={user === undefined || user.userid === detail.user.userid}>
                    <Button style={{ marginRight: 20 }} type="primary" onClick={gotoModify}>修改博客</Button>
                    <Popconfirm
                        title="确定删除吗?"
                        onConfirm={onConfirm}
                        onCancel={() => { setVisible(false) }}
                        visible={visible}
                        okText="确定"
                        cancelText="取消"
                    ><Button style={{ marginRight: 20 }} type="default" onClick={ () => { setVisible(true)} }>删除博客</Button>
                    </Popconfirm>
                </div>
            </div>
            <div style={{ marginTop: 25 }} className="ck-blurred ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline">{ReactHtmlParser(detail.body, { transform })}</div>
        </div> : <Skeleton avatar paragraph={{ rows: 6 }} />}
    </Container>
}

export default BlogDetail;