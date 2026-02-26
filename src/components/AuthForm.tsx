"use client"

import React, { useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import Image from 'next/image'
import Link from 'next/link'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store/hooks'
import { setAccessToken, setUser } from '@/store/slices/authSlice'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

const AuthForm = ({ isLogin }: { isLogin: boolean }) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            setLoading(true);

            const response = await api.post("/api/auth/login", { email, password });

            if (response.status === 200) {
                const { data } = response.data;
                dispatch(setUser(data.user));
                dispatch(setAccessToken(data.token));
                toast.success(response.data.message || "Login successful");
                router.push("/dashboard");
            }
        } catch (error: any) {
            console.log(error);
            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);

            if (error.response?.status === 403) {
                setVerifyDialogOpen(true);
            }
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            setLoading(true);

            if (password !== confirmPassword) {
                toast.error("Passwords do not match");
                setLoading(false);
                return;
            }

            if (password.length < 6) {
                toast.error("Password must be at least 6 characters");
                setLoading(false);
                return;
            }

            const response = await api.post("/api/auth/register", { fullName, email, password });

            if (response.status === 201) {
                toast.success(response.data.message || "Registration successful. Please verify your email.");
                router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
            }
        } catch (error: any) {
            console.log(error);
            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const handleSendVerification = async () => {
        try {
            setResendLoading(true);
            await api.post("/api/auth/resend-otp", { email });
            toast.success("Verification email sent!");
            setVerifyDialogOpen(false);
            router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to send verification email";
            toast.error(errorMessage);
        } finally {
            setResendLoading(false);
        }
    }

    return (
        <>
            <form className="w-100 rounded-2xl p-[30px] border-border border-[1px] flex flex-col justify-center items-center gap-4" onSubmit={isLogin ? handleLogin : handleRegister}>
                <div className="flex justify-center items-center flex-col">
                    <h1 className="text-[26px] font-bold mb-[5px]">{isLogin ? "Login" : "Register"}</h1>
                    <p className="text-xs font-normal">{isLogin ? "Welcome back" : "Create an account"}</p>
                </div>

                {isLogin ?
                    <>
                        <InputField label="Email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <InputField label="Password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <div className="w-full flex justify-end -mt-2">
                            <Link href="/auth/forgot-password" className="text-[11px] text-text-secondary font-semibold hover:underline">Forgot Password?</Link>
                        </div>
                    </>
                    : <>
                        <InputField label="Full Name" type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        <InputField label="Email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <InputField label="Password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <InputField label="Confirm Password" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </>
                }

                <Button className="bg-button w-full rounded-2xl text-bg cursor-pointer hover:bg-button/95 font-semibold text-[14px]" disabled={loading}>{isLogin ? "Login" : "Register"}</Button>

                <div className="w-full flex justify-center items-center gap-2 overflow-hidden">
                    <Separator className="bg-border" />
                    <p className="font-normal text-sm text-input-border">OR</p>
                    <Separator className="bg-border" />
                </div>

                <Button className="bg-button-secondary w-full rounded-2xl text-text cursor-pointer hover:bg-button/7 font-semibold text-[14px] border-[1px] border-input-border">
                    <Image src="/icons/google.svg" alt="Google Icon" width={15} height={15} />
                    Continue with Google
                </Button>

                <div className="w-full flex justify-center items-center">
                    <p className="text-[11px]">{isLogin ? "Don't have an account?" : "Already have an account?"} <Link href={isLogin ? "/auth/register" : "/auth/login"} className="font-semibold hover:underline">{isLogin ? "Register" : "Login"}</Link></p>
                </div>
            </form>

            <Dialog open={verifyDialogOpen}>
                <DialogContent showCloseButton={false} className="w-[360px] bg-bg rounded-2xl border-border p-[30px] flex flex-col gap-5">
                    <DialogHeader className="flex items-center flex-col gap-1">
                        <DialogTitle className="text-lg font-bold">Email Not Verified</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-3">
                        <Button
                            className="bg-button w-full rounded-2xl text-bg cursor-pointer hover:bg-button/95 font-semibold text-[14px]"
                            onClick={handleSendVerification}
                            disabled={resendLoading}
                        >
                            {resendLoading ? "Sending..." : "Send Verification Email"}
                        </Button>
                        <Button
                            className="bg-button-secondary w-full rounded-2xl text-text cursor-pointer border-[1px] border-input-border font-semibold text-[14px]"
                            onClick={() => setVerifyDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

interface InputProps {
    label: string,
    type: string,
    placeholder: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

const InputField = ({ label, type, placeholder, value, onChange }: InputProps) => {
    return (
        <div className="w-full flex flex-col gap-2 p-0">
            <Label className="text-sm font-semibold" htmlFor={label}>{label}</Label>
            <Input placeholder={placeholder} type={type} id={label} className="w-full text-xs border-input-border border-[1px] rounded-2xl bg-input-bg px-4 py-2" value={value} onChange={onChange} />
        </div>
    )
}

export default AuthForm