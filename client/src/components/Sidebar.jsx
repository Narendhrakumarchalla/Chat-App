import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'

const Sidebar = () => {

  const navigate = useNavigate();
  const [input, setInput] = useState('');

  const { logout, onlineUsers, setOnlineUsers } = useContext(AuthContext)
  const { selectedUser, setSelectedUser, getAllUsers, unseenMessages, users, setUnseenMessages } = useContext(ChatContext);

  const filteredUsers = input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase()) ) : users

  useEffect(()=>{
    getAllUsers()
  },[onlineUsers])

  return (
    <div className={`bg-[#818582]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ''}`}>
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
          <img src={assets.logo} className='max-w-40'/>
          <div className='relative py-2 group'>
            <img src={assets.menu_icon}  className='max-h-5 cursor-pointer'/>
            <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
              <p  onClick={()=> navigate('/profile') } className='cursor-pointer text-sm'>Edit Profile</p>
              <hr className='my-2 border-t border-gray-500'/>
              <p className='cursor-pointer text-sm' onClick={()=>logout()}>Logout</p>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2 px-4 py-3 mt-5 bg-[#282142] rounded-full'>
          <img src={assets.search_icon} className='w-3'/>
          <input type='text' value={input} onChange={(e)=> setInput(e.target.value)} className=' bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1' placeholder='Search User...' />
        </div>
      </div>
      <div className='flex flex-col'>
        {
          filteredUsers.map((user , index) => (
            <div key={index} onClick={()=>{setSelectedUser(user); setUnseenMessages(prev=>({...prev, [user._id]: 0}))}} className={`relative flex items-center gap-3 p-2 pl-4 rounded cursor-pointer hover:bg-[#282142]/50 max-sm:text-sm ${selectedUser?._id === user._id ? 'bg-[#282142]/20' : ''}`}>
              <img src={user?.profilePic || assets.avatar_icon}  className='w-[35px] rounded-full aspect-[1/1] '/>
              <div className='flex flex-col'>
                  <p>
                    {user.fullName}
                  </p>
                  {
                    onlineUsers.includes(user._id) ?
                    (<span className='text-green-400 text-xs '>Online</span> ) : 
                    (<span className='text-neutral-400 text-xs'>Offline</span>)
                  }
              </div>
                {
                  unseenMessages[user._id] > 0 && (
                    <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50 '>{unseenMessages[user._id]}</p>
                  )
                }
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Sidebar