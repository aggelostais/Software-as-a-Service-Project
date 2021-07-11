import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import MyAnswersPerDay from './MyAnswersPerDay';

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

export default function MyAnswers({token}) {

    const [answers, setAnswers] = useState([]);

    // Backend call
    const fetchAnswers = async () => {
        const res = await axios.get('https://soa-answers.herokuapp.com/myAnswers', { headers: {'Authorization': 'Bearer '+ token}});
        setAnswers(res.data);
      }

    // Performs this side effect after each render
    useEffect(() => {
        fetchAnswers();
    }, []); 

    const dateDone = {};
    const bringAnswersPerDay = Object.values(answers).map(answer => {
        if(!dateDone[answer.date]){
            dateDone[answer.date] = 1;
            return (
                <MyAnswersPerDay date={answer.date} answers={answers} key={answer.id}/>
            );
        }
    });

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography variant="body1" gutterBottom
                        style={{
                            fontWeight:"bold", fontSize: 20}}>
                My Answers
            </Typography>
            {bringAnswersPerDay}
        </div>
    );
}
