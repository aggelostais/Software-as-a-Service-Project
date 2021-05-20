import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import AnswerList from '../components/AnswerList';

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

export default ( {question} ) => {
    const classes = useStyles();

    const [show, setShow] = useState(false);

    return (
        <Grid key={question.id} item>
            <Card className={classes.root} variant="outlined">
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {question.title}
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {question.content}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                        {question.keywords.join(', ')}
                    </Typography>
                    {show && <AnswerList questionId={question.id} />}
                </CardContent>
                <CardActions>
                    <Button 
                        size="small" 
                        color='secondary' 
                        onClick={() => {setShow(!show)} }
                    >
                        {!show && <>Show Answers</>}
                        {show && <>Hide Answers</>}
                    </Button>
                    <Button 
                        size="small" 
                        color='primary' 
                        href='/AnswerQuestion' 
                        style={{ 
                            marginLeft: "180px",
                        }}
                    >
                        Answer
                    </Button>
                </CardActions>
            </Card>                        

        </Grid>
    ) ;
}