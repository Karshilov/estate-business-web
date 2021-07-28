import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Basement, Container } from "../../components/BasicHTMLElement";
import RichTextEditor from "../../components/RichText/RichTextEditor";
import { StoreState } from "../../store";

const BlogPublish = (props: { match: any }) => {
  const { user } = useSelector((state: StoreState) => state, (left: StoreState, right: StoreState) => left.user?.username === right.user?.username)
  const id = props.match.params.id;

  return <Basement style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
    <div style={{ width: '60%' }}>
      <Container style={{ marginTop: '40px', marginBottom: '40px' }} bodyStyle={{ display: 'flex', alignItems: 'center' }} hoverable={false} className="shadow-md">
        <div style={{ width: 4, height: '2.5rem', borderRadius: 2, background: '#00896c', marginRight: 20 }}/>
        <span style={{ fontSize: '1.6rem', fontWeight: 600}}>欢迎你</span>
        <span style={{ fontSize: '1.6rem', fontWeight: 600}} hidden={user === undefined}>
          ，{user?.username}，在这里开始你的创作之旅吧
        </span>
      </Container>
      <RichTextEditor id={id}/>
    </div>
  </Basement>
}

export default BlogPublish;