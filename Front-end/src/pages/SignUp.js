import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/auth";
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

function SignUp() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [password_again, setPasswordAgain] = useState("");
  const [pass_match, setMatch] = useState(true); // To check if passwords match
  const [complete,setComplete]=useState(true);
  const [userExists, setUserExists] = useState(false); // To check if username already exists
  const { setAuthTokens } = useAuth();

  function postSignUp() { // Backend call for signup
    axios
      .post("/signup", {
        username: userName,
        password: password,
      })
      .then((response) => {
        // if successfull signup backend call
        // setAuthTokens(response.data.token); // AuthTokens=token provided
        console.log(response.data);
        if(response.data.user){
          // User successfully registered
          setLoggedIn(true);
        }
        else {
          setUserExists(true);
        }
      })
      .catch((e) => {   // If error happened during backend call
        setIsError(true);
      });
  }

  function resetFields(){ // Clears all fields
    setUserName("");
    setPassword("");
    setPasswordAgain("");
} 

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <Container maxWidth="sm">
    <div>
      <h2 type="text" className="text-header" style={{marginTop:"100px"}}>
        Sign Up
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

        <br></br>

        {/* Re-enter Password  */}
        <TextField
          id="standard-password-input"
          label="Re-enter Password"
          type="password"
          autoComplete="current-password"
          style={{ 
              marginTop: "10px",
              marginLeft: "30px",
              marginRight: "30px" }}
          value={password_again}
          onChange={(e) => {
            setPasswordAgain(e.target.value);
          }}/>

          <div>
          </div>

          {/* Sign Up Button */}
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
              if(password_again===password) 
                setMatch(true); 
              else setMatch(false);
              if(userName!=="" && password!=="" && password_again!=="") {
                setComplete(true); 
                postSignUp();}
              else setComplete(false);
              }
            }>
            Sign Up
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
                  Error happened!
                </Typography>
              )}
        
        {/* Passwords don't match */}
        {pass_match===false && ( 
          <Typography variant="body1" gutterBottom
          style={{ 
            marginTop: "15px",
            marginLeft: "30px",
            fontWeight:"bold" }}>
            Passwords don't match! Please re-enter passwords.
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
          
        {/* Username already exists */}
        {userExists && (
              <Typography variant="body1" gutterBottom
                style={{ 
                  marginTop: "15px",
                  marginLeft: "30px",
                  fontWeight:"bold" }}>
                This username already exists... try something else.
              </Typography>
        )}

      </div>
    </div>
    </Container>
  );
}
export default SignUp;
