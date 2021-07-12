import { list } from "postcss";
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom'
import { SearchItemModel } from '../../utils/DataModel'
import Item from './Item'

const VirtualList = (props: { list: Array<SearchItemModel> }) => {
  const columns: SearchItemModel[][] = [[], [], [], []]

  props.list.forEach((item, index) => {
    columns[index % 4].push(item)
  })

  return <div style={{ width: '100%', display: 'flex' }}>
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
    <div style={{ width: '20%' }}>
      {columns[3].map(item => <Item data={item} />)}
    </div>
    <div style={{ flexGrow: 1 }}></div>
  </div>
}

export default VirtualList;