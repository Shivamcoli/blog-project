import {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Logo } from "./index";
import { useDispatch } from "react-redux";
import  authService  from "../appwrite/auth";
import { useForm } from "react-hook-form";
import { login } from "../store/authSlice";


export default function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState("");

    const create = async (data) =>{
        setError("");
        try{
            const userData = await authService.createAccount(data);
            if(userData){
                const userData = await authService.getCurrentUser()
                if(userData) dispatch(login({
                                        userData: {
                                        $id: userData.$id,
                                        name: userData.name,
                                        email: userData.email
                                        }
                                    }));
                navigate("/");
            }
        }
        catch(error){
            setError(error.message);
        }
    };

    return(
        <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
            <div className="mx-auto w-full max-w-lg bg-white rounded-xl p-10 border border-gray-200 shadow-2xl">
                        <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight text-gray-900">Sign up to create account</h2>
                    <p className="mt-2 text-center text-base text-gray-600">
                        Already have an account?&nbsp;
                        <Link
                            to="/login"
                            className="font-medium text-emerald-600 transition-all duration-200 hover:underline hover:text-emerald-800"
                        >
                            Sign In
                        </Link>
                    </p>
                    {error && <p className="text-red-600 mt-8 text-center bg-red-50 p-3 rounded-md border border-red-200">{error}</p>}
                    <form onSubmit={handleSubmit(create)}>
                        <div className='space-y-5 mt-8'>
                            <Input label="Name: " placeholder="Enter your name" type="text" className="focus:ring-emerald-500 focus:border-emerald-500" {...register("name", {required:true})} />
                            <Input label="Email: " placeholder="Enter your email" type="email" className="focus:ring-emerald-500 focus:border-emerald-500" {...register("email",{
                                required:true,
                                validate:{matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                "Email address must be a valid address",
                                        }
                                    }
                            )} />
                            <Input label="Password: " placeholder="Enter your password" type="password" className="focus:ring-emerald-500 focus:border-emerald-500" {...register("password", {required:true})} />
                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg">Create Account</Button>
                        </div>
                    </form>
            </div>
        </div>

)}

