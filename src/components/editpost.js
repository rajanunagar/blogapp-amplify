import React, {useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router";
import {v4 as uuid} from 'uuid';
import  {updatePost} from '../graphql/mutations';
import { generateClient} from 'aws-amplify/api';
import { getCurrentUser} from 'aws-amplify/auth';
import { useLocation } from "react-router";
import { getPost } from "../graphql/queries";

const client = generateClient();

function  EditPost() {

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
  const location = useLocation();
  const {id} = useParams();

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
      formData.id =id;  
      try {
        setFetching(true);
        const updatedTodo = await client.graphql({
          query: updatePost,
          variables: { input: formData },
          authMode:"userPool",
        });
        console.log(updatedTodo);
        setSuccess(true);
        navigate("/myposts");

      } catch (err) {
        setError(true);
      }
    }
    setFetching(false);
  };

  const gePostDetail = async ()=>{
    const result = await client.graphql({
        query: getPost,
        variables: {
          id:location.pathname.split('/')[2]
        },
    });
    const {title,content} = result.data.getPost
    setFormData({title:title,content:content});
  }

  useEffect(()=>{
    gePostDetail();
  },[]);


  return (
    <>
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

export default EditPost;
