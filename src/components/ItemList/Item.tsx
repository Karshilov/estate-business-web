import React, { useState, useEffect, CSSProperties } from 'react'
import { SearchItemModel } from '../../utils/DataModel'

const Item = (props: { data: SearchItemModel }) => { 
  useEffect(() => {
    console.log('created')
  }, [])

  return <div className="item" id={props.data.id}>
    <div
      className="item-content"
    >
      <img src={props.data.cover} alt="" />
    </div>
  </div >
}

export default Item;