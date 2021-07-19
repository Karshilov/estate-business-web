import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const RichTextEditor = () => {
  useEffect(() => {
    console.log('rich text')
    console.log(ClassicEditor.builtinPlugins.map( (plugin: any) => plugin.pluginName ))
  }, [])

  return <div style={{ width: '100%', minHeight: '100vh' }}>
    <CKEditor
      editor={ClassicEditor}
      data="<p></p>"
      onReady={(editor: any) => {
        // You can store the "editor" and use when it is needed.
        console.log('Editor is ready to use!', editor);
      }}
      onChange={(event: any, editor: any) => {
        const data = editor.getData();
        console.log({ event, editor, data });
      }}
      onBlur={(event: any, editor: any) => {
        console.log('Blur.', editor);
      }}
      onFocus={(event: any, editor: any) => {
        console.log('Focus.', editor);
      }}
    />
  </div>
}

export default RichTextEditor;