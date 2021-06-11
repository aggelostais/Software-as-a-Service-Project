import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import "../components/Sessions.css";
import MyQuestions from '../components/MyQuestions';
import MyAnswers from "../components/MyAnswers";

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

export default function Profile({token}) {
  const classes = useStyles();
  const [authorized, setAuthorized]= useState(true);

  const checkUser = async () => {
    try{
      const res = await axios.get('http://localhost:3010/whoami', { headers: {'Authorization': 'Bearer '+ token}});

      setAuthorized(true);
    }
    catch(error){
      setAuthorized(false);
      window.location.href = '/';
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

  return(
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <MyQuestions token={token}/>
          <MyAnswers token={token}/>
        </Paper>
      </div>
  );
}


