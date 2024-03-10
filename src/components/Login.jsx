import authService from "../appwrite/auth"
import {Link, useNavigate} from "react-router-dom"
import React, {useState} from 'react'
import Button from "./Button"
import Input from './Input'
import Logo from "./Logo"
import {useForm} from "react-hook-form"
import {useDispatch} from "react-redux"
import {login as authLogin} from "../store/authSlice"
import Buffering from "./Buffer"

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const login = async (data) => {
        setLoading(true)
        setError("")
        try {
            const session = await authService.login(data)
            if (session) {
                const userData = await authService.getCurrentUser()
                if (userData) dispatch(authLogin({userData}))
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center w-full px-8">
            <div className={`mx-auto w-full max-w-[512px] bg-gray-100 rounded-xl p-10 border border-black/10 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]`}>
                {loading && <Buffering />}
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <form onSubmit={handleSubmit(login)} className="mt-8">
                    <div className="space-y-5">
                        <Input
                            label="Email : "
                            placeholder="Email Address"
                            type="email"
                            {...register("email", {
                                required: true,
                                
                            })}
                        />
                        <Input
                            label="Password : "
                            type="password"
                            placeholder="Password"
                            {...register("password", { required: true })}
                        />
                        <Button type="submit" className="w-full">
                            Sign in{" "}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login