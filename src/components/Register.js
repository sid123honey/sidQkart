import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  
  const initialData = {
    username: "", 
    password: "", 
    confirmPassword: ""
  }; 

  const history = useHistory(); 

  const [formData, setFormData] = useState(()=> (initialData));  
  const [loading, setLoading] = useState(false); 

  // toaster initialisation 
  const { enqueueSnackbar } = useSnackbar();


  const formDataHandler = (e)=>{

    setFormData((prevFormData)=> ({
      ...prevFormData, 
      [e.target.id]: e.target.value, 
    }))
  }


  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    setLoading(true); 

    try{
        if(validateInput(formData)){
          const postUrl = config.endpoint+"/auth/register"; 
          const postData = {
            username: formData.username, 
            password: formData.password
          }
          const response = await axios.post(postUrl, postData);

          if(response.status === 201){
            enqueueSnackbar("Registered successfully",{variant: 'success'}); 
            setLoading(false); 
            history.push("/login"); 
          }
        }else{
          const {username, password} = formData; 
          let messageText = ""; 

          if(username.length===0) messageText="Username is a required field"; 
          else if(username.length<6) messageText = "Username must be at least 6 characters"; 
          else if(password.length===0) messageText = "Password is a required field"; 
          else if(password.length<5) messageText = "Password must be at least 6 characters"; 
          else messageText = "Passwords do not match"; 

          enqueueSnackbar(messageText,{
            variant: 'warning',
          })
        }

    }catch(error){
      if (error.response) {
        // Handle response errors (e.g., server responded with a status code outside of 2xx range)
        enqueueSnackbar(error.response.data.message,{
          variant: 'error',
        })

      } else{
        // Handle request setup or network errors (e.g., server not reachable)
        enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{ 
          variant: 'error',
        })
      }

    }finally{
      setLoading(false); 
    }
    
  }





  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    const {username, password, confirmPassword} = data; 
    if(username.length===0 || username.length<6){
      return false; 
    }else if(password.length===0 || password.length<6){
      return false; 
    }else if(password !== confirmPassword){
      return false; 
    }

    return true; 
  };


  return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        minHeight="100vh"
      >
      <Header hasHiddenAuthButtons={false} children={false} />

      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={formData.username}
            onChange={formDataHandler}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={formData.password}
            onChange={formDataHandler}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={formData.confirmPassword}
            onChange={formDataHandler}
          />
          {loading? <div className="loaderAnimation"><CircularProgress /></div> : (<Button className="button" variant="contained" onClick={()=> register(formData)}>
            Register Now
           </Button>)}
          <p className="secondary-action">
            Already have an account?{" "}
            <Link to="/login" className="link">Login here</Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
