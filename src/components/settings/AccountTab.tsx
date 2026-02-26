"use client"

import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import { Separator } from '../ui/separator'
import { useAppDispatch } from '@/store/hooks'
import { clearUser } from '@/store/slices/authSlice'
import { persistor } from '@/store/store'
import { useRouter } from 'next/navigation'

const AccountTab = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleChangePassword = () => {
        // Handle password change logic
        console.log("Change password clicked")
    }

    const handleLogout = () => {
        dispatch(clearUser());
        persistor.purge();
        router.replace("/auth/login");
    }

    const handleDeleteAccount = () => {
        // Handle account deletion logic
        console.log("Delete account clicked")
    }

    return (
        <div className="flex flex-col gap-10 animate-fadeIn">
            {/* Password Section */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-semibold text-text">Password</h3>
                    <p className="text-sm text-text-secondary">Change password</p>
                </div>

                <Button
                    onClick={handleChangePassword}
                    variant="outline"
                    className="w-fit flex items-center gap-3 bg-bg-secondary border-border hover:bg-border text-text rounded-2xl cursor-pointer px-5 h-10 text-sm"
                >
                    <Image src={"/icons/key.svg"} alt="Key" width={20} height={20} />
                    Change Password
                </Button>
            </div>

            {/* Separator */}
            <Separator className="bg-border" />


            {/* Logout Section */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-semibold text-text">Logout</h3>
                    <p className="text-sm text-text-secondary">
                        Logout from your account. You can come back anytime
                    </p>
                </div>

                <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-fit bg-bg-secondary border-border hover:bg-border text-text rounded-2xl px-10 h-10 cursor-pointer"
                >
                    Logout
                </Button>
            </div>

            {/* Separator */}
            <Separator className="bg-border" />


            {/* Delete Account Section */}
            <div className="flex flex-col gap-4 pb-10">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-medium text-text">Delete my account</h3>
                    <p className="text-sm text-text-secondary">
                        All your personal data and videos will be permanently deleted
                    </p>
                </div>

                <Button
                    onClick={handleDeleteAccount}
                    className="w-fit bg-red-600 hover:bg-red-700 text-white rounded-2xl px-5 h-10 font-medium cursor-pointer"
                >
                    Delete my account
                </Button>
            </div>
        </div>
    )
}

export default AccountTab
