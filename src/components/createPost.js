import React, {useState } from "react";
import { useNavigate } from "react-router";
import {v4 as uuid} from 'uuid';
import  {createPost} from '../graphql/mutations';
import { generateClient} from 'aws-amplify/api';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession} from 'aws-amplify/auth';


const client = generateClient();

function CreatePost() {

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const handleChange = (e) => {
    setFormData((formData) => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const validate = () => {
    let tempErrors = {};
    let isValid = true;
    if (!formData.content) {
      tempErrors["content"] = "Content is required";
      isValid = false;
    }
    if (!formData.title) {
      tempErrors["title"] = "Title is required";
      isValid = false;
    } else if (formData.title.length < 4) {
      tempErrors["title"] = "Title must be at least 4 characters";
      isValid = false;
    }
    setErrors(tempErrors);
    return isValid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      console.log(formData);
      const id = uuid();
      formData.id =id;  
      try {
        setFetching(true);
        const session = await fetchAuthSession();
        // console.log(decodeJWT(session))
        console.log(session);
        const updatedTodo = await client.graphql({
          query: createPost,
          variables: { input: formData },
          authMode:"userPool",
        });
        console.log(updatedTodo);
        // navigate("/");
        setSuccess(true);
      } catch (err) {
        setError(true);
      }
    }
    setFetching(false);
  };

  return (
    <>
      {/* <div
        className="container "
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="row justify-content-center">
          <div className="col-lg-5">
            <div
              className="card p-2"
              style={{
                width: "100%",
                maxWidth: "100%",
                boxShadow: "4px 3px 5px gray",
              }}
            >
              <div className="card-body px-0 mx-0">
                <h5 className="card-title text-primary">Login</h5>
                <hr />
                <div className="px-3">
                  <form onSubmit={handleSubmit} noValidate className="">
                    <div className="form-group">
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        id="email"
                        placeholder="Email or Username"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      {errors.email && (
                        <small id="emailHelp" className="form-text text-danger">
                          {errors.email}
                        </small>
                      )}
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        id="email"
                        placeholder="Email or Username"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      {errors.email && (
                        <small id="emailHelp" className="form-text text-danger">
                          {errors.email}
                        </small>
                      )}
                    </div>
                    <div>
                      {!fetching && (
                        <button type="submit" className="btn btn-primary mt-3">
                          Submit
                        </button>
                      )}
                      {fetching && (
                        <div className="spinner-border" role="status">
                          <span className="sr-only"> </span>
                        </div>
                      )}
                    </div>
                    <div className="text-center mt-2">
                      <Link
                        to="/forgotpassword"
                        className="d-block text-primary"
                        style={{ textDecoration: "none" }}
                      >
                        Forgot Password?
                      </Link>
                      <div className="">
                        If you are a new user click
                        <Link
                          to="/register"
                          className="mx-1 text-primary"
                          style={{ textDecoration: "none" }}
                        >
                          here
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="container">
        <div className="row justify-content-center">
            <div className="col-md-6">

            
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-12">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={formData.title}
            onChange={handleChange}
            name="title"
          />
           {errors.title && (
                        <small id="titleHelp" className="form-text text-danger">
                          {errors.title}
                        </small>
           )}
        </div>
        <div className="col-12">
          <label htmlFor="content" className="form-label">
          Content
          </label>
          <input
            type="text"
            className="form-control"
            // id="content"
            value={formData.content}
            onChange={handleChange}
            name="content"
          />
           {errors.content && (
                        <small id="contentHelp" className="form-text text-danger">
                          {errors.content}
                        </small>
           )}
        </div>
        <div className="col-12">
          {/* <button type="submit" className="btn btn-primary">
            Sign in
          </button> */}
          {!fetching && (
                        <button type="submit" className="btn btn-primary">
                          Submit
                        </button>
                      )}
                      {fetching && (
                        <div className="spinner-border" role="status">
                          <span className="sr-only"> </span>
                        </div>
                      )}
        </div>
      </form>
      </div>
        </div>
      </div>
    </>
  );
}

export default withAuthenticator(CreatePost);
