import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import "../components/Sessions.css";
import "../App.css";

function AskQuestion({token}) {
  const [isError, setIsError] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [keywords, setKeywords] = useState("");
  const [complete,setComplete]= useState(true);
  const [authorized, setAuthorized]= useState(false);

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
      },
      {headers: {'Authorization': 'Bearer '+ token}}
      )
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

  const checkUser = async () => {
    try{
      const res = await axios.get('http://localhost:3010/whoami', { headers: {'Authorization': 'Bearer '+ token}});

      setAuthorized(true);
    }
    catch(error){
      setAuthorized(false);
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

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

      {!authorized &&
        <div>
          <Typography>
            You need to be logged in to ask a question
          </Typography>
          <Button 
                href="/SignIn"  //Redirects to Sign in  Page
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
              Sign In
          </Button>
        </div>
      }

      {authorized &&  
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
      }
    </div>
    </Container>
  );
}
export default AskQuestion;
