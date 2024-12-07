import React, {useRef, useState } from "react";
import { useNavigate } from "react-router";
import {v4 as uuid} from 'uuid';
import  {createPost} from '../graphql/mutations';
import { generateClient} from 'aws-amplify/api';
import { getCurrentUser} from 'aws-amplify/auth';
import { uploadData} from 'aws-amplify/storage';



const client = generateClient();

function CreatePost() {

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [image,setImage] = useState(null);
  const inputFile = useRef(null);

  const handleChange = (e) => {
    setFormData((formData) => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
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
      formData.username = await getUser();
      try {
        console.log('sskdfk',image,image?.name)
        if(image) {
          const filename = `${image.name}_${uuid()}`;
          console.log(filename);
           const result = await uploadData({
            path: ({ identityId }) =>
              `protected/${identityId}/${image.name}`,
            data: image,
            options: {
              onProgress: ({ transferredBytes, totalBytes }) => {
                if (totalBytes) {
                  console.log(
                    `Upload progress ${Math.round(
                      (transferredBytes / totalBytes) * 100
                    )} %`
                  );
                }
              },
            },
          }).result;
          formData.coverImage = result.path;;

          console.log(formData);
          // await Storage.put(filename,image);
        }
        console.log('sfk')
        setFetching(true);
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

  const getUser = async ()=>{
    try{
    const {username}= await getCurrentUser();
    console.log();
    return username;
    }
    catch(err){
      navigate('/');
    }
    
  }

  const changeImage = (e)=>{
    const file = e.target.files[0];
    setImage(file);
  }

  const handleUpload = ()=>{
    inputFile.current.click();
  }

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
        {
          image && <img src={URL.createObjectURL(image)}  style={{height:'100px',width:'100px'}}/>
        }
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
          {/* <label htmlFor="content" className="form-label">
          Image
          </label> */}
          <input
            type="file"
            className="form-control"
            // id="content"
            ref = {inputFile}
            onChange={changeImage}
            name="image"
            style={{display:'none'}}
          />
        </div>
        <div className="col-12">
        <button type="button" className="btn btn-primary mx-3" onClick={handleUpload}>
                          Upload image
         </button>
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

export default CreatePost;
