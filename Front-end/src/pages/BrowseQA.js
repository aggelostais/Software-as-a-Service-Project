import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from "@material-ui/core/Grid";
import axios from 'axios';
import QuestionCard from '../components/QuestionCard';

const useStyles = makeStyles({
  root: {
    minWidth: 420,
    maxWidth: 420,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function BrowseQA() {
    const classes = useStyles();

    const [questions, setQuestions] = useState({});

    const fetchQuestions = async () => {
        const res = await axios.get('http://localhost:3011/questions');

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
            </div>
        </Container>
    );
}