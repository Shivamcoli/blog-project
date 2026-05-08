import {useState, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import authService from './appwrite/auth';
import {login,logout} from'./store/authSlice';
import './App.css'
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { Outlet } from 'react-router-dom';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(()=>{
    authService.getCurrentUser()
    .then((userData)=>{
      if(userData)
      {
        dispatch(
          login({
            userData: {
              $id: userData.$id,
              name: userData.name,
              email: userData.email
            }
          })
        )
      } else{
        dispatch(logout())
      }
    })
    .finally(()=>setLoading(false))
  },[])

  return !loading ? (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Header />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  ) : (
    <div className='min-h-screen flex justify-center items-center bg-gray-50'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
        <p className='mt-4 text-gray-600'>Loading...</p>
      </div>
    </div>
  )
  
}

export default App
