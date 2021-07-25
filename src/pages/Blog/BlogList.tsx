import React, { useState, useEffect, ReactElement, Component } from 'react';
import {
    Typography, Button, Input, Layout, Avatar, Tag, Card,
    Row, Col, Divider, Spin,
    Select, message,
} from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { StoreState } from "../../store";
import { useSelector } from 'react-redux';
import { EditOutlined, FireOutlined, FireTwoTone, MoreOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroller';
import { useApi } from '../../utils/api';
import moment from 'moment';
import { Container } from '../../components/BasicHTMLElement';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;
const { Option } = Select;

//ID, TITLE, ABSTRACT, CREATE_TIME, MODIFY_TIME
interface QuestionDetail {
    id: string;
    abstract: string;
    title: string;
    create_time: number;
    modify_time: number;
}

const BlogList = ((props: { match: any }) => {
    const history = useHistory();
    const [searchText, setSearchText] = useState('');
    const [questionList, setQuestionList] = useState<Array<QuestionDetail>>([]);
    const [totalNumber, setTotalNumber] = useState(50);
    const [totalPage, setTotalPage] = useState(0);
    const [pageAndPageSize, setPageAndPageSize] = useState([1, 10]);
    const [desc, setDesc] = useState(true);
    const [imgUrl, setImgUrl] = useState('');
    const [dataLoading, setDataloading] = useState(true);
    const { user } = useSelector((state: StoreState) => state, (left: StoreState, right: StoreState) => left.user?.username === right.user?.username)
    const id = props.match.params.id;

    const api = useApi();

    const loadQuestionList = async () => {
        setDataloading(true);
        const res = await api.get('/blog/list', {
            params: {
                userid: id ?? undefined,
                page_num: pageAndPageSize[0],
                page_size: pageAndPageSize[1],
                desc,
                order_by: 'time',
                keyword: searchText,
            },
        });
        if (!res.data.success) {
            message.error(res.data.reason);
            return;
        }
        setTotalNumber(res.data.result.total);
        setQuestionList(res.data.result.list);
        setDataloading(false);
    };

    const handleInfiniteOnLoad = async () => {
        if (pageAndPageSize[0] >= totalPage) return;
        setDataloading(true);
        let tmp = questionList;
        const res = await api.get('/blog/list', {
            params: {
                userid: id ?? undefined,
                page_num: pageAndPageSize[0],
                page_size: pageAndPageSize[1],
                desc,
                order_by: 'time',
                keyword: searchText,
            },
        });
        if (!res.data.success) {
            message.error(res.data.reason);
        } else {
            setPageAndPageSize([pageAndPageSize[0] + 1, pageAndPageSize[1]]);
            tmp = tmp.concat(res.data.result.list);
            setQuestionList(tmp);
        }

        setDataloading(false);
    };
    useEffect(() => {
        setPageAndPageSize([1, 10]);
        loadQuestionList();
    }, []);
    
    useEffect(() => {
        setPageAndPageSize([1, 10]);
        loadQuestionList();
    }, [searchText, desc]);

    const hasMore = () => questionList.length <= totalNumber;

    return (
        <Container style={{ width: '70%', marginTop: 50, marginLeft: '15%', marginRight: '15%' }} bodyStyle={{ width: '100%', paddingBlock: 35 }}>
            <Spin tip="正在全力加载中～" spinning={dataLoading}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column' }}>
                    <div style={{ maxWidth: '800px', minWidth: '800px' }}>
                        <Input.Group compact>
                            <Search style={{ width: '100%' }} placeholder="请输入搜索关键词" onSearch={(value: string) => {
                                setSearchText(value);
                            }} enterButton></Search></Input.Group>
                        <div style={{ width: '100%', display: 'flex', marginTop: 10, paddingBlock: 5, marginBottom: 10 }}>
                            <Text style={{ fontSize: '1rem', marginRight: 30 }} strong>排序方式</Text>
                            <Text style={{ fontSize: '1rem', color: '#00896c', marginRight: 20, cursor: 'pointer' }}
                                strong>
                                按发布时间 {desc ?
                                    <CaretUpOutlined onClick={() => { setDesc(!desc) }} /> :
                                    <CaretDownOutlined />}
                            </Text>
                        </div>
                        <Divider></Divider>
                        <div style={{ width: '100%' }}>
                            <InfiniteScroll
                                initialLoad={false}
                                pageStart={0}
                                loadMore={handleInfiniteOnLoad}
                                hasMore={hasMore()}
                            >
                                {questionList.map((item, index) => <div
                                    key={item.id}
                                    style={{ marginTop: '10px', cursor: 'pointer' }}
                                    onClick={() => {
                                        history.push(`/blog-detail/${item.id}`);
                                    }}
                                >
                                    <div style={{ lineHeight: 1.618033, width: '100%', paddingBlock: 7, paddingInline: 20, boxSizing: 'border-box', display: 'flex' }}>
                                        <div style={{ fontSize: '1rem', fontWeight: 550 }}>{item.title}</div>
                                        <div style={{ flexGrow: 1 }}></div>
                                        <div style={{ fontSize: '1rem', color: '#333' }}>{moment(item.create_time * 1000).format('YYYY/MM/DD')}</div>
                                    </div>
                                    <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }} style={{ paddingInline: 20, color: '#333' }}>
                                        {item.abstract}
                                    </Paragraph>
                                    <Divider />
                                </div>)}
                            </InfiniteScroll>
                        </div>
                    </div>
                </div>
            </Spin>
        </Container >
    );
});

export default BlogList;
