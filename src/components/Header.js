import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack,  InputAdornment,
  TextField,
  Container } from "@mui/material";
import Box from "@mui/material/Box";
import React, {useState} from "react";
import "./Header.css";
import {useHistory, Link} from "react-router-dom" ;
import { Search, SentimentDissatisfied } from "@mui/icons-material";


const Header = ({ children, hasHiddenAuthButtons, searchTextHandler, userDetails }) => {

  const history = useHistory(); 

    return (
      <Box className="header"> 
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>

        {children && (<div className="search-desktop">
          <TextField
            size="small"
            fullWidth
            InputProps={{
              endAdornment: ( 
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Search for items/categories"
            name="search"
            onChange = {searchTextHandler}
          />
        </div>)}

        {!hasHiddenAuthButtons && (<Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={()=>{
            history.push("/"); 
          }}
        > 
          <p>BACK TO EXPLORE</p>
        </Button>)}


       {(hasHiddenAuthButtons && !userDetails) && (<div className="logBtns">
       <Button
          variant="text"
          onClick={()=>{
            history.push("/login"); 
          }}
        >
          <p>LOGIN</p>
        </Button>

        <Button
          variant="text" 
          onClick={()=>{
            history.push("/register"); 
          }}
        >
          <p>REGISTER</p>
        </Button>
       </div>)}

      {(hasHiddenAuthButtons && userDetails) && (<div className="logBtns">
       <div className="user-profile">
          <div className="user-profile-img">
            <img src="avatar.png" alt={userDetails.username}/>
          </div>
          <span>{userDetails.username}</span>
       </div>

        <Button
          variant="text"

          onClick={()=>{
            localStorage.clear(); 
            window.location.reload(); 
            history.push("/"); 
          }}
        >
          <p>
            LOGOUT
          </p>
          
        </Button>
      </div>)}


      </Box>
    );
};

export default Header;
