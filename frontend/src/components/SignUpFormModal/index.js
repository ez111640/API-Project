import { useState } from "react"
import * as sessionActions from '../../store/session';
import { Redirect} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./SignUpForm.css"
import { useModal } from "../../context/modal";


function SignUpFormModal() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user)
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail ] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors,setErrors] = useState({})
    const  {closeModal} = useModal();


    if(sessionUser) return <Redirect to="/"/>

    const onSubmit = e=> {
        e.preventDefault();
        if(password === confirmPassword) {
            setErrors({})
            return dispatch(
                sessionActions.signup({
                    username,
                    firstName,
                    lastName,
                    email,
                    password
                })
            )
            .then(closeModal)
            .catch(async res => {

                const data = await res.json();
                if(data && data.errors) {
                    console.log("DAtA ERRORS" , data.errors)
                    setErrors(data.errors)
                }
            })
        }
        return setErrors({
            confirmPassword: "Passwords don't match"
        })

    }
    return (
        <div className = "signup-div">
            <h2>Sign Up</h2>
            <form className = "signup-form" onSubmit={onSubmit}>
                <label>First Name
                    <input
                    type="text"
                    value={firstName}
                    onChange={e=> setFirstName(e.target.value)}></input>
                </label>
                <label>Last Name
                    <input
                    type="text"
                    value={lastName}
                    onChange = {e=> setLastName(e.target.value)}></input>
                </label>
                    {errors.firstName ? <p>{errors.firstName}</p> : <p></p>}
                {errors.lastName ? <p>{errors.lastName}</p> : <p></p>}
                <label>Email
                    <input
                    type="text"
                    value={email}
                    onChange={e=> setEmail(e.target.value)}></input>
                </label>

                <label>Username
                    <input
                    type="text"
                    value={username}
                    onChange={e=> setUsername(e.target.value)}></input>
                </label>
                {errors.email ?  <p>{errors.email}</p> : <p></p>}
                {errors.username ? <p>{errors.username}</p> : <p></p>}
                <label>Password
                    <input
                    type="text"
                    value={password}
                    onChange={e=> setPassword(e.target.value)}></input>
                </label>

                <label>Confirm Password
                    <input
                    type="text"
                    value={confirmPassword}
                    onChange = {e=> setConfirmPassword(e.target.value)}></input>
                </label>
                {errors.password ? <p>{errors.password}</p> : <p></p>}

                <button className= "signup-button" type="submit" disabled={!username || !firstName || !lastName || !password || !email || !password || !confirmPassword|| username.length <4 || password.length < 6}>Sign Up</button>
            </form>
        </div>
    )
}

export default SignUpFormModal
