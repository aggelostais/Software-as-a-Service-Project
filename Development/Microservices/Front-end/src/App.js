import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import MenuAppBar from './components/MenuAppBar';
import AskQuestion from "./pages/AskQuestion";
import AnswerQuestion from "./pages/AnswerQuestion";
import BrowseQA from "./pages/BrowseQA";
import Profile from "./pages/Profile";
import { AuthContext } from "./context/auth";
import "./App.css";

function App() {
  // Global state variable for token and hook (function) to update it
  // Initial value: Existing token in Local Storage
  const [authTokens, setAuthTokens] = useState(JSON.parse(localStorage.getItem("tokens")));
  console.log("Token loaded from Local Storage: "+authTokens);

  // Creates token item in local storage
  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data); // authTokens=data
  };


  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      {/* Sets the context to authTokens, setAuthTokens*/}
      <div className="wrapper">
        <BrowserRouter>
        <MenuAppBar/>

        {/*Sets the default route paths*/}
          <Switch>
            <Route path="/SignIn">
              <SignIn />
            </Route>
            <Route path="/SignUp">
              <SignUp />
            </Route>
            <Route path="/AskQuestion">
              <AskQuestion token={authTokens}/>
            </Route>
            <Route path="/AnswerQuestion">
              <AnswerQuestion token={authTokens}/>
            </Route>
            <Route path="/Browse">
              <BrowseQA />
            </Route>
            <Route path="/Profile">
              <Profile token={authTokens}/>
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>

        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
