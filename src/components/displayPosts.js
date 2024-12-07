import React, { useState } from "react";
import tempImage from '../assets/images/game of thrones_56.jpg';
import { Link, Route, useNavigate } from "react-router-dom";
import {deletePost} from '../graphql/mutations';
import {  generateClient } from "aws-amplify/api";
import { StorageImage } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';

const client = generateClient();
function DisplayPosts({ posts,mypost }) {
 
  const navigate = useNavigate();
  const [myPosts,setMyPosts]=useState(posts);
  const onEdit = (event,id)=>{
   event.stopPropagation();
   navigate(`/editpost/${id}`);
  }

  const onDelete = async (event,id)=>{
    event.stopPropagation();
     const post = await client.graphql({
      query:deletePost,
      variables:{
        input:{id:id}
      },
      authMode:'userPool'
     });
     console.log(post);
     setMyPosts((items)=>items.filter(item=>item.id !==id));
  }
  
  const onClickPost = (id)=>{
    navigate(`/posts/${id}`);
  }
  return (
    <div className="container mt-5">
      <div className="row justify-content-center text-center">
        {/* <h2>Posts</h2> */}
        {
          myPosts.map((post,key)=> (
        <div className="col-lg-4 col-sm-6 col-12 mt-3" onClick={(e)=> {onClickPost(post.id)}} key={key}>

            <div className="card" style={{ width: "18rem" }}>
            { !post.coverImage &&
            <img src={tempImage} className="card-img-top" alt="..." />
            }
             { post.coverImage && 
      <StorageImage
      alt="protected cat"
      path= {post.coverImage}
      className={post.coverImage}
      style={{width:"100%",height:"161px"}}
    />
    }
            <div className="card-body">
              <h5 className="card-title">{post.title}</h5>
              <p className="card-text">
                {post.content}
              </p>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">{post.username}</li>
              <li className="list-group-item">{post.id}</li>
            </ul>
            {mypost && <div className="card-body">
              {/* <button to={`/posts/${post.id}`} className="btn btn-primary">
                Detail
              </button> */}
              <button to={`editpost/${post.id}`} onClick={(e)=>{onEdit(e,post.id)}} className="btn btn-primary">
                Edit
              </button>
              <button  className="btn btn-primary" onClick={(e)=>onDelete(e,post.id)}>
                Delete
              </button>
            </div>
            }
          </div>
          </div>
          ))
        }
      </div>
    </div>
  );
}

export default DisplayPosts;
