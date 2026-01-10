import { useRef, useState } from "react";
import LoginIcon from '@mui/icons-material/Login';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from "axios";
import { API_BASE_URL } from "../../config.js";
import "./Login.css"

function Login({ setShowLogin }: any) {
    const [error, setError] = useState(false);

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const user = {
            email: emailRef.current?.value || "",
            password: passwordRef.current?.value || ""
        };
        console.log(user);
        try {
            const res = await axios.post(`${API_BASE_URL}/api/users/login`, user);
            localStorage.setItem('email', user.email);
            localStorage.setItem('token', res.data.token);
            console.log(res);
            setShowLogin(false);
        } catch (error) {
            console.log(error);
            setError(true);
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