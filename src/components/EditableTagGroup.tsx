import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Tag, Input, Tooltip, message, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

const EditableTagGroup = () => {
    const [tags, setTags] = useState<string[]>([]);
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
            ipt?.focus();
        }
    );

    const handleInputChange = (e: { target: { value: any; }; }) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        if (inputValue.length > 4)
            message.warning("添加标签过长");
        if (tags.length >= 10)
            message.warning("添加标签数目超过上限");
        if (tags.indexOf(inputValue) !== -1)
            message.warning("标签已添加");
        {/*有内容且和之前的内容不重复*/ }
        var newTags;
        if (inputValue && tags.indexOf(inputValue) === -1 && inputValue.length <= 4 && tags.length < 10)
            newTags = [...tags, inputValue];
        else
            newTags = [...tags];
        console.log(newTags);
        setTags(newTags);
        setInputVisible(false);
        setInputValue('');
    };

    return (
        <>
            {/*已有标签*/}
            {
                tags.map((tag: any, index: number) => {
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

export default EditableTagGroup;