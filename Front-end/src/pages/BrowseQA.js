import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Grid from "@material-ui/core/Grid";
import axios from 'axios';
import QuestionCard from '../components/QuestionCard';

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
            <div
                style={{
                    marginTop: "80px",
                    maxHeight: "78vh",
                    overflowX: "hidden",
                    overflowY: "scroll",
                }}
            >
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