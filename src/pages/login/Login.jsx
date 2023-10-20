import { useDispatch } from 'react-redux';
import React, { useState } from 'react'
import { login } from '../../redux/apiCalls';
import './login.css'

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const handleClick = (e) => {
        e.preventDefault();
        login(dispatch, {username, password});
    };

  return (
    <div className='loginMain'>
        <div className="center">
            <h1>Admin Login</h1>
            <div>
                <div className="txt_field">
                    <input type="text" required onChange={e=>setUsername(e.target.value)}/>
                        <span></span>
                        <label>Username</label>
                </div>
                <div className="txt_field">
                    <input type="password" required onChange={e=>setPassword(e.target.value)}/>
                        <span></span>
                        <label>Password</label>
                </div>
                <button onClick={handleClick}>Login</button>
            </div>
        </div>
    </div>
)
}

export default Login