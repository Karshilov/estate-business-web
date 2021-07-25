import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { defaultData } from '../../utils/richTextDefault';
import { Button, Input, message } from 'antd';
import HTMLParser from '../../utils/parser';
import { useApi } from '../../utils/api';
import { RSA_NO_PADDING } from 'constants';

const RichTextEditor = (props: { id?: string }) => {

  const [article, setArticle] = useState(defaultData)
  const [title, setTitle] = useState('');
  const api = useApi()

  const onPublish = async () => {
    if (!props.id) {
      const res = await api.post('/blog/detail', {
        title,
        body: article,
        abstract: HTMLParser(article)
      })
      if (res.data.success) {
        message.success('发布成功')
      } else {
        message.error(res.data.reason)
      }
    } else {
      const res = await api.put('/blog/detail', {
        id: props.id,
        title,
        body: article,
        abstract: HTMLParser(article)
      })
      if (res.data.success) {
        message.success('修改成功')
      } else {
        message.error(res.data.reason)
      }
    }
  }

  const getDetail = async () => {
    const res = await api.get('/blog/detail', { params: { id: props.id}})
    if (res.data.success) {
      const result = res.data.result;
      setArticle(result.body);
      setTitle(result.title);
    } else {
      message.error(res.data.reason)
    }
  }

  useEffect(() => {
    if (props.id) {
      getDetail();
    }
  }, [])

  return <div style={{ width: '100%', minHeight: '80vh' }}>
    <div style={{ display: 'flex', marginBlock: 20 }}>
      <span style={{ fontSize: '1.2rem', fontWeight: 550, width: '8rem' }}>博客标题：</span>
      <Input placeholder="输入标题" value={title} onChange={(e) => { setTitle(e.target.value); }} style={{ lineHeight: 1.618 }}></Input>
    </div>
    <CKEditor
      editor={ClassicEditor}
      data={props.id ? article : defaultData}
      onChange={(event: any, editor: any) => {
        const data = editor.getData();
        // console.log(HTMLParser(data))
        setArticle(data);
      }}
    />
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 40 }}>
      <Button type="primary" onClick={onPublish}>点击发布</Button>
    </div>
  </div>
}

export default RichTextEditor;