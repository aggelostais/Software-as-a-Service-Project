import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import {  useAuth } from "../context/auth";
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import "../components/Sessions.css";
import "../App.css";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

function SignIn() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [complete,setComplete]=useState(true);
  const { setAuthTokens } = useAuth();

  function postSignIn() {
    axios
      .post("https://localhost:8765/evcharge/api/SignIn", {
        username: userName,
        password: password,
      })
      .then((response) => {
        // if successfull Sign In
        setAuthTokens(response.data.token); //AuthTokens=token provided
        console.log("Token provided is:\n" + response.data.token);
        setLoggedIn(true);
      })
      .catch((e) => {
        setIsError(true);
      });
  }

  function resetFields(){ // Clears all fields
    setUserName("");
    setPassword("");
  } 

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <Container maxWidth="sm">
    <div>
      <h2 type="text" className="text-header" style={{marginTop:"100px"}}>
        Sign In
      </h2>
      <nav>

        {/* Return Home Button */}
       <Button 
            href="/"  //Redirects to Home Page
            variant="contained" color="primary"  // Primary colour blue
            style={{  
              width: "150px", 
              marginTop: "15px", 
              marginBottom: "20px", 
              marginLeft: "30px",
              marginRight: "10px",
              fontWeight: "bold", 
              textTransform: 'none' // Small letters in button text
          }}>
          Return Home
      </Button>

      </nav>
      <div>
        <form>
         
         {/* Username */}
        <TextField
          id="standard-textarea"
          label="Email (username)"
          style={{ 
            marginTop: "10px",
            marginLeft: "30px",
            marginRight: "30px",
             }}
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
          
          <br></br>

        {/* Password  */}
        <TextField
          id="standard-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          style={{ 
              marginTop: "10px",
              marginLeft: "30px",
              marginRight: "30px" }}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}/>

          <div>
          </div>

          {/* Sign In Button */}
          <Button 
            variant="contained" 
            color="primary" 
            style={{ 
              marginTop: "10px", 
              marginBottom: "10px", 
              marginLeft: "30px",
              marginRight: "10px", 
              fontWeight: "bold",
              textTransform: 'none'  }}
            onClick={(e) => {
              e.preventDefault();
              if(userName!=="" && password!=="") {
                setComplete(true); 
                postSignIn();}
              else setComplete(false);
              }
            }>
            Sign In
          </Button>

          {/* Reset Button */}
          <Button 
            variant="contained" 
            color="secondary" 
            style={{ 
              marginTop: "10px", 
              marginBottom: "10px", 
              marginRight: "10px", 
              fontWeight: "bold",
              textTransform: 'none'  }}
            type="reset"
            onClick={(e) => {
              resetFields() // If cancel pressed, refresh page
            }}>
            Reset
          </Button>

          </form>

        {/* Error during backend call happens*/}
        {isError && (
                <Typography variant="body1" gutterBottom
                  style={{ 
                    marginTop: "15px",
                    marginLeft: "30px",
                    fontWeight:"bold" }}>
                  The username or password were incorrect.
                </Typography>
              )}
      
         {/* All fields are not completed */}
         {complete===false && (
                <Typography variant="body1" gutterBottom
                  style={{ 
                    marginTop: "15px",
                    marginLeft: "30px",
                    fontWeight:"bold" }}>
                  All fields required.
                </Typography>
              )}
        

      </div>
    </div>
    </Container>
  );
}
export default SignIn;
