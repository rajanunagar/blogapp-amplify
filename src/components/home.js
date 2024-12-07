import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { listPosts } from "../graphql/queries";
import { useNavigate } from "react-router-dom";
import DisplayPosts from "./displayPosts";
const client = generateClient();
function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const getPosts = async () => {
    const result = await client.graphql({
      query: listPosts,
      variables: {
        limit: 20,
        nextToken: null,
      },
    });
    setPosts(result.data.listPosts.items);
    console.log(result);
  };
  useEffect(() => {
    getPosts();
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

export default Home;
