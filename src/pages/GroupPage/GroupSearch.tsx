import React, { useState, useEffect } from "react";
import { Basement, Layer, Container } from "../../components/BasicHTMLElement";
import { useHistory } from 'react-router-dom';
import { Button, Col, Form, Input, Row, message, Select, Pagination, Typography } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { tmapApi, useApi, apiKey } from "../../utils/api";
import { GroupDetailModel, SearchItemModel, } from "../../utils/DataModel";
import { SearchOutlined } from "@ant-design/icons";
import { city } from '../../utils/city'
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import GroupList from "../../components/MemberList/GroupList"
const { Text, Title } = Typography;


const GroupSearch = () => {
    const [searchText, setSearchText] = useState("");
    const [totalNum, setTotalNum] = useState(0);
    const [pageAndPageSize, setPageAndPageSize] = useState([1, 20]);
    const [resourceList, setResourceList] = useState<Array<GroupDetailModel>>([])
    const api = useApi();

    const getResourceList = async () => {
        const res = await api.get('/team/list', {
            params: {
                name: searchText,
                page_num: pageAndPageSize[0],
                page_size: pageAndPageSize[1],
            }
        })
        console.log("list", res)
        if (res.data.success) {
            setResourceList(res.data.result.list)
            setTotalNum(res.data.result.total)
        } else {
            message.error(res.data.reason)
        }
    }

    useEffect(() => {
        getResourceList()

    }, [pageAndPageSize, searchText])

    return <Basement style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '65%', background: '#fff', marginBottom: 40, marginTop: 20 }} className="shadow-sm">
            <Input.Group compact style={{ marginTop: 40, marginBottom: 20, marginLeft: 40, height: 40 }}>
                <Input.Search style={{ width: '50%' }} placeholder="请输入团队名进行搜索" enterButton={<Button type="primary">点击搜索</Button>}
                    onSearch={(value: string) => {
                        setSearchText(value)
                    }} />
            </Input.Group>
        </div>
        <div style={{ width: '65%', background: '#fff' }} className="shadow-md">
            <GroupList list={resourceList}></GroupList>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }} className="m-8">
                <Pagination {...{ defaultCurrent: 1, pageSize: pageAndPageSize[1], total: totalNum, showSizeChanger: false }} responsive onChange={(pg, pgsz) => {
                    setPageAndPageSize([pg, pageAndPageSize[1]]);
                }} />
            </div>
        </div>
    </Basement>
}
export default GroupSearch;