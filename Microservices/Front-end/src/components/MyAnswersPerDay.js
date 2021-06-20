import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

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

export default ( {date, answers} ) => {
    const classes = useStyles();

    const [show, setShow] = useState(false);

    const countAnswers = (date) => {
        const filtered = Object.values(answers).filter(answer => answer.date === date);
        return filtered.length;
    }

    const renderedAnswers = Object.values(answers).map(answer => {
        if(answer.date === date)
            return (
                <Typography variant="body2" component="p" key={answer.id}>
                    <ArrowForwardIosIcon style={{fontSize:'small'}}/> 
                    {answer.content} (For question: "{answer.question_title}")
                </Typography>
            );
    });

    return (
        <Card className={classes.root}>
            <CardContent>
                <Grid container justify="space-between">
                    <Typography inline="true" variant="h6" component="h2" align="left">
                        {date}
                    </Typography>
                    <Typography inline="true" variant="h6" component="h2" align="center">
                        {countAnswers(date)}
                    </Typography>
                    <Button 
                        inline="true"
                        align="right"
                        size="small" 
                        color='secondary' 
                        onClick={() => {setShow(!show)} }
                    >
                        {!show && <>More</>}
                        {show && <>Less</>}
                    </Button>
                </Grid>
                {show && <>{renderedAnswers}</>}
            </CardContent>
        </Card>                     
    ) ;
}