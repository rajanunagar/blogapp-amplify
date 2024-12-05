import { generateClient } from 'aws-amplify/api';
import  {listPosts} from './graphql/queries'
import { useEffect, useState } from 'react';
import './awsConfigure';
import Navbar from './components/navbar';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/home';
import Profile from './components/profile';
import CreatePost from './components/createPost';
import MyPosts from './components/myPost';
import PostDetail from './components/postDetail';

const client = generateClient();

function App() {
  const [posts,setPosts]=useState([]);

  const getPosts = async ()=>{
   const result =  await client.graphql({
      query: listPosts,
      variables:  {
          limit:10,
          nextToken:null
        }
    });
  setPosts(result.data.listPosts.items);
  }
  useEffect(()=>{
    getPosts();
  },[]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="createpost" element={<CreatePost />} />
          <Route path="myposts" element={<MyPosts />} />
          <Route path="posts/:id" element={<PostDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
