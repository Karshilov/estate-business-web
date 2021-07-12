import React, { useState, useEffect, CSSProperties } from 'react'
import { SearchItemModel } from '../../utils/DataModel'
import { Divider } from 'antd';

const Item = (props: { data: SearchItemModel, style?: CSSProperties }) => {
  useEffect(() => {
    console.log('created')
  }, [])

  return (
    <div className="item" id={props.data.id} style={{ width: '100%', display: 'flex', marginTop:'3rem'}}>
      <div className="item-content" style={{width:'25%',marginRight:'1rem'}}>
        <img src={props.data.cover} alt="" />
      </div>
      <div style = {{flexGrow:0}}>
        <p className="item-title" style = {{marginBottom:'0.5rem', fontSize:'1.7rem', fontWeight: 'bold'}}>
            {props.data.title}
        </p>
        <p className="item-info" style = {{marginBottom:'0.5rem', fontSize:'1.2rem'}}>
           <a style={{color: '#A9A9A9'}}>{props.data.neighborhood}</a>
           <i>/</i>
           <a style={{color: '#A9A9A9'}}>{props.data.area}</a>
           <i>/</i>
           <a style={{color: '#A9A9A9'}}>{props.data.floor}楼</a>
           <i>/</i>
           <a style={{color: '#A9A9A9'}}>{props.data.area}层</a>
        </p>
        <p className="item-price" style = {{marginBottom:'0.5rem', fontSize:'1.2rem'}}>价格：{props.data.price}</p>
        <Divider ></Divider>
        <p className="item-create-time" style = {{marginBottom:'0.5rem', fontSize:'1.2rem'}}>创建时间：{props.data.create_time}</p>
      </div>
    </div >

  );

}

export default Item;