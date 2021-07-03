import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Grid from "@material-ui/core/Grid";
import axios from 'axios';
import QuestionCard from '../components/QuestionCard';
import Button from "@material-ui/core/Button";

export default function BrowseQA() {
    const [questions, setQuestions] = useState({});

    const fetchQuestions = async () => {
        const res = await axios.get('http://localhost:3011/questions');

        console.log(res.data);

        setQuestions(res.data);
    }

    useEffect(() => {
        fetchQuestions();
    }, []);


    const renderedQuestions = Object.values(questions).map(question => {
        return (
            <QuestionCard key={question.id} question={question}/>
        );
    });

    return (
        <Container 
            maxWidth="md"
        >
            <h2 type="text" className="text-header" style={{marginTop:"100px"}}>
                Browse Questions
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
                {Object.keys(questions).length === 0 &&
                    <h3
                        style={{
                            marginLeft: "80px",
                        }}
                    >
                        Sorry, no questions found...
                    </h3>
                }
                {Object.keys(questions).length > 0 &&
                    <Grid 
                        container 
                        style={{
                            flexGrow: 1,
                        }}
                        spacing={2}
                    >
                        <Grid item xs={12}>
                            <Grid container justify="center" spacing={4}>
                                {renderedQuestions}
                            </Grid>
                        </Grid>

                    </Grid>
                }
            </div>
        </Container>
    );
}