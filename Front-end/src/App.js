import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import MenuAppBar from './components/MenuAppBar';
import Footer from './components/Footer';
import AskQuestion from "./pages/AskQuestion";
import AnswerQuestion from "./pages/AnswerQuestion";
import { AuthContext } from "./context/auth";
import "./App.css";

function App() {
  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  console.log(existingTokens);
  // global state variable for token and hook (function) to update it
  const [authTokens, setAuthTokens] = useState(existingTokens); 

  // Creates tokens item in local storage
  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data); // authTokens=data
  };
  console.log(authTokens);

  function logOut() {
    console.log("Entering Logout.\n");
    console.log(authTokens);
    axios.post(
        "https://localhost:8765/evcharge/api/logout",
        {},
        {headers: {
            "x-observatory-auth": authTokens,
          },
        }
      )
      .then((result) => {
        console.log(result.data);
        if (result.status === 200) {
          // if successfull logout
          console.log("Logout Successful.");
        } else {
          //setIsError(true);
          console.log("Error Happened.");
        }
      })
      .catch((e) => {
        console.log("Error 2:" + e.body);
      });
    setAuthTokens(null); //authTokens=null (or undifined)
    localStorage.removeItem("tokens"); // Token deleted from local storage
  }

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      {/* Sets the context to authTokens, setAuthTokens*/}
      <div className="wrapper">
        <BrowserRouter>
        <MenuAppBar />

        {/*Sets the default route paths*/}
          <Switch>
            <Route path="/SignIn">
              <SignIn />
            </Route>
            <Route path="/SignUp">
              <SignUp />
            </Route>
            <Route path="/AskQuestion">
              <AskQuestion />
            </Route>
            <Route path="/AnswerQuestion">
              <AnswerQuestion />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>

          {/* <button 
            onClick={logOut} 
            type="button" 
            className="button"
            style={{ marginTop: "10px", marginBottom: "10px" }}  >
            Log out
          </button> */}

          
          <Footer />
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
