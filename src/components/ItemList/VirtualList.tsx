import { list } from "postcss";
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom'
import { SearchItemModel } from '../../utils/DataModel'
import Item from './Item'

const VirtualList = (props: { list: Array<SearchItemModel>, type?: string, other?:boolean }) => {
  const columns: SearchItemModel[] = [];

  props.list.forEach((item, index) => {
    columns.push(item)
  })

  return <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <div style={{ width: '95%' }}>
      {columns.map(item => <Item data={item} key={item.id} type={props.type} other={props.other}/>)}
    </div>
    {/* 
    <div style={{ flexGrow: 1 }}></div>
    <div style={{ width: '20%' }}>
      {columns[0].map(item => <Item data={item} />)}
    </div>
  
    <div style={{ flexGrow: 1 }}></div>
    <div style={{ width: '20%' }}>
      {columns[1].map(item => <Item data={item} />)}
    </div>
    <div style={{ flexGrow: 1 }}></div>
    <div style={{ width: '20%' }}>
      {columns[2].map(item => <Item data={item} />)}
    </div>
    <div style={{ flexGrow: 1 }}></div>
    */}
  </div>
}

export default VirtualList;