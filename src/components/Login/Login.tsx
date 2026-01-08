import { useRef, useState } from "react";
import LoginIcon from '@mui/icons-material/Login';
import axios from "axios";

function Login() {
    const [error, setError] = useState(false);

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('handleSubmit');
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
            </form>
        </div>
    );
}

export default Login;