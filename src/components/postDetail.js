import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {getPost} from '../graphql/queries';
import { generateClient} from 'aws-amplify/api';
import { useNavigate } from 'react-router-dom';

const client = generateClient();
function PostDetail() {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fetching, setFetching] = useState(false);
  const location = useLocation();
  const [post,setPost] = useState({});
  const navigate = useNavigate();

  const getUserDetail = async ()=>{
    const result = await client.graphql({
        query: getPost,
        variables: {
          id:location.pathname.split('/')[2]
        },
    });
    console.log(result.data.getPost);
    console.log(result.data);
    setPost(result.data.getPost);
  }
  useEffect(()=>{
    getUserDetail();
  },[]);

  return (
    <div>
    <p>Title : {post.title}</p>
    <p>Content:{post.content}</p>
    <p>username:{post.username}</p>
    <button  className='btn btn-primary' onClick={()=>{ navigate('/')}}>Back</button>
  </div>
  )
}

export default PostDetail