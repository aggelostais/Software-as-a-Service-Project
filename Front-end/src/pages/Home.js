import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import "../components/Sessions.css";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 350,
    width: 250,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  control: {
    padding: theme.spacing(2)
  }
}));

export default function Home() {
  
  const classes = useStyles();

  return (
    <Container maxWidth="sm">

      <div>
        <h1
          type="text"
          className="text-body"
          style={{ 
            fontFamily: "Roboto", 
            marginTop:"100px",
            marginBottom:"50px"}}>
          Welcome
        </h1>
      </div>

      <Button 
        href="/Browse"  //Redirects to Home Page
        variant="contained" color="primary"  // Primary colour blue
        style={{  
          marginBottom: "20px", 
          marginLeft: "30px",
          fontWeight: "bold", 
          textTransform: 'none' // Lowercase letters
        }}>
          Browse Questions
      </Button>
      
      {/* Graphs Grid */}
      <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={4}>
            <Grid key={0} item>
              <Paper className={classes.paper}> 
              Questions Per Keyword: Graph/Table
              </Paper>
            </Grid>
            <Grid key={1} item>
              <Paper className={classes.paper}>
              Questions Per Day: Graph/Table  
              </Paper>
            </Grid>
        </Grid>
      </Grid>
      </Grid>

    </Container>
    );
  }


