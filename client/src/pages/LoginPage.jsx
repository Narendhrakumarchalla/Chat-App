import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {
  const [currentState , setCurrentState] = useState("Login")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const [bio , setBio] = useState("")
  
  const {login}=useContext(AuthContext) 

  const submitHandler = (e)=>{
      e.preventDefault()
      if (currentState === "Sign Up" && !isDataSubmitted) {
        if (password !== confirmPassword) {
          alert("Passwords do not match")
          return
        }
        setIsDataSubmitted(true)
        return
      }
      login(currentState === "Sign Up" ? 'signup' : 'login' , fullName,email,password,bio)
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex itmes-center p-25 justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      <img src={assets.logo_big} className='w-[min(30vw,250px)]' />

      <form onSubmit={submitHandler} className=' border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg ' >
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currentState} 
          {isDataSubmitted && (
          <img onClick={()=> setIsDataSubmitted(false)} src={assets.arrow_icon} className='w-5 cursor-pointer' />
          )}
        </h2>
        {
          currentState === "Sign Up" && !isDataSubmitted && (
            <input type='text' value={fullName} onChange={(e)=> setFullName(e.target.value)} name='fullname' placeholder='Full Name' className='p-2 border border-gray-500 rounded-md focus:outline-none' required/>
          )
        }
        { 
          !isDataSubmitted && 
            <>
              <input type='email' value={email} onChange={(e)=> setEmail(e.target.value)} name='email' placeholder='Email' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' required/>
              <input type='password' value={password} onChange={(e)=> setPassword(e.target.value)} name='password' placeholder='Password' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' required/>
            </>
        }
        {
          currentState === "Sign Up" &&  !isDataSubmitted &&  (
            <input type='password' value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} name='confirmPassword' placeholder='Confirm Password' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' required/>
          )
        }

        {
          isDataSubmitted && currentState === "Sign Up" && (
            <textarea rows={4} name='bio' placeholder='Tell us about yourself...' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' value={bio} onChange={(e) => setBio(e.target.value)} required></textarea>
          )
        }

        {/* checkbox for tetms and consitions */}
        <div className='flex items-center gap-2'>
          <input type='checkbox' name='terms' id='terms' className='accent-purple-500' required/>
          <label htmlFor='terms' className='text-sm'>I agree to the terms and conditions</label>
        </div>

        <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600 text-white py-2 rounded-md hover:opacity-90 transition-opacity duration-300'>
          {currentState === "Sign Up" || !isDataSubmitted ? currentState : "Login" }
        </button>
        {/* Switch to login */}
        <p className='text-sm text-center'>
          {currentState === "Sign Up" ? "Already have an account?" : "Don't have an account?"} 
          <span onClick={() => setCurrentState(currentState === "Sign Up" ? "Login" : "Sign Up")} className='text-purple-400 cursor-pointer'>
            {currentState === "Sign Up" ? "Login" : "Sign Up"}
          </span>
        </p>

      </form>
    </div>
  )
}

export default LoginPage