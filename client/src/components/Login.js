import React from 'react'
import './Login.css'
import axios from 'axios'
import { TextField, Button, Snackbar, IconButton } from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import history from '../history'

const Login = () => {
    const [open, setOpen] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const username = e.target['0'].value;
        const password = e.target['1'].value;

        const data = { username: username, password: password }
        // send this in the backend and save the username and password;
        axios.post('/api/login', data)
            .then(res => {
                setOpen(true)
                setTimeout(() => {
                    setOpen(false);
                }, 2000);
                history.push('/');
                console.log(history)
                window.location.reload()
                sessionStorage.setItem('username', username);
                console.log(res);
            })
            .catch(err => console.log(err))

    }
    return (
        <div>
            < Snackbar open={open} autoHideDuration={6000} message="Successfull" />
            <form className='login__form' action="" onSubmit={handleSubmit}>
                <h3>Login</h3>
                <TextField required={true} id="standard-basic" label="Username" variant="standard" className='text__input username' />
                <div className="password__container">
                    <TextField type={showPassword ? 'text' : 'password'} required={true} id="standard-basic" label="Password" variant="standard" className='text__input password' />
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ marginTop: '8px' }}
                    >
                        {showPassword ? <VisibilityIcon fontSize='small' /> : <VisibilityOffIcon fontSize='small' />}
                    </IconButton>
                </div>
                <Button style={{ marginTop: '24px', marginBottom: '16px' }} variant='contained' color='primary' type="submit" className='text__input login__button'>Login</Button>
            </form>
        </div>
    )
}

export default Login
