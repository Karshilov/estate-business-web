import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Tag, Input, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';


const EditableTagGroup = () => {
  const emptyTagArr: String[] = [];
  const [tags, setTags] = useState(emptyTagArr);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleClose = (removedTag: String) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);

  };

  useEffect(
    () => {
      const ipt = document.getElementById("ipt");
      console.log(ipt);
      ipt?.focus();
    }
  );

  const handleInputChange = (e: { target: { value: any; }; }) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue.length > 5) console.log("Too long");
    {/*有内容且和之前的内容不重复*/ }
    var newTags;
    if (inputValue && tags.indexOf(inputValue) === -1 && inputValue.length <= 5)
      newTags = [...tags, inputValue];
    else
      newTags = [...tags];
    console.log(newTags);
    setTags(newTags);
    setInputVisible(false);
    setInputValue('');
  };

  return (
    <div style={{ height: '28px' }}>
      {/*已有标签*/}
      {tags.map((tag: any, index: number) => {
        const tagElem = (
          <Tag
            style={{ userSelect: 'none', height: '100%' }}
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
      })}
      {/*添加标签*/}
      {
        inputVisible && (
          <Tooltip title="标签长度不超过5字">
            <Input
              id="ipt"
              type="text"
              size="small"
              style={{
                width: '78px',
                marginRight: '8px',
                height: '100%'
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
          <Tag style={{
            background: 'transparent',
            borderStyle: 'dashed',
            height: '100%'
          }}
            onClick={showInput}>
            <PlusOutlined /> 添加标签
          </Tag>
        )
      }
    </div>
  );
}

export default EditableTagGroup;