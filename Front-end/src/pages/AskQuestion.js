import React, { useState } from "react";
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

function AskQuestion() {
  const [isError, setIsError] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [keywords, setKeywords] = useState("");
  const [complete,setComplete]=useState(true);
  const { setAuthTokens } = useAuth();

  function onSubmit(event){
    event.preventDefault();
    setIsError(false);
    if(title!=="" && body!=="" && keywords!=="") {
      setComplete(true); 
      postAskQuestion();
    }
    else 
      setComplete(false);
  }

  function postAskQuestion() { // Backend call for posting a new question
    console.log('Post question was called!');
    console.log('title: ' + title);
    console.log('keywords: ' + keywords);
    console.log('body: ' + body);

    axios
      .post("http://localhost:3011/questions", {
        title: title,
        keywords: keywords,
        content: body,
      })
      .then((response) => {
        // if successfull 
      })
      .catch((e) => {
        setIsError(true);
      });

  }

  function resetFields(){ // Clears all fields
    setTitle("");
    setBody("");
    setKeywords("");
    setIsError(false);
} 
const classes = useStyles();
  return (
    <Container maxWidth="sm"> 
    <div>
      <h2 type="text" className="text-header" style={{marginTop:"100px"}}>
        Ask a New Question
      </h2>

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

      <div>
        <form onSubmit={onSubmit}>

        {/* Question Title */}
        <TextField
          id="standard-textarea"
          label="Question Title"
          multiline
          placeholder="Question Title"
          style={{ 
            marginTop: "10px",
            marginLeft: "30px",
            marginRight: "30px",
            width:"450px" }}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="Question Title"
          />

        {/* Question Keywords */}
        <TextField
          id="standard-textarea"
          label="Question Keywords"
          multiline
          placeholder="Question Keywords"
          style={{ 
            marginTop: "10px",
            marginLeft: "30px",
            marginRight: "30px",
            width:"450px" }}
          value={keywords}
          onChange={(e) => {
              setKeywords(e.target.value);
            }}
        />

          {/* Question Text Field */}
          <TextField
          id="filled-textarea"
          label="Question Text"
          placeholder="Ask a Question"
          multiline
          variant="filled"
            style={{ 
              marginTop: "30px",
              marginLeft: "30px",
              marginRight: "30px", 
              width:"450px"}}
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
            }}
        />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained" 
            color="primary" 
            style={{ 
              marginTop: "10px", 
              marginBottom: "10px" , 
              marginLeft: "30px",
              marginRight: "10px",
              fontWeight: "bold",
              textTransform: 'none' 
            }}
            >
            Submit
          </Button>

          {/* Reset Button */}
          <Button
            type="reset"
            variant="contained" 
            color="secondary" 
            style={{ 
              marginTop: "10px", 
              marginBottom: "10px" , 
              marginRight: "10px",
              fontWeight: "bold",
              textTransform: 'none' }}
            onClick={(e) => {
              resetFields() // If cancel pressed, clear fields
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
export default AskQuestion;
