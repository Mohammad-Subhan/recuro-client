"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        try {
            setLoading(true);
            const response = await api.post("/api/auth/forgot-password", { email });
            toast.success(response.data.message || "Reset OTP sent to your email!");
            router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to send reset email";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-dvh">
            <form className="w-100 rounded-2xl p-[30px] border-border border-[1px] flex flex-col gap-[30px] justify-center items-center" onSubmit={handleSubmit}>
                <div className="w-full flex justify-between items-center">
                    <Button type="button" className="p-0 cursor-pointer" onClick={() => router.back()}>
                        <Image src={"/icons/arrow-left.svg"} alt="Arrow Left" width={16} height={16} />
                    </Button>
                    <h1 className="text-xl font-bold">Forgot Password</h1>
                    <div className="w-[10px] h-[10px]"></div>
                </div>

                <div className="text-center text-xs flex flex-col">
                    <p className="text-text/60">Enter your email address and we'll send you an OTP to reset your password.</p>
                </div>

                <div className="w-full flex flex-col gap-2 p-0">
                    <Label className="text-sm font-semibold" htmlFor="email">Email</Label>
                    <Input
                        placeholder="Enter your email"
                        type="email"
                        id="email"
                        className="w-full text-xs border-input-border border-[1px] rounded-2xl bg-input-bg px-4 py-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="w-full flex flex-col gap-3">
                    <Button
                        type="submit"
                        className="bg-button w-full rounded-2xl text-bg cursor-pointer hover:bg-button/95 font-semibold text-[14px]"
                        disabled={loading || !email}
                    >
                        {loading ? "Sending..." : "Send Reset OTP"}
                    </Button>
                    <Button
                        type="button"
                        className="border-[1px] border-input-border bg-button-secondary text-text w-full rounded-2xl cursor-pointer hover:bg-button/7 font-semibold text-[14px]"
                        onClick={() => router.push("/auth/login")}
                    >
                        Back to Login
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ForgotPassword
