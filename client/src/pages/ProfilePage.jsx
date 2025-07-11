import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const ProfilePage = () => {
  const navigate = useNavigate()

  const {authUser, updateProfile} = useContext(AuthContext)

  const [name,setName] = useState(authUser?.fullName || "")
  const [bio,setBio] = useState(authUser?.bio || "")
  const [selectedImage, setSelectedImage] = useState(null)

  const handleSubmit = async (e)=>{
    e.preventDefault()
    if(!selectedImage){
      await updateProfile({fullName:name, bio})
      navigate('/')
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(selectedImage)
    reader.onloadend = async () => {
      const base64Image = reader.result
      await updateProfile({fullName:name, bio, profilePic:base64Image})
      navigate('/')
    }
  }
  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 p-10 border-2 border-gray-600 flex items-center justify-center max-sm:flex-col-reverse rounded-lg'>
        <form  onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e)=> setSelectedImage(e.target.files[0])} type='file' id='avatar' accept='.png, .jpg, .jpeg' hidden />
            <img src={selectedImage ? URL.createObjectURL(selectedImage) : assets.avatar_icon}  className={`w-20 h-20 ${selectedImage && 'rounded-full'}`}/>
          </label>
          <input type='text' value={name} onChange={(e)=>setName(e.target.value)} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'/>
          <textarea value={bio} onChange={(e)=>setBio(e.target.value)} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'></textarea>
          <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600 text-white py-2 rounded-md hover:opacity-90 transition-opacity duration-300'>
            Save
          </button>
        </form>
        <img src={authUser.profilePic ? authUser.profilePic : assets.logo_icon} className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${authUser.profilePic && 'rounded-full'}`} />
      </div>
    </div>
  )
}

export default ProfilePage