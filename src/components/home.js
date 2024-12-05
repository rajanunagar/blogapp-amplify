import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { listPosts } from "../graphql/queries";

const client = generateClient();
function Home() {
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    const result = await client.graphql({
      query: listPosts,
      variables: {
        limit: 10,
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
                <tr>
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

export default Home;
