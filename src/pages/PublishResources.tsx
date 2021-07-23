import React, { useEffect, useState, useRef, createElement } from "react";
import { Basement, Layer, Container } from "../components/BasicHTMLElement";
import InlineMultipleInput from '../components/InlineMultipleInput';
import { useHistory } from 'react-router-dom';
import { Button, Col, Form, Input, Row, Tabs, Steps, Select, Upload, Radio, Tooltip, Tag, message } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { useApi, staticApi, usePostImg } from "../utils/api";
import { StoreState } from "../store";
import { HomeOutlined, FormOutlined, AuditOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons'
import WashIcon from '../assets/equipments/wash.svg'
import AirCondIcon from '../assets/equipments/aircond.svg'
import BedIcon from '../assets/equipments/bed.svg'
import GasIcon from '../assets/equipments/gas.svg'
import RefrigeratorIcon from '../assets/equipments/refrigerator.svg'
import TVIcon from '../assets/equipments/tv.svg'
import WardrobeIcon from '../assets/equipments/wardrobe.svg'
import WarmIcon from '../assets/equipments/warm.svg'
import WaterHeaterIcon from '../assets/equipments/wheater.svg'
import WifiIcon from '../assets/equipments/wifi.svg'
import { count } from "yargs";
import { convertTypeAcquisitionFromJson, transpileModule } from "typescript";


declare let TMap: any;


const { CheckableTag } = Tag;

const PublishResources = () => {
  const history = useHistory();
  const [rentOrSell, setRentOrSell] = useState('rent');
  let mapIns: any = {};
  let markerLayer: any = {};
  const [price, setPrice] = useState(0);
  const ref = useRef(null);
  const api = useApi();
  const api2 = usePostImg();
  const [step, setStep] = useState(0);
  const [rentForm] = Form.useForm();
  const [sellForm] = Form.useForm();

  const { isLogin, apiToken } = useSelector((state: StoreState) => state);

  const equipment = ['洗衣机', '空调', '衣柜', '电视', '冰箱',
    '热水器', '床', '暖气', '宽带', '天然气'];
  const equipmentIconArr = [WashIcon, AirCondIcon, WardrobeIcon, TVIcon, RefrigeratorIcon,
    WaterHeaterIcon, BedIcon, WarmIcon, WifiIcon, GasIcon];
  const [rentEquipmentState, setRentEquipmentState] = useState(0);
  const [sellEquipmentState, setSellEquipmentState] = useState(0);

  const [rentPhotos, setRentPhotos] = useState<string[]>([]);
  const [rentPhotosKey, setRentPhotosKey] = useState<string[]>([]);
  //let rentPhotos: string[] = [];
  //let rentPhotosKey: string[] = [];

  const [rentTitle, setRentTitle] = useState("");
  const [sellTitle, setSellTitle] = useState("");

  const [rentFeatureTags, setRentFeatureTags] = useState<string[]>([]);
  const EditableTagGroup = () => {
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleClose = (removedTag: String) => {
      const newTags = rentFeatureTags.filter(tag => tag !== removedTag);
      console.log(newTags);
      setRentFeatureTags(newTags);
    };

    const showInput = () => {
      setInputVisible(true);

    };

    useEffect(
      () => {
        const ipt = document.getElementById("ipt");
        ipt?.focus();
      }
    );

    const handleInputChange = (e: { target: { value: any; }; }) => {
      setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
      if (inputValue.length > 4)
        message.warning("添加标签过长");
      if (rentFeatureTags.length >= 10)
        message.warning("添加标签数目超过上限");
      if (rentFeatureTags.indexOf(inputValue) !== -1)
        message.warning("标签已添加");
      {/*有内容且和之前的内容不重复*/ }
      var newTags;
      if (inputValue && rentFeatureTags.indexOf(inputValue) === -1 && inputValue.length <= 4 && rentFeatureTags.length < 10)
        newTags = [...rentFeatureTags, inputValue];
      else
        newTags = [...rentFeatureTags];
      console.log(newTags);
      setRentFeatureTags(newTags);
      setInputVisible(false);
      setInputValue('');
    };

    return (
      <>
        {/*已有标签*/}
        {
          rentFeatureTags.map((tag: any, index: number) => {
            const tagElem = (
              <Tag
                style={{ userSelect: 'none', height: "100%" }}
                key={tag}
                closable={true}
                onClose={() => handleClose(tag)}
              >
                <span>
                  {tag}
                </span>
              </Tag>
            );
            return tagElem;
          })
        }
        {/*添加标签*/}
        {
          inputVisible && (
            <Tooltip title="不超过四字">
              <Input
                id="ipt"
                type="text"
                size="small"
                style={{
                  width: '78px',
                  marginRight: '8px',
                  height: "100%"
                }}
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputConfirm}
                onPressEnter={handleInputConfirm}
              >
              </Input>
            </Tooltip>
          )
        }
        {
          !inputVisible && (
            <Tooltip title="不超过四字">
              <Tag style={{
                background: 'transparent',
                borderStyle: 'dashed',
                height: "100%"
              }}
                onClick={showInput}>
                <PlusOutlined /> 添加标签
              </Tag>
            </Tooltip>
          )
        }
      </>
    );
  }


  const createElements = () => {
    const tmap = new TMap.Map('tmap-container', {
      center: new TMap.LatLng(31.883642, 118.81864),
      zoom: 17.2,
      pitch: 0,
      rotation: 45,
    })
    mapIns = tmap;
    markerLayer = new TMap.MultiMarker({
      id: "marker-layer", //图层id
      map: mapIns,
      styles: { //点标注的相关样式
        "marker": new TMap.MarkerStyle({
          "width": 25,
          "height": 35,
          "anchor": { x: 16, y: 32 },
          "src": "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png"
        })
      },
      geometries: [{
        "id": "1",
        "styleId": 'marker',
        "position": new TMap.LatLng(31.883642, 118.81864),
      }]
    })
  }

  useEffect(() => {
    if (isLogin) {
      if (ref.current) {
        createElements();
      }
    }
  }, [isLogin, ref])

  const showPosition = async (addr: string) => {
    if (addr !== '') {
      const res = await api.get(`/tmap-ws/address?addr=${addr}`)
      if (res.data.success) {
        mapIns.setCenter(new TMap.LatLng(res.data.result.location.lat, res.data.result.location.lng))
        markerLayer.updateGeometries([{
          "styleId": "marker",
          "id": "1",
          "position": new TMap.LatLng(res.data.result.location.lat, res.data.result.location.lng),
        }])
      }
    }
  }

  const onRentPosCheck = () => {
    console.log('here')
    const allValues = rentForm.getFieldsValue(true);
    console.log('got')
    let baseString = '';
    if (allValues['neighboorhoodCity']) baseString += allValues['neighboorhoodCity'];
    if (allValues['neighboorhood']) baseString += allValues['neighboorhood'];
    if (allValues['exactPosition']) baseString += allValues['exactPosition']['a'] + allValues['exactPosition']['b'] + allValues['exactPosition']['c']
    showPosition(baseString)
  }

  const handleFeatureChange = (id: number) => {
    const tmp = (1 << (equipment.length - id - 1));
    setRentEquipmentState(rentEquipmentState ^ tmp);
  }

  const haveFeatureId = (id: number) => {
    if (rentEquipmentState & (1 << (equipment.length - id - 1)))
      return true;
    return false;
  }

  const featureStyle1: React.CSSProperties = {
    opacity: '20%',
    width: '20%',
  };

  const featureStyle2: React.CSSProperties = {
    opacity: '100%',
    width: '20%',
  };

  const beforeUpload = async (file: any, fileList: any) => {
    console.log(file);
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      message.warning("图片应为 jpeg 或 png 格式");
      return Upload.LIST_IGNORE;
    }
    const res = await api.get('/upload', {
      params: {
        type: "house",
        file_name: file.name
      }
    });
    console.log("res:", res);

    const newPhotos = [...rentPhotos, file.name];
    setRentPhotos(newPhotos)
    const newPhotosKey = [...rentPhotosKey, res.data.result.url.formData.key];
    setRentPhotosKey(newPhotosKey)

    //rentPhotos = [...rentPhotos, file.name];
    //rentPhotosKey = [...rentPhotosKey, res.data.result.url.formData.key];
    //console.log("ph:", rentPhotos);
    //console.log("phk:", rentPhotosKey);

    const fd = new FormData()
    for (const r in res.data.result.url.formData) {
      fd.append(r, res.data.result.url.formData[r])
    }
    fd.append("file", file);
    const r = await api2.post(res.data.result.url.postURL, fd)
    console.log("r: ", r);
    return true;
  }

  const onRentRemove = async (file: any) => {
    const id = rentPhotos.indexOf(file.name);
    const delKey = rentPhotosKey[id];

    setRentPhotos(rentPhotos.filter((tag, _id) => _id !== id));
    setRentPhotosKey(rentPhotosKey.filter((tag, _id) => _id !== id));

    //rentPhotos = rentPhotos.filter((tag, _id) => _id !== id);
    //rentPhotosKey = rentPhotosKey.filter((tag, _id) => _id !== id);

    const res = await api.delete('/upload', {
      params: {
        type: "house",
        file_name: delKey
      }
    });
    console.log("res:", res);
    return true;
  }

  const handleRentSubmit = async (values: any) => {
    // console.log("ph:", rentPhotos);
    // console.log("phk:", rentPhotosKey);
    console.log(values);
    if (!values.city) message.warning("未填写城市");
    else if (!values.neighbourhood) message.warning("未填写小区");
    else if (!values.floor) message.warning("未填写楼层");
    else if (!values.totalFloor) message.warning("未填写总楼层");
    else if (!values.area) message.warning("未填写面积");
    else if (!values.houseType) message.warning("未填写房型");
    else if (!values.direction) message.warning("未选择朝向");
    else if (!values.decoration) message.warning("未选择装修情况");
    else if (!values.price) message.warning("未填写价格");
    else if (!values.payType) message.warning("未填选择支付方式");
    else if (!values.rentType) message.warning("未填选择租赁方式");
    else {
      const res = await api.post('/rent/detail', {
        title: rentTitle,
        photos: rentPhotosKey,
        area: values.area,
        floor: values.floor,
        total_floor: values.totalFloor,
        price: values.price,
        house_type: values.houseType.a + "室" + values.houseType.b + "厅" + values.houseType.c + "卫",
        decoration: values.decoration,
        features: rentFeatureTags,
        neighbourhood: values.neighbourhood,
        city: values.city,
        rent_type: values.payType,
        equipments: rentEquipmentState
      });
      console.log(res);
      if (res.data.success) {
        message.success('提交成功')
        return;
      } else {
        message.warning(res.data.reason)
        return;
      }
    }
  }

  const handleValueChange = (changedValue: any, values: any) => {
    let title: string = "";
    if (values.rentType)
      title = title + values.rentType;
    if (values.rentType && (values.neighbourhood || values.houseType || values.direction))
      title = title + "·";
    if (values.neighbourhood)
      title = title + values.neighbourhood + " ";
    if (values.houseType) {
      title = title + values.houseType.a + (values.houseType.a === "" ? "" : "室");
      title = title + values.houseType.b + (values.houseType.b === "" ? "" : "厅");
      title = title + values.houseType.c + (values.houseType.c === "" ? "" : "卫");
      if (values.houseType.a !== "" || values.houseType.b !== "" || values.houseType.c !== "")
        title = title + " ";
    }
    if (values.direction)
      title = title + values.direction + "向";
    setRentTitle(title);
  }

  return <Basement style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
    <Basement style={{ width: '80%', minHeight: '80%' }}>
      <Layer style={{ right: '55%', top: 10 }}>
        <Container>
          <Tabs defaultActiveKey="rent" onChange={(key) => { setRentOrSell(key) }}>

            {/*卖房*/}
            <Tabs.TabPane key="rent" tab="我要出租">
              <Steps current={step} size="small" style={{ margin: 20, padding: 30 }} onChange={(e) => { setStep(e) }}>
                <Steps.Step title="房源地址" icon={<HomeOutlined />} />
                <Steps.Step title="详细信息" icon={<FormOutlined />} />
                <Steps.Step title="提交审核" icon={<AuditOutlined />} />
              </Steps>
              {/*房源地址*/}
              <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} form={rentForm} onFinish={handleRentSubmit} onValuesChange={handleValueChange}>
                <Form.Item wrapperCol={{ span: 15 }} name="city" label="城市" hidden={step !== 0}>
                  <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 15 }} name="neighbourhood" label="小区" hidden={step !== 0}>
                  <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 6, span: 20 }} hidden={step !== 0}>
                  <Button type="default" onClick={onRentPosCheck}>检查地址</Button>
                </Form.Item>

                {/*详细信息*/}
                <Row>
                  <Col span={12}>
                    <Form.Item labelCol={{ offset: 8 }} wrapperCol={{ span: 8 }} name="floor" label="楼层" hidden={step !== 1}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item labelCol={{ offset: 1 }} wrapperCol={{ span: 8 }} name="totalFloor" label="总楼层" hidden={step !== 1}>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item wrapperCol={{ span: 15 }} name="area" label="面积" hidden={step !== 1}>
                  <Input placeholder="请输入阿拉伯数字，单位/㎡" />
                </Form.Item>

                <Tooltip placement="top" title="请输入阿拉伯数字">
                  <Form.Item name="houseType" label="房型" hidden={step !== 1}>
                    <InlineMultipleInput placehoderList={['室', '厅', '卫']} />
                  </Form.Item>
                </Tooltip>

                <Form.Item name="direction" label="朝向" hidden={step !== 1}>
                  <Radio.Group>
                    <Radio.Button value="南北">南北</Radio.Button>
                    <Radio.Button value="东西">东西</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item name="decoration" label="装修情况" hidden={step !== 1}>
                  <Radio.Group>
                    <Radio.Button value="豪装">豪装</Radio.Button>
                    <Radio.Button value="精装">精装</Radio.Button>
                    <Radio.Button value="中装">中装</Radio.Button>
                    <Radio.Button value="简装">简装</Radio.Button>
                    <Radio.Button value="毛胚">毛胚</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item name="equipments" label="配套设施" hidden={step !== 1}>
                  <Row>
                    {equipment.map((tag, id) => (
                      <div style={haveFeatureId(id) ? featureStyle2 : featureStyle1}>
                        <img src={equipmentIconArr[id]} style={{ height: '30px', width: '100%', marginTop: '14px' }} onClick={() => handleFeatureChange(id)} />
                        <p style={{ textAlign: 'center', marginBottom: 0 }}>{tag}</p>
                      </div>
                    ))}
                  </Row>
                </Form.Item>

                <Form.Item name="photos" label="房屋内景" hidden={step !== 1}>
                  <Upload listType="text" maxCount={10} beforeUpload={beforeUpload} onRemove={onRentRemove} >
                    <Button style={{display:'flex',alignItems:'center'}}><UploadOutlined />Click to upload</Button>
                  </Upload>
                </Form.Item>

                {/*提交审核*/}
                <Form.Item name="features" label="添加标签" hidden={step !== 2}>
                  <EditableTagGroup />
                </Form.Item>

                <Form.Item wrapperCol={{ span: 15 }} name="price" label="价格" hidden={step !== 2}>
                  <Input placeholder="请输入阿拉伯数字，单位：元/月" type="number" />
                </Form.Item>

                <Form.Item name="payType" label="支付方式" hidden={step !== 2}>
                  <Radio.Group >
                    <Radio.Button value="押一付三">押一付三</Radio.Button>
                    <Radio.Button value="半年一付">半年一付</Radio.Button>
                    <Radio.Button value="一年一付">一年一付</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item name="rentType" label="租赁方式" hidden={step !== 2}>
                  <Radio.Group >
                    <Radio.Button value="整租" >整租</Radio.Button>
                    <Radio.Button value="合租">合租</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item wrapperCol={{ span: 15 }} name="title" label="标题" hidden={step !== 2}>
                  <Button disabled style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', color: 'rgb(38 38 38)', backgroundColor: 'rgb(0 0 0 / 5%)', cursor: 'default' }} > {rentTitle}</Button>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 6, span: 20 }} hidden={step !== 2}>
                  <Button type="default" htmlType="submit" >提交审核</Button>
                </Form.Item>

              </Form>
            </Tabs.TabPane>

            {/*卖房*/}
            <Tabs.TabPane key="sell" tab="我要卖房">
              <Steps current={step} size="small" style={{ margin: 20, padding: 30 }} onChange={(e) => { setStep(e) }}>
                <Steps.Step title="房源地址" icon={<HomeOutlined />} />
                <Steps.Step title="详细信息" icon={<FormOutlined />} />
                <Steps.Step title="提交审核" icon={<AuditOutlined />} />
              </Steps>
              {/*房源地址*/}
              <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} form={sellForm}>
                <Form.Item wrapperCol={{ span: 15 }} name="city" label="城市" hidden={step !== 0}>
                  <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 15 }} name="neighbourhood" label="小区" hidden={step !== 0}>
                  <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 6, span: 20 }} hidden={step !== 0}>
                  <Button type="default" onClick={onRentPosCheck}>检查地址</Button>
                </Form.Item>

                {/*详细信息*/}
                <Row>
                  <Col span={12}>
                    <Form.Item labelCol={{ offset: 8 }} wrapperCol={{ span: 8 }} name="floor" label="楼层" hidden={step !== 1}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item labelCol={{ offset: 1 }} wrapperCol={{ span: 8 }} name="totalFloor" label="总楼层" hidden={step !== 1}>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item wrapperCol={{ span: 15 }} name="area" label="面积" hidden={step !== 1}>
                  <Input placeholder="请输入阿拉伯数字，单位/㎡" />
                </Form.Item>

                <Tooltip placement="top" title="请输入阿拉伯数字">
                  <Form.Item name="houseType" label="房型" hidden={step !== 1}>
                    <InlineMultipleInput placehoderList={['室', '厅', '卫']} />
                  </Form.Item>
                </Tooltip>

                <Form.Item name="direction" label="朝向" hidden={step !== 1}>
                  <Radio.Group>
                    <Radio.Button value="南北">南北</Radio.Button>
                    <Radio.Button value="东西">东西</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item name="decoration" label="装修情况" hidden={step !== 1}>
                  <Radio.Group>
                    <Radio.Button value="豪装">豪装</Radio.Button>
                    <Radio.Button value="精装">精装</Radio.Button>
                    <Radio.Button value="中装">中装</Radio.Button>
                    <Radio.Button value="简装">简装</Radio.Button>
                    <Radio.Button value="毛胚">毛胚</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item name="equipments" label="配套设施" hidden={step !== 1}>
                  <Row>
                    {equipment.map((tag, id) => (
                      <div style={haveFeatureId(id) ? featureStyle2 : featureStyle1}>
                        <img src={equipmentIconArr[id]} style={{ height: '30px', width: '100%', marginTop: '14px' }} onClick={() => handleFeatureChange(id)} />
                        <p style={{ textAlign: 'center', marginBottom: 0 }}>{tag}</p>
                      </div>
                    ))}
                  </Row>
                </Form.Item>

                <Form.Item name="photos" label="房屋内景" hidden={step !== 1} >
                  <Upload listType="text" maxCount={10}>
                    <Button >
                      <UploadOutlined />
                      <span>点击上传</span>
                    </Button>
                  </Upload>
                </Form.Item>

                {/*提交审核*/}
                <Form.Item name="features" label="添加标签" hidden={step !== 2}>
                  <EditableTagGroup />
                </Form.Item>

                <Form.Item wrapperCol={{ span: 15 }} name="price" label="价格" hidden={step !== 2}>
                  <Input placeholder="请输入阿拉伯数字，单位：万元" type="number" />
                </Form.Item>

                <Form.Item wrapperCol={{ span: 15 }} name="title" label="标题" hidden={step !== 2}>
                  <Button disabled style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', color: 'rgb(38 38 38)', backgroundColor: 'rgb(0 0 0 / 5%)' }} > {sellTitle}</Button>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 6, span: 20 }} hidden={step !== 2}>
                  <Button type="default" htmlType="submit" >提交审核</Button>
                </Form.Item>

              </Form>
            </Tabs.TabPane>
          </Tabs>
        </Container>
      </Layer>
      <Layer style={{ left: '55%', top: 10 }}>
        <Container style={{ height: '70%' }} bodyStyle={{ height: '100%' }}>
          <div id="tmap-container" ref={ref} style={{ height: '100%' }}></div>
        </Container>
      </Layer>
    </Basement>
  </Basement>
}

export default PublishResources;