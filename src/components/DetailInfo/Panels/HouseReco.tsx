import React, { useState, useEffect } from "react";
import { useApi } from "../../../utils/api";

const HouseReco = () => {

    const api = useApi();

    const getRecoList = async () => {
        const res = await api.get('/rent/recommend', { params: { n : 8 }})
    }

}

export default HouseReco;