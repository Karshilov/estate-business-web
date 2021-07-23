import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { defaultData } from '../../utils/richTextDefault';
import { Button } from 'antd';
import HTMLParser from '../../utils/parser';

const RichTextEditor = () => {

  const [article, setArticle] = useState('')

  const onPublish = () => {

  }

  return <div style={{ width: '100%', minHeight: '80vh' }}>
    <CKEditor
      editor={ClassicEditor}
      data={defaultData}
      onChange={(event: any, editor: any) => {
        const data = editor.getData();
        console.log(HTMLParser(data))
        setArticle(data);
      }}
    />
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 40 }}>
      <Button type="primary" onClick={onPublish}>点击发布</Button>
    </div>
  </div>
}

export default RichTextEditor;