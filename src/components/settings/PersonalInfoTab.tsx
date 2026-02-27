"use client"

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setUser } from '@/store/slices/authSlice'
import api from '@/lib/api'
import toast from 'react-hot-toast'

const PersonalInfoTab = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);

    const [fullName, setFullName] = useState(user?.fullName || "")
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [nameLoading, setNameLoading] = useState(false)
    const [imageLoading, setImageLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const currentImage = previewImage ?? user?.profileImage ?? null

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return;

        // Validate file size (5MB limit)
        const MAX_SIZE_MB = 5;
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            toast.error(`Image must be smaller than ${MAX_SIZE_MB}MB`);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        // Show local preview immediately
        const reader = new FileReader()
        reader.onloadend = () => setPreviewImage(reader.result as string)
        reader.readAsDataURL(file)

        // Upload to backend
        try {
            setImageLoading(true)
            const formData = new FormData()
            formData.append("profileImage", file)

            const response = await api.patch("/api/user/me/profile-image", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })

            if (response.status === 200) {
                const { user: updatedUser } = response.data.data
                dispatch(setUser({
                    _id: updatedUser._id,
                    fullName: updatedUser.fullName,
                    email: updatedUser.email,
                    profileImage: updatedUser.profileImage,
                }))
                setPreviewImage(null) // Use stored URL from now on
                toast.success("Profile image updated")
            }
        } catch (error: any) {
            setPreviewImage(null)
            const errorMessage = error.response?.data?.message || "Failed to upload image"
            toast.error(errorMessage)
        } finally {
            setImageLoading(false)
            // Reset file input so the same file can be re-selected
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    const handleRemoveImage = async () => {
        if (!user?.profileImage) return
        try {
            setImageLoading(true)
            await api.delete("/api/user/me/profile-image")
            dispatch(setUser({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profileImage: null,
            }))
            toast.success("Profile image removed")
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to remove image"
            toast.error(errorMessage)
        } finally {
            setImageLoading(false)
        }
    }

    const handleSaveName = async () => {
        if (!fullName.trim()) {
            toast.error("Full name cannot be empty")
            return
        }
        try {
            setNameLoading(true)
            const response = await api.patch("/api/user/me", { fullName: fullName.trim() })

            if (response.status === 200) {
                const { user: updatedUser } = response.data.data
                dispatch(setUser({
                    _id: updatedUser._id,
                    fullName: updatedUser.fullName,
                    email: updatedUser.email,
                    profileImage: updatedUser.profileImage,
                }))
                toast.success(response.data.message || "Profile updated successfully")
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to update profile"
            toast.error(errorMessage)
        } finally {
            setNameLoading(false)
        }
    }

    const handleCancel = () => {
        setFullName(user?.fullName || "")
    }

    return (
        <div className="flex flex-col gap-8 animate-fadeIn">
            {/* Name and Photos Section */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-medium text-text">Name and photos</h3>
                    <p className="text-xs text-text-secondary">
                        Changing your name below will update your name on your profile.
                    </p>
                </div>

                {/* Profile Images */}
                <div className="flex items-center gap-6 mt-2">
                    {/* Current Profile Picture */}
                    <div className="relative w-[120px] h-[120px] rounded-full bg-bg-secondary border border-border overflow-hidden flex items-center justify-center">
                        {currentImage ? (
                            <Image
                                src={currentImage}
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full">
                                <span className="text-4xl font-semibold text-text-secondary select-none">
                                    {user?.fullName?.[0]?.toUpperCase() ?? "?"}
                                </span>
                            </div>
                        )}
                        {imageLoading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Upload + Remove Buttons */}
                    <div className="flex flex-col gap-3">
                        <Label
                            htmlFor="profile-upload"
                            className="w-fit flex items-center gap-2 rounded-2xl border border-border bg-bg-secondary hover:bg-border/40 cursor-pointer transition-all px-5 h-10 text-sm text-text font-medium"
                        >
                            <Image src={"/icons/camera.svg"} alt="Camera" width={16} height={16} />
                            {imageLoading ? "Uploading..." : "Upload photo"}
                            <input
                                ref={fileInputRef}
                                id="profile-upload"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                className="hidden"
                                onChange={handleImageSelect}
                                disabled={imageLoading}
                            />
                        </Label>
                        {user?.profileImage && (
                            <Button
                                variant="outline"
                                className="w-fit text-xs rounded-2xl border-red-500 text-red-500 hover:text-red-400 hover:bg-transparent px-9 cursor-pointer"
                                onClick={handleRemoveImage}
                                disabled={imageLoading}
                            >
                                Remove photo
                            </Button>
                        )}
                        <p className="text-xs text-text-secondary">JPG, PNG or WebP. Max 5MB.</p>
                    </div>
                </div>

                {/* Full Name Input */}
                <div className="flex flex-col gap-2 mt-4 max-w-[400px]">
                    <Label htmlFor="fullName" className="text-sm text-text">
                        Full Name
                    </Label>
                    <Input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-input-bg border-input-border text-text h-10 rounded-2xl px-4"
                        placeholder="Enter your full name"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 mt-2">
                    <Button
                        className="bg-button text-bg hover:bg-button/90 rounded-2xl cursor-pointer px-8 h-10 font-medium"
                        onClick={handleSaveName}
                        disabled={nameLoading}
                    >
                        {nameLoading ? "Saving..." : "Save"}
                    </Button>
                    <Button
                        variant="outline"
                        className="text-text-secondary px-6 h-10 border-border hover:text-text cursor-pointer rounded-2xl bg-bg-secondary hover:bg-border"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PersonalInfoTab
