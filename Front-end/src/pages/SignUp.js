import React, { useState} from "react";
import axios from "axios";
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import "../App.css";

function SignUp(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password_again, setPasswordAgain] = useState('');
    const [message,setMessage]=useState('');
    const [status,setStatus]=useState(false);
    const [submit,setSubmit]=useState(false);
    const [error,setError]=useState(false);
    const [seconds, setSeconds] = useState(6);

    // Timer for Redirecting in Sign In page if Sign Up successful
    React.useEffect(() => {

        // If Sign Up successful start timer
        if (status && seconds > 1)
            setTimeout(() => setSeconds(seconds - 1), 1000);

        // If timer=0
        else {if (status)
                window.location.href = '/SignIn';
        }
    });

    // Check if all fields completed
    function Complete() {
        return(
            username.length > 0 &&
            password.length > 0 &&
            password_again.length>0
        );
    }

    function PasswordsMatch() {
        return (password === password_again);
    }

    // Handle Submit Button press
    function handleSubmit(event) {
        event.preventDefault();
        setSubmit(true);

        // If all fields are not completed or passwords don't match
        if(!Complete() || !PasswordsMatch())
            return

        // Backend call for signup
        axios.post("/signup", {
                    username: username,
                    password: password
                })
                .then((response) => {
                    // if successful signup backend call
                    setMessage(response.data.result);
                    setStatus(response.data.status);
                })
                .catch((e) => {   // If error happened during backend call
                    setError(true);
                });

        }

        // If Reset pressed, clears all fields and messages
        function resetFields() {
            setUsername('');
            setPassword('');
            setPasswordAgain('');
            setMessage('');
            setSubmit(false);
        };

    return (
        <Container maxWidth="sm">
            <div>
                <h2 type="text" className="text-header" style={{marginTop: "100px"}}>
                    Sign Up
                </h2>
                <nav>

                    {/* Return Home Button */}
                    <Button
                        href="/"  // Redirects to Home Page
                        variant="contained" color="primary"  // Primary colour blue
                        style={{
                            width: "150px",
                            marginTop: "15px",
                            marginBottom: "20px",
                            marginLeft: "30px",
                            marginRight: "10px",
                            fontWeight: "bold",
                            textTransform: 'none' // Lowercase letters in button text
                        }}>
                        Return Home
                    </Button>

                </nav>
                <div>
                    <form>

                        {/* Username */}
                        <TextField
                            id="standard-textarea"
                            label="Email (username)"
                            style={{
                                marginTop: "10px",
                                marginLeft: "30px",
                                marginRight: "30px",
                            }}
                            value={username}
                            onChange={(e) => {
                                // When changing value previous messages should be cleared
                                setUsername(e.target.value);
                                setSubmit(false);
                                setMessage('');
                            }}
                        />

                        <br></br>

                        {/* Password  */}
                        <TextField
                            id="standard-password-input"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            style={{
                                marginTop: "10px",
                                marginLeft: "30px",
                                marginRight: "30px"
                            }}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setSubmit(false);
                                setMessage('');
                        }}
                        />

                        <br></br>

                        {/* Re-enter Password  */}
                        <TextField
                            id="standard-password-input"
                            label="Re-enter Password"
                            type="password"
                            autoComplete="current-password"
                            style={{
                                marginTop: "10px",
                                marginLeft: "30px",
                                marginRight: "30px"
                            }}
                            value={password_again}
                            onChange={(e) => {
                                setPasswordAgain(e.target.value);
                                setSubmit(false);
                                setMessage('');
                            }}
                        />

                        <div></div>

                        {/* Sign Up Button */}
                        <Button
                            variant="contained"
                            color="primary"
                            style={{
                                marginTop: "10px",
                                marginBottom: "10px",
                                marginLeft: "30px",
                                marginRight: "10px",
                                fontWeight: "bold",
                                textTransform: 'none'
                            }}
                            onClick={handleSubmit}>
                            Sign Up
                        </Button>

                        {/* Reset Button */}
                        <Button
                            variant="contained"
                            color="secondary"
                            style={{
                                marginTop: "10px",
                                marginBottom: "10px",
                                marginRight: "10px",
                                fontWeight: "bold",
                                textTransform: 'none'
                            }}
                            type="reset"
                            onClick={resetFields}>
                            Reset
                        </Button>

                    </form>

                    {/* Error during backend call */}
                    {error && (
                        <Typography variant="body1" gutterBottom
                                    style={{
                                        marginTop: "15px",
                                        marginLeft: "30px",
                                        fontWeight: "bold"
                                    }}>
                            Error during connection with backend happened.
                        </Typography>
                    )}

                    {/* All fields are not completed */}
                    { submit &&
                        !(username.length > 0 &&
                        password.length > 0 &&
                        password_again.length>0) &&
                    (<Typography variant="body1" gutterBottom
                                 style={{
                                     marginTop: "15px",
                                     marginLeft: "30px",
                                     fontWeight: "bold"
                                 }}>
                            All fields required.
                        </Typography>
                    )}

                    {/* Passwords don't match */}
                    { (submit &&
                        username.length > 0 &&
                        password.length > 0 &&
                        password_again.length>0) && password !== password_again &&
                        (<Typography variant="body1" gutterBottom
                                     style={{
                                         marginTop: "15px",
                                         marginLeft: "30px",
                                         fontWeight: "bold"
                                     }}>
                                Passwords don't match! Please re-enter passwords.
                            </Typography>
                    )}

                    {/* Signup Message from the Backend, if successful */}
                    { message !== '' &&
                        (<Typography variant="body1" gutterBottom
                                     style={{
                                         marginTop: "15px",
                                         marginLeft: "30px",
                                         fontWeight: "bold"
                                     }}>
                                {message}
                            </Typography>
                    )}

                    {/*Redirection to Sign In message*/}
                    { status &&
                        (<Typography variant="body1" gutterBottom
                                     style={{
                                         marginLeft: "30px",
                                         fontWeight: "bold"
                                     }}>
                                To use AskMeAnything you should Sign In.
                                <br/>
                                Redirecting in Sign In in {seconds} seconds.
                            </Typography>
                    )}

                </div>
            </div>
        </Container>
    );
}

export default SignUp;
