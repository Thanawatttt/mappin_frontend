import { useRef, useState } from "react";
import LoginIcon from '@mui/icons-material/Login';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from "axios";
import "./Login.css"

function Login({ setShowLogin }: any) {
    const [error, setError] = useState(false);

    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const user = {
            email: emailRef.current ? emailRef.current.value : "",
            password: passwordRef.current ? passwordRef.current.value : ""
        };
        console.log(user);
        try {
            const res = await axios.post("/api/users/login", user);
            localStorage.setItem('email', user.email);
            localStorage.setItem('token', res.data.token);
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="loginContainer">
            <div className="logo">
                <LoginIcon className="logoIcon"></LoginIcon>
                <span>LamaPin</span>
            </div>
            <form onSubmit={handleSubmit}>
                <input autoFocus placeholder="email" ref={emailRef} />
                <input
                    type="password"
                    minLength={6}
                    placeholder="password"
                    ref={passwordRef}
                />
                <button className="loginBtn" type="submit">Login</button>
                {error && <span className="failure">Invalid email or password</span>}
            </form>
            <CancelIcon className="loginCancel" onClick={() => { setShowLogin(false) }}></CancelIcon>
        </div>
    );
}

export default Login;