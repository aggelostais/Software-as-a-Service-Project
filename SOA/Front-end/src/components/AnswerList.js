import React, { useState, useEffect } from 'react';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';


export default ( {questionId} ) => {

    const [answers, setAnswers] = useState({});

    useEffect(() => {
        fetchAnswers();
    }, []);
    
    const fetchAnswers = async () => {
        const res = await axios.get(`http://localhost:3012/questions/${questionId}/answers`);
    
        setAnswers(res.data);
    }
    
    const renderedAnswers = Object.values(answers).map(answer => {
        return (
            <Typography variant="body2" component="p" key={answer.id}>
                <ArrowForwardIosIcon style={{fontSize:'small'}}/> 
                {answer.creator}: {answer.answerContent}
            </Typography>
        );
    });

    return (
        <>
            {renderedAnswers}
        </>
    ) ;
}