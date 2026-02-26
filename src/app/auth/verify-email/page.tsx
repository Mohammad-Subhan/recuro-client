"use client"

import React, { Suspense, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/lib/api'
import toast from 'react-hot-toast'

const VerifyContent = () => {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    // Cooldown timer for resend button
    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setInterval(() => {
            setCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown]);

    // Start cooldown on mount (since OTP was just sent during register/login)
    useEffect(() => {
        setCooldown(60);
    }, []);

    const handleVerify = async () => {
        const otpString = otp.join("");
        if (otpString.length !== 6) {
            toast.error("Please enter the complete 6-digit OTP");
            return;
        }

        try {
            setLoading(true);
            const response = await api.post("/api/auth/verify-email", { email, otp: otpString });

            if (response.status === 200) {
                toast.success(response.data.message || "Email verified successfully!");
                router.push("/auth/login");
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Verification failed";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const handleResendOTP = async () => {
        if (cooldown > 0) return;

        try {
            setResendLoading(true);
            const response = await api.post("/api/auth/resend-otp", { email });
            toast.success(response.data.message || "OTP resent successfully!");
            setCooldown(60);
            // Clear OTP inputs
            setOtp(Array(6).fill(""));
            inputRefs.current[0]?.focus();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to resend OTP";
            toast.error(errorMessage);
        } finally {
            setResendLoading(false);
        }
    }

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value.slice(-1)
        setOtp(newOtp)

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").slice(0, 6).split("")
        if (pasted.some(c => !/\d/.test(c))) return

        const newOtp = Array(6).fill("")
        pasted.forEach((char, i) => { newOtp[i] = char })
        setOtp(newOtp)
        inputRefs.current[Math.min(pasted.length, 5)]?.focus()
    }

    const formatCooldown = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    return (
        <div className="flex justify-center items-center min-h-dvh">
            <div className="w-101 rounded-2xl p-[30px] border-border border-[1px] flex flex-col gap-[30px] justify-center items-center">
                <div className="w-full flex justify-between items-center">
                    <Button className="p-0 cursor-pointer" onClick={() => router.back()}>
                        <Image src={"/icons/arrow-left.svg"} alt="Arrow Left" width={16} height={16} />
                    </Button>
                    <h1 className="text-xl font-bold">Verify Email</h1>
                    <div className="w-[10px] h-[10px]"></div>
                </div>

                <div className="text-center text-xs flex flex-col">
                    <p className="text-text/60">You are almost there! We have sent an email to</p>
                    <p className="font-bold">{email || "your email"}</p>
                </div>

                <div className="flex gap-2 w-full justify-center">
                    {otp.map((digit, index) => (
                        <Input
                            key={index}
                            ref={el => { inputRefs.current[index] = el }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleChange(index, e.target.value)}
                            onKeyDown={e => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="w-11 h-11 text-center text-lg font-bold rounded-xl border-border"
                        />
                    ))}
                </div>

                <div className="w-full flex flex-col justify-center text-center items-center gap-3">
                    <p className="text-xs text-text/60">Check your spam folder if you dont see the email. Still cant find the email?</p>
                    <Button
                        className="bg-button w-full rounded-2xl text-bg cursor-pointer hover:bg-button/95 font-semibold text-[14px]"
                        onClick={handleVerify}
                        disabled={loading || otp.join("").length !== 6}
                    >
                        {loading ? "Verifying..." : "Verify"}
                    </Button>
                    <Button
                        className="border-[1px] border-input-border bg-button-secondary text-text w-full rounded-2xl cursor-pointer hover:bg-button/7 font-semibold text-[14px] disabled:opacity-50"
                        onClick={handleResendOTP}
                        disabled={resendLoading || cooldown > 0}
                    >
                        {resendLoading
                            ? "Sending..."
                            : cooldown > 0
                                ? `Resend OTP (${formatCooldown(cooldown)})`
                                : "Resend OTP"
                        }
                    </Button>
                </div>
            </div>
        </div>
    )
}

const Verify = () => {
    return (
        <Suspense>
            <VerifyContent />
        </Suspense>
    )
}

export default Verify