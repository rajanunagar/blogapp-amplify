import React, { useEffect, useState } from "react";
import { generateClient, post } from "aws-amplify/api";
import { postsByUsername } from "../graphql/queries";
import { useNavigate } from "react-router-dom";
import { getCurrentUser} from "aws-amplify/auth";
import DisplayPosts from "./displayPosts";

const client = generateClient();
function Myposts() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const getPosts = async (username) => {
    const result = await client.graphql({
      query: postsByUsername,
      variables: {
        username:username,
        limit:10,
        nextToken:null
      },
      // authMode:"userPool"
    });
    setPosts(result.data.postsByUsername.items);
    console.log(result);
  };
  const getUser = async ()=>{
    try{
    const user= await getCurrentUser();
    getPosts(user.username);
    }
    catch(err){
      navigate('/');
    }
    
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
     {
      posts && posts.length > 0 && <DisplayPosts posts={posts}/>
     }
     {
      posts && posts.length===0 && <p>Don't have any posts</p>
     }
    </>
  );
}

export default Myposts;
