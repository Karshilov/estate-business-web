import { message, Typography, Row, Col } from "antd";
import React, { useState, useEffect } from "react";
import { useApi } from "../../../utils/api";
import RecommendItem from "../../RecommendItem";

const { Text } = Typography;
//ID, TITLE, PHOTOS, AREA, CREATE_TIME, FLOOR, TOTAL_FLOOR, PRICE, FEATURES
interface RecommendDetailModel {
  id: string;
  title: string;
  cover: string;
  area: number;
  create_time: number;
  floor: number;
  total: number;
  price: number;
  features: string[];
}

const HouseReco = () => {

  const api = useApi();
  const [recoList, setRecoList] = useState<Array<RecommendDetailModel>>([])

  const getRecoList = async () => {
    const res = await api.get('/rent/recommend', { params: { n: 8 } })
    console.log(res.data)
    if (res.data.success) {
      setRecoList(res.data.result);
    } else {
      message.error(res.data.reason);
    }
  }

  useEffect(() => {
    getRecoList();
  }, [])

  return <div style={{ width: '100%', marginInline: '40px', marginTop: 40 }} id="house-reco">
    <Text style={{ fontSize: '1.5rem' }} strong>推荐房源</Text>
    <div style={{ width: '100%', marginTop: 20 }}>
      <Row>
        <Col span={6} style={{ padding: 10 }}>{recoList[0] ? <RecommendItem data={recoList[0]} /> : null}</Col>
        <Col span={6} style={{ padding: 10 }}>{recoList[1] ? <RecommendItem data={recoList[1]} /> : null}</Col>
        <Col span={6} style={{ padding: 10 }}>{recoList[2] ? <RecommendItem data={recoList[2]} /> : null}</Col>
        <Col span={6} style={{ padding: 10 }}>{recoList[3] ? <RecommendItem data={recoList[3]} /> : null}</Col>
      </Row>
      <Row>
        <Col span={6} style={{ padding: 10 }}>{recoList[4] ? <RecommendItem data={recoList[4]} /> : null}</Col>
        <Col span={6} style={{ padding: 10 }}>{recoList[5] ? <RecommendItem data={recoList[5]} /> : null}</Col>
        <Col span={6} style={{ padding: 10 }}>{recoList[6] ? <RecommendItem data={recoList[6]} /> : null}</Col>
        <Col span={6} style={{ padding: 10 }}>{recoList[7] ? <RecommendItem data={recoList[7]} /> : null}</Col>
      </Row>
    </div>
  </div>
}

export default HouseReco;