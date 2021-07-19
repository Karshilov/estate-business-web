import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';

const RichTextEditor = () => {
    useEffect(() => {
        console.log('rich text')
    }, [])

    return <div style={{ width: '100%', minHeight: '100vh' }}>
        <CKEditor
            editor={ClassicEditor}
            data="<p>Hello from CKEditor 5!</p>"
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