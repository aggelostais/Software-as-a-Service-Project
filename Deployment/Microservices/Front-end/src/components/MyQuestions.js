import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import MyQuestionsPerDay from './MyQuestionsPerDay';

const useStyles = makeStyles({

    root: {
        minWidth: 420,
        maxWidth: 420,
      },
    table: {
        Width: 150,
        height:300
    }
});

export default function MyQuestions({token}) {

    const [questions, setQuestions] = useState([]);

    // Backend call
    const fetchQuestions = async () => {
        const res = await axios.get('https://microservices-questions.herokuapp.com/questions/myQuestions', { headers: {'Authorization': 'Bearer '+ token}});
        setQuestions(res.data);
      }

    // Performs this side effect after each render
    useEffect(() => {
        fetchQuestions();
    }, []); 

    const dateDone = {};
    const bringQuestionsPerDay = Object.values(questions).map(question => {
        if(!dateDone[question.date]){
            dateDone[question.date] = 1;
            return (
                <MyQuestionsPerDay date={question.date} questions={questions} key={question.id}/>
            );
        }
    });

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography variant="body1" gutterBottom
                        style={{
                            fontWeight:"bold", fontSize: 20}}>
                My Questions
            </Typography>
            {bringQuestionsPerDay}
        </div>
    );
}
