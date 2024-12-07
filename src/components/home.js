import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { listPosts } from "../graphql/queries";
import { useNavigate } from "react-router-dom";
import DisplayPosts from "./displayPosts";
import { onCreatePost } from "../graphql/subscriptions";

const client = generateClient();
function Home() {
  const [posts, setPosts] = useState([]);
  const [itemAdded,setItemAdded]=useState({});
  const navigate = useNavigate();
  const getPosts = async () => {
    const result = await client.graphql({
      query: listPosts,
      variables: {
        limit: 50,
        nextToken: null,
      },
    });
    setPosts(result.data.listPosts.items);
  };
  useEffect(() => {
    const subOnCreate = client.graphql({ query: onCreatePost }).subscribe({
      next: ({ data }) =>{setItemAdded(data.onCreatePost)},
      error: (error) => console.warn(error),
    });
    return ()=>{ subOnCreate.unsubscribe();}
  }, []);

 useEffect(()=>{
 getPosts();
 },[itemAdded])
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

export default Home;
