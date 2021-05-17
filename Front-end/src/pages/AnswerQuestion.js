import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
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

function AnswerQuestion() {
  const [isError, setIsError] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [keywords, setKeywords] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [complete,setComplete]=useState(true);
  const { setAuthTokens } = useAuth();
  const [questions, setQuestions] = useState({});
  const [answers, setAnswers] = useState({});
  let [selectedQuestionId, setSelectedQuestionId] = useState("");

  const fetchQuestions = async () => {
      const res = await axios.get('http://localhost:3011/questions');

      setQuestions(res.data);
  }

  useEffect(() => {
      fetchQuestions();
  }, []);

  const renderedQuestions = Object.values(questions).map(question => {
      return (
          <MenuItem key={question.id} value={question.id}>{question.title}</MenuItem>
      );
  });

  const handleQuestionSelect = (event) => {
    selectedQuestionId = event.target.value;
    setSelectedQuestionId(event.target.value);
    setKeywords(questions[selectedQuestionId].keywords.toString());
    setQuestionContent(questions[selectedQuestionId].content);
    fetchAnswers(selectedQuestionId);
  };

  function postAnswerQuestion() { // Backend call for posting an answer
    axios
      .post(`http://localhost:3012/questions/${selectedQuestionId}/answers`, {
        answerContent: body
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
    setIsError(false);
    setComplete(true);
  }
  
  const fetchAnswers = async (questionId) => {
    const res = await axios.get(`http://localhost:3012/questions/${questionId}/answers`);

    setAnswers(res.data);
  }

  const renderedAnswers = Object.values(answers).map(answer => {
    return (
        <li key={answer.id}>
          {answer.answerContent}
        </li>
    );
});

  const classes = useStyles();

  return (
    <Container maxWidth="sm"> 
    <div
      style={{
        marginTop: "80px",
        maxHeight: "78vh",
        overflowY: "scroll",
      }}
    >
      <h2 type="text" className="text-header" style={{marginTop:"20px"}}>
        Answer Question
      </h2>
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
              textTransform: 'none' // Lowercase letters
          }}>
          Return Home
      </Button>
      
      <div>
        <form>

        {/* Select Question */}
        <FormControl 
          className={classes.formControl}
          style={{ 
            marginTop: "10px",
            marginLeft: "30px",
            marginRight: "30px",
            width:"450px" }}>
          <InputLabel htmlFor="grouped-select">Question</InputLabel>

          <Select 
            defaultValue=''
            id="grouped-select"
            style={{
              width: 400,
            }}
            onChange={handleQuestionSelect}
          >
              {renderedQuestions}
          </Select>

        </FormControl>

          {/* Question Keywords */}
          <TextField
          id="standard-textarea"
          label="Question Keywords"
          multiline
          placeholder="Question Keywords"
          InputProps={{
            readOnly: true
          }}
          style={{ 
            marginTop: "10px",
            marginLeft: "30px",
            marginRight: "30px",
            width:"450px" }}
          value={keywords}
          />

          {/* Question Content */}
          <TextField
          id="standard-textarea"
          label="Question Content"
          multiline
          placeholder="Question Content"
          InputProps={{
            readOnly: true
          }}
          style={{ 
            marginTop: "10px",
            marginLeft: "30px",
            marginRight: "30px",
            width:"450px" }}
          value={questionContent}
          />

          {/* Answer Text Field */}
          <TextField
          id="filled-textarea"
          label="Your Answer"
          placeholder="Your Answer"
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
            onClick={(e) => {
              e.preventDefault();
              if(selectedQuestionId !=="" && body!=="" && keywords!=="") {
                setComplete(true); 
                postAnswerQuestion();
              }
              else setComplete(false);
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
            }}
          >
            Reset
          </Button>
        </form>

        {/* If error during backend call happens*/}
        {isError && (
           <Typography variant="body1" gutterBottom
            style={{ 
              marginTop: "15px",
              marginLeft: "30px",
              fontWeight:"bold" }}>
            Error happened!
          </Typography>
        )}

        {/* If all fields are not completed */}
        {complete===false && (
           <Typography variant="body1" gutterBottom
            style={{ 
              marginTop: "15px",
              marginLeft: "30px",
              fontWeight:"bold" }}>
            All fields required.
          </Typography>
        )}

        {/* answers to selected question */}
        {Object.entries(answers).length > 0 && (
          <div>
            <h6 type="text" className="text-header">
              Other Answers
            </h6>
            <ul>
              {renderedAnswers}
            </ul>
          </div>
        )}

      </div>
    </div>
    </Container>
  );
}
export default AnswerQuestion;
