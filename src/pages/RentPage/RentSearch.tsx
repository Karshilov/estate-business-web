import React, {useState, useEffect } from "react";
import { Basement, Layer, Container } from "../../components/BasicHTMLElement";
import { useHistory } from 'react-router-dom';
import { Button, Col, Form, Input, Row, Tabs, Steps } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { tmapApi, useApi, apiKey } from "../../utils/api";



const RentSearch = (props: { match: any }) => {
    const routesSearchText = props.match.params.keywords;
    const [searchText, setSearchText] = useState('');

}