import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {getPost} from '../graphql/queries';
import { generateClient} from 'aws-amplify/api';
import { useNavigate } from 'react-router-dom';
import {createComment} from '../graphql/mutations'
import {v4 as uuid} from 'uuid';
import { getCurrentUser} from "aws-amplify/auth";
import { StorageImage } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
const client = generateClient();

function PostDetail() {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fetching, setFetching] = useState(false);
  const location = useLocation();
  const [post,setPost] = useState({});
  const navigate = useNavigate();
  const [comment,setComment]=useState('');
  const [showComment,setShowComment]=useState(false);

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

  const onAddComment = async ()=>{
    if(!comment) {
      setError('required field');
      return ;
    }
    // const {username}= await getCurrentUser();
    try{
    const result = await client.graphql({
      query:createComment,
      variables: {
        input : {
          message:comment,
          id:uuid(),
          postID:post.id,
          

        }
      },
      authMode:"userPool"
    })
  }
  catch(error) {
    console.log(error);
  }
  
  }

  useEffect(()=>{
    getUserDetail();
  },[]);

  return (
    <div className='container'>
    <div className='row justify-content-center'>
    <div className='col-sm-6 '>
    <p>Title : {post.title}</p>
    <p>Content:{post.content}</p>
    <p>username:{post.username}</p>
    { post.coverImage && 
      <StorageImage
      alt="protected cat"
      path= {post.coverImage}
    />
    }
    {
      post.comments?.items && post.comments.items.length > 0 && <div>
           {post.comments.items.map((rec,ind)=>(
            <li>{rec.createdBy} :{rec.message}</li>
           ))
           }
      </div>
    }
    <button  onClick={()=>setShowComment(!showComment)} className='btn btn-secondary'>{!showComment?'Show Comment':'desable comment'}</button>
    {
      showComment && <div className='mt-3'>
      <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={comment}
            onChange={(e)=>setComment(e.target.value)}
            name="title"
          />
           {error && (
                        <small id="titleHelp" className="form-text text-danger">
                          {error}
                        </small>
           )}
      <div className='mt-3'>
      <button onClick={onAddComment} className='btn btn-secondary'>Add Comment</button>
      </div>
      </div>
    }
    <div className='mt-5'>
    <button  className='btn btn-primary' onClick={()=>{ navigate('/')}}>Back</button>
    </div>
    </div>
    </div>
  </div>
  )
}

export default PostDetail