import React, { useEffect, useState } from "react";
import { Basement } from "../../components/BasicHTMLElement";
import RichTextEditor from "../../components/RichText/RichTextEditor";

const BlogPublish = () => {
    return <Basement style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
        <div style={{ width: '90%' }}>
            <RichTextEditor />
        </div>
    </Basement>
}

export default BlogPublish;