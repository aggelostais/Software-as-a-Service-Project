import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import "../components/Sessions.css";
import QuestionsPerKeyword from '../components/QuestionsPerKeyword';
import QuestionsPerDay from '../components/QuestionsPerDay';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 100,
    marginLeft: 200,
    marginRight: 200,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginLeft:20,
    marginRight:20,
  },
}));

export default function Home() {
  
  const classes = useStyles();
  return(
      <div className={classes.root}>
        <Grid container spacing={1}>
          <Grid item xs>
            <Paper className={classes.paper}>
              <QuestionsPerKeyword/>
            </Paper>
          </Grid>
          <Grid item xs>
            <Paper className={classes.paper}>
              <QuestionsPerDay/>
            </Paper>
          </Grid>
        </Grid>
      </div>
  );
}


