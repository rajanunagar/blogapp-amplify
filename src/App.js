import { generateClient } from 'aws-amplify/api';
import  {listPosts} from './graphql/queries'
import { useEffect, useState } from 'react';
import './awsConfigure'


const client = generateClient();

function App() {
  const [posts,setPosts]=useState([]);

  const getPosts = async ()=>{
   const result =  await client.graphql({
      query: listPosts,
      variables:  {
          limit:2,
          nextToken:null
        }
    });
  setPosts(result.data.listPosts.items);
  }
  useEffect(()=>{
    getPosts();
  },[]);

  return (
    <div className="App">
     hello world
     {posts?.length}
    </div>
  );
}

export default App;
