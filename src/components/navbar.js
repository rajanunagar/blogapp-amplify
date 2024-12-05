import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { signOut } from "aws-amplify/auth";
import { getCurrentUser } from "aws-amplify/auth";
import { Hub } from 'aws-amplify/utils';
import { useNavigate } from "react-router-dom";
 

function Navbar() {

  const [isUserSignedIn,setIsUserSignedIn] = useState(false);
  const navigate = useNavigate();

  const checkIsSignedInorOur = async () => {
    console.log('called');
    Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          setIsUserSignedIn(true);
          getUser();
          console.log('user have been signedIn successfully.');
          break;
        case 'signedOut':
          setIsUserSignedIn(false);
          console.log('user have been signedOut successfully.');
          break;
      }
    });
  }

  async function handleSignOut() {
    try {
      await signOut();
      setIsUserSignedIn(false);
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  const getUser = async ()=>{
    const { username, userId, signInDetails } = await getCurrentUser();
    console.log(username,userId,signInDetails);
  }

  const checkUserSignedInorNot2 =async ()=>{
    try{
     await getCurrentUser();
     setIsUserSignedIn(true);
    }
    catch(error) {
      setIsUserSignedIn(false);
    }
  }
 
  useEffect(()=>{
    checkIsSignedInorOur(); //this is not working on refresh
  })
  useEffect(()=>{
    checkUserSignedInorNot2();
  },[navigate]);

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Navbar
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="createpost"
                >
                  create post
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="profile">
                  Profile
                </Link>
              </li>
              {isUserSignedIn && <li className="nav-item">
                <Link className="nav-link" to="/myposts">
                  My Posts
                </Link>
              </li>
              }
              {isUserSignedIn && <li className="nav-item" style={{cursor:'pointer'}} onClick={handleSignOut}>
                  Logout
              </li>
              }

              {/* <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Dropdown
          </a>
          <ul className="dropdown-menu">
            <li>
              <a className="dropdown-item" href="#">
                Action
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Another action
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Something else here
              </a>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <a className="nav-link disabled" aria-disabled="true">
            Disabled
          </a>
        </li> */}
            </ul>
            {/* <form className="d-flex" role="search">
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form> */}
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default Navbar;
