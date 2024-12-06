import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { postsByUsername } from "../graphql/queries";
import { useNavigate } from "react-router-dom";
import { getCurrentUser ,signOut} from "aws-amplify/auth";
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
    <div className="container mt-5">
      <div className="row justify-content-center text-center">
        <h2>Posts</h2>
        <div className="col-md-10 col-lg-8">
          <table className="table table-hover">
            <thead>
              <tr>
                {/* <th scope="col">ID</th> */}
                <th scope="col">Title</th>
                <th scope="col">Content</th>
                <th scope="col">Username</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr onClick={()=>{navigate(`/posts/${post.id}`)}}>
                  {/* <th scope="row">{post.id}</th> */}
                  <td>{post.title}</td>
                  <td>{post.content}</td>
                  <td>{post.username}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Myposts;
