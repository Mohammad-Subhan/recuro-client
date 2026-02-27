"use client"

import React, { useState } from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import { Separator } from '../ui/separator'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useAppDispatch } from '@/store/hooks'
import { clearUser } from '@/store/slices/authSlice'
import { persistor } from '@/store/store'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

const AccountTab = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordLoading, setPasswordLoading] = useState(false)

    const handleChangePassword = () => {
        setShowPasswordModal(true)
    }

    const handlePasswordModalClose = () => {
        setShowPasswordModal(false)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
    }

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("All fields are required")
            return
        }

        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters")
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match")
            return
        }

        try {
            setPasswordLoading(true)
            const response = await api.patch("/api/user/me/password", { currentPassword, newPassword })
            toast.success(response.data.message || "Password changed successfully")
            handlePasswordModalClose()
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to change password"
            toast.error(errorMessage)
        } finally {
            setPasswordLoading(false)
        }
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
        <>
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

            {/* Change Password Modal */}
            <Dialog open={showPasswordModal} onOpenChange={(open) => !open && handlePasswordModalClose()}>
                <DialogContent showCloseButton={false} className="w-[380px] bg-bg rounded-2xl border-border p-[30px] flex flex-col gap-6">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-text">Change Password</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium text-text">Current Password</Label>
                            <Input
                                type="password"
                                placeholder="Enter current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="bg-input-bg border-input-border text-text h-10 rounded-2xl px-4"
                                autoComplete="current-password"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium text-text">New Password</Label>
                            <Input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="bg-input-bg border-input-border text-text h-10 rounded-2xl px-4"
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium text-text">Confirm New Password</Label>
                            <Input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="bg-input-bg border-input-border text-text h-10 rounded-2xl px-4"
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="flex gap-3 mt-2">
                            <Button
                                type="submit"
                                className="flex-1 bg-button text-bg hover:bg-button/90 rounded-2xl h-10 font-medium cursor-pointer"
                                disabled={passwordLoading}
                            >
                                {passwordLoading ? "Saving..." : "Save"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 bg-bg-secondary border-border hover:bg-border text-text rounded-2xl h-10 cursor-pointer"
                                onClick={handlePasswordModalClose}
                                disabled={passwordLoading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AccountTab
