import  { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input, Logo } from './index'
import { useDispatch } from "react-redux";
import  authService  from "../appwrite/auth";
import { useForm } from "react-hook-form";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState("");

    const login = async (data) => {
        setError("");
        try {
            const session = await authService.login(data);
            if (session) {
                const userData = await authService.getCurrentUser();
                if (userData) {
                    dispatch(
                        authLogin({
                            userData: {
                                $id: userData.$id,
                                name: userData.name,
                                email: userData.email
                            }
                        })
                    );
                }
                navigate("/");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="mx-auto w-full max-w-lg bg-white rounded-xl p-10 border border-gray-200 shadow-2xl">
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight text-gray-900">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-base text-gray-600">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-indigo-600 transition-all duration-200 hover:underline hover:text-indigo-800"
                    >
                        Sign Up
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center bg-red-50 p-3 rounded-md border border-red-200">{error}</p>}
                <form onSubmit={handleSubmit(login)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input  
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            className="focus:ring-indigo-500 focus:border-indigo-500"
                            {...register("email",{
                                required:true,
                                validate:{matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                "Email address must be a valid address",
                                        }
                                    }
                            )}
                        />
                        <Input 
                            label="Password:"
                            type="password"
                            placeholder="Enter your password"
                            className="focus:ring-indigo-500 focus:border-indigo-500"
                            {
                                ...register("password",{required:true})
                            }
                        />
                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg">
                            Sign In
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
