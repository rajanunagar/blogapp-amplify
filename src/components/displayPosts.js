import React from "react";
import tempImage from '../assets/images/game of thrones_56.jpg';
import { Link, useNavigate } from "react-router-dom";

function DisplayPosts({ posts }) {
 
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <div className="row justify-content-center text-center">
        {/* <h2>Posts</h2> */}
        {
          posts.map(post=> (
        <div className="col-lg-4 col-sm-6 col-12 mt-3">

            <div className="card" style={{ width: "18rem" }}>
            <img src={tempImage} className="card-img-top" alt="..." />
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
            <div className="card-body">
              <Link to={`/posts/${post.id}`} className="card-link">
                Detail
              </Link>
              <Link to={`/posts/${post.id}`} className="card-link">
                Edit
              </Link>
            </div>
          </div>
          </div>
          ))
        }
      </div>
    </div>
  );
}

export default DisplayPosts;
