import React, { useEffect, useState } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { getCurrentUser ,signOut} from "aws-amplify/auth";
import { useNavigate } from 'react-router-dom';
  
function Profile() {
  const [user,setUser] = useState({});
  const navigate = useNavigate();

  const getUser = async ()=>{
    try{
    const user= await getCurrentUser();
    console.log(user);
    setUser(user);
    }
    catch(err){
      navigate('/');
    }
    
  }

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  useEffect(()=>{
    getUser();
  },[navigate]);


  return (
    <div>
      <p>username : {user.username}</p>
      <p>ID:{user.userId}</p>
      <button onClick={handleSignOut}>
            Sign Out
      </button>
    </div>
  )
}

export default withAuthenticator(Profile);