import React, {useEffect, useState} from 'react';
import { makeStyles, useTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SearchIcon from '@material-ui/icons/Search';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link'
import axios from "axios";
import {AuthContext} from "../context/auth";
import QuestionAnswerOutlinedIcon from "@material-ui/icons/QuestionAnswerOutlined";
import ContactSupportOutlinedIcon from "@material-ui/icons/ContactSupportOutlined";
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import EmailIcon from '@material-ui/icons/Email';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import GitHubIcon from '@material-ui/icons/GitHub';


const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'flex'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
     // this group of buttons will be aligned to the right side
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  // this group of buttons will be aligned to the right side
  toolbarButtons: {
    marginLeft: 'auto',
  },
  signButton: {
    margin: 3,
    fontSize:15,
    textTransform:"none",
    fontWeight:"bold",
    "&:hover": {
      background: "#fff",
      color: "#000",
      textTransform: "none"
  }
  },
  homeLink: {
    color: "inherit",
    "&:hover": {
        color: "inherit",
        textDecoration: "none"
    }
  },
}));

export default function MenuAppBar() {
  const classes = useStyles();
  const theme = useTheme();
  const [authTokens, setAuthTokens] = useState(JSON.parse(localStorage.getItem("tokens")));
  let [auth,setAuth]=useState(null);
  const [open, setOpen] = React.useState(false);
  let [user,setUser]=useState(null);

  // Creates token item in local storage
  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data); // authTokens=data
  };

  // Checks if token is valid
  const checkUser = async () => {
    try{
      const res = await axios.get('https://soa-authenticator.herokuapp.com/whoami', { headers: {'Authorization': 'Bearer '+ authTokens}});
      setAuth(true);
      setUser(res.data.user.username);
  }
    catch(error){
      setAuth(false);
    }
  }

   useEffect(() => {
    checkUser();
   }, []);

  function logOut() {
    console.log("Entering Logout.\n");
    localStorage.removeItem("tokens"); // Token deleted from local storage
    setAuth(false);
    setAuthTokens(null);
    console.log(authTokens);
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open
        })}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open
            })}>

        {/* AskMeAnything Logo */}
        <MenuIcon />
          </IconButton> 
          <img 
          src='logo192.png' 
          width="42px"
          height="42px" 
          style={{marginRight:"30px"}}
        />

        {/*AskMeAnything Text*/}
        <Typography variant="h5" noWrap>
          <Link className={classes.homeLink} href="/">
            AskMeAnything!
          </Link>
        </Typography>

        {/* User not Signed In */}
        {!auth && (
          <div className={classes.toolbarButtons}>
          <Button
            className={classes.signButton}
            color="inherit"
            href="/SignIn"
            >
            Sign In
          </Button>
          <Button
            className={classes.signButton}
            color="inherit"
            href="/SignUp"
            >
            Sign Up
          </Button>
        </div>)}

        {/* User Signed In */}
        {auth &&(
            <div className={classes.toolbarButtons}>
              <Button
                  className={classes.signButton}
                  variant="contained"
                  disabled
                  startIcon={<AccountCircleOutlinedIcon />}
              >
                {user}
              </Button>
            <Button
                className={classes.signButton}
                color="inherit"
                fontWeight="bold"
                href="/Profile"
            >
              My Profile
            </Button>
              <Button
                    className={classes.signButton}
                    color="inherit"
                    onClick={(e)=>{logOut()}}
                    href="/"
                >
                  Sign Out
                </Button>
            </div>
        )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })
        }}>
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>

        {/*Questions and Answers Group*/}
        <Divider/>

        <List>
            <ListItem 
                button component="a" // to add link in list item
                button key="Browse Questions"
                href="/Browse">
              <ListItemIcon>
                  <SearchIcon/>
              </ListItemIcon>
              <ListItemText primary="Browse Questions"/>
            </ListItem>

            <ListItem 
                button component="a" // to add link in list item
                button key="Ask New Question"
                href="/AskQuestion">
              <ListItemIcon>
                  <ContactSupportOutlinedIcon/>
              </ListItemIcon>
              <ListItemText primary="Ask New Question"/>
            </ListItem>

            <ListItem 
                button component="a" 
                button key="Answer Question"
                href="/AnswerQuestion">
              <ListItemIcon>
                <QuestionAnswerOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Answer Question"/>
            </ListItem>
        </List>
        <Divider/>

        {/*Project Group*/}
        <List>

          {/*Documentation*/}
          <ListItem
              button component="a"
              button key="Documentation"
              href="/ProjectDoc">
            <ListItemIcon>
              <FindInPageIcon/>
            </ListItemIcon>
            <ListItemText primary="Documentation"/>
          </ListItem>

            {/*Github*/}
            <ListItem
                button component="a"
                button key="Github"
                href="https://github.com/SokPoutas/Saas-Project">
              <ListItemIcon>
                <GitHubIcon/>
              </ListItemIcon>
              <ListItemText primary="Github"/>
            </ListItem>
        </List>

        {/*Contact Group*/}
        <Divider/>
        <List>

          <ListItem
              button component="a" // to add link in list item
              button key="Contact"
              href="/Contact">
            <ListItemIcon>
              <EmailIcon/>
            </ListItemIcon>
            <ListItemText primary="Contact"/>
          </ListItem>

          <ListItem
              button component="a" // to add link in list item
              button key="About"
              href="/About">
            <ListItemIcon>
              <InfoRoundedIcon/>
            </ListItemIcon>
            <ListItemText primary="About"/>
          </ListItem>

        </List>

      </Drawer>
    </div>
      </AuthContext.Provider>
  );
}