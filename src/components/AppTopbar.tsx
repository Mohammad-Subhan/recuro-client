"use client"

import React, { useState } from 'react'
import { Input } from './ui/input'
import Image from 'next/image'
import { Button } from './ui/button'
import { Scrollbar } from "react-scrollbars-custom"
import { Label } from './ui/label'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { useRouter } from 'next/navigation'
import { clearUser } from '@/store/slices/authSlice'
import { triggerRefetch } from '@/store/slices/videoSlice'
import { persistor } from '@/store/store'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu'
import toast from 'react-hot-toast'
import api from '@/lib/api'

const AppTopbar = () => {
    const [showRecordModal, setShowRecordModal] = useState(false)
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [showRecordFormModal, setShowRecordFormModal] = useState(false)

    // Upload Video State
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [thumbnail, setThumbnail] = useState<File | null>(null)
    const [video, setVideo] = useState<File | null>(null)
    const [isThumbnailDragging, setIsThumbnailDragging] = useState(false)
    const [isVideoDragging, setIsVideoDragging] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)

    const user = useAppSelector((state) => state.auth.user)
    const dispatch = useAppDispatch()
    const router = useRouter()

    const handleThumbnailDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        setIsThumbnailDragging(true)
    }

    const handleThumbnailDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        setIsThumbnailDragging(false)
    }

    const handleThumbnailDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault()

        // verify file type
        const file = e.dataTransfer.files[0]
        if (file.type !== "image/jpeg" && file.type !== "image/png") {
            toast.error("Please upload a valid image file")
            return
        }
        setThumbnail(file)
    }

    const handleVideoDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        setIsVideoDragging(true)
    }

    const handleVideoDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        setIsVideoDragging(false)
    }

    const handleVideoDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault()

        // verify file type
        const file = e.dataTransfer.files[0]
        if (file.type !== "video/mp4" && file.type !== "video/mov") {
            toast.error("Please upload a valid video file")
            return
        }
        setVideo(file)
    }

    const handleLogout = () => {
        dispatch(clearUser())
        persistor.purge()
        router.replace('/auth/login')
    }

    const handleUpload = async () => {
        // Validate inputs
        if (!title.trim()) {
            toast.error("Please enter a title")
            return
        }

        if (!video) {
            toast.error("Please select a video file")
            return
        }

        if (!thumbnail) {
            toast.error("Please select a thumbnail image")
            return
        }

        try {
            setIsUploading(true)
            setUploadProgress(0)

            // Create FormData
            const formData = new FormData()
            formData.append('video', video)
            formData.append('thumbnail', thumbnail)
            formData.append('title', title)
            formData.append('description', description)

            // Upload with progress tracking
            const response = await api.post('/api/library/upload-file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = progressEvent.total
                        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        : 0
                    setUploadProgress(progress)
                },
            })

            toast.success("Video uploaded successfully!")

            // Reset form
            setTitle("")
            setDescription("")
            setVideo(null)
            setThumbnail(null)
            setShowUploadModal(false)
            setUploadProgress(0)

            // Dispatch refetch to refresh the library page instantly
            dispatch(triggerRefetch())
        } catch (error: any) {
            console.error("Upload error:", error)
            const errorMessage = error.response?.data?.message || "Failed to upload video"
            toast.error(errorMessage)
        } finally {
            setIsUploading(false)
        }
    }

    const handleRecordClick = () => {
        setShowRecordModal(true)
    }

    const handleUploadClick = () => {
        setShowUploadModal(true)
    }

    const handleClickToRecord = () => {
        setShowRecordModal(false)
        setShowRecordFormModal(true)
    }

    const handleCloseModal = () => {
        setShowRecordModal(false)
        setShowUploadModal(false)
        setShowRecordFormModal(false)
    }

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setShowRecordModal(false)
            setShowUploadModal(false)
            setShowRecordFormModal(false)
        }
    }

    return (
        <>
            <div className="flex sm:flex-row flex-col items-end p-5 justify-between gap-4">
                <div className="flex w-full sm:max-w-[300px] items-center gap-1 border border-border rounded-full px-4">
                    <Image src={"/icons/search.svg"} alt="Search" width={20} height={20} />
                    <Input type="text" placeholder="Search..." className="w-full h-[40px] text-text placeholder:text-text-secondary border-none focus-visible:ring-0" />
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        onClick={handleUploadClick}
                        className="bg-button rounded-2xl text-bg cursor-pointer hover:bg-button/95 font-semibold text-[14px]"
                    >
                        <Image src={"/icons/upload.svg"} alt="upload" width={16} height={16} />
                        Upload
                    </Button>
                    <Button
                        onClick={handleRecordClick}
                        className="bg-button rounded-2xl text-bg cursor-pointer hover:bg-button/95 font-semibold text-[14px]"
                    >
                        <Image src={"/icons/record.svg"} alt="record" width={16} height={16} />
                        Record
                    </Button>
                    {/* User Avatar + Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="rounded-full bg-button h-9 w-9 cursor-pointer overflow-hidden flex items-center justify-center flex-shrink-0 border border-border outline-none">
                                {user?.profileImage ? (
                                    <Image
                                        src={user.profileImage}
                                        alt="Profile"
                                        width={36}
                                        height={36}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <span className="text-sm font-semibold text-bg select-none">
                                        {user?.fullName?.[0]?.toUpperCase() ?? "?"}
                                    </span>
                                )}
                            </div>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="w-52 bg-bg border-border rounded-2xl p-1.5"
                        >
                            {/* User info label */}
                            <DropdownMenuLabel className="px-3 py-2">
                                <p className="text-sm font-semibold text-text truncate">{user?.fullName}</p>
                                <p className="text-xs text-text-secondary font-normal truncate">{user?.email}</p>
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator className="bg-border" />

                            <DropdownMenuItem
                                className="flex items-center gap-3 px-3 py-2.5 text-sm text-text rounded-xl cursor-pointer hover:bg-bg-secondary focus:bg-bg-secondary"
                                onClick={() => router.push('/dashboard/settings')}
                            >
                                <Image src="/icons/settings-active.svg" alt="Settings" width={16} height={16} />
                                Settings
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 rounded-xl cursor-pointer hover:bg-red-500/10 focus:bg-bg-secondary hover:text-red-500 focus:text-red-500"
                                onClick={handleLogout}
                            >
                                <Image src="/icons/arrow-left-red.svg" alt="Logout" width={16} height={16} />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Record Modal */}
            {showRecordModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
                    onClick={handleBackdropClick}
                >
                    <div className="bg-bg-secondary border border-border rounded-2xl p-8 w-[400px] relative animate-fadeIn">
                        {/* Close Button */}
                        <Button
                            onClick={handleCloseModal}
                            className="absolute p-0 cursor-pointer top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                        >
                            <Image src={"/icons/close.svg"} alt="Close" width={18} height={18} />
                        </Button>

                        {/* Modal Content */}
                        <div className="flex flex-col items-center gap-6">
                            <div className="flex items-center gap-3">
                                <Image src={"/icons/logo.svg"} alt="Recura Logo" width={32} height={32} />
                                <h2 className="text-xl font-semibold text-text">Recura</h2>
                            </div>

                            <Button
                                onClick={handleClickToRecord}
                                className="w-full bg-button rounded-2xl text-bg cursor-pointer hover:bg-button/95 font-semibold text-[14px] h-11"
                            >
                                <Image src={"/icons/record.svg"} alt="record" width={18} height={18} />
                                Click to Record
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
                    onClick={handleBackdropClick}
                >
                    <div className="bg-bg-secondary border border-border rounded-2xl p-8 pr-1 w-[550px] relative animate-fadeIn h-[700px]">
                        <Scrollbar
                            style={{ width: '100%', height: '100%' }}
                            contentProps={{
                                style: { paddingRight: '20px' }
                            }}
                            thumbYProps={{
                                style: { background: '#222', borderRadius: '9999px', width: '3px' },
                            }}
                        >
                            {/* Close Button */}
                            <Button
                                onClick={handleCloseModal}
                                className="absolute p-0 cursor-pointer -top-0 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                            >
                                <Image src={"/icons/close.svg"} alt="Close" width={18} height={18} />
                            </Button>

                            {/* Modal Content */}
                            <div className="flex flex-col gap-6 px-0.5">
                                <div className="flex items-center gap-3">
                                    <Image src={"/icons/logo.svg"} alt="Recura Logo" width={32} height={32} />
                                    <h2 className="text-xl font-semibold text-text">Recura</h2>
                                </div>

                                {/* Title Input */}
                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium text-text">Title</Label>
                                    <Input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter your video title"
                                        className="bg-input-bg border-input-border text-text h-11 rounded-2xl px-4"
                                    />
                                </div>

                                {/* Description Textarea */}
                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium text-text">Description</Label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Enter what video is about"
                                        className="bg-input-bg border border-input-border text-text rounded-2xl px-4 py-3 min-h-[100px] resize-none text-sm placeholder:text-text-placeholder focus:outline-none focus:ring-1 focus:ring-border"
                                    />
                                </div>

                                {/* Video Upload Area */}
                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium text-text">Video</Label>
                                    <label
                                        onDragOver={handleVideoDragOver}
                                        onDragLeave={handleVideoDragLeave}
                                        onDrop={handleVideoDrop}
                                        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-2 hover:border-border transition-colors cursor-pointer ${isVideoDragging ? 'border-border bg-input-bg/20' : 'border-input-border bg-input-bg'}`}>
                                        <Input
                                            type="file"
                                            accept=".mp4,.mov"
                                            className="hidden"
                                            onChange={(e) => setVideo(e.target.files?.[0] ?? null)}
                                        />
                                        {video ? (
                                            <div className="flex items-center gap-4 relative w-full">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        setVideo(null)
                                                    }}
                                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
                                                >
                                                    <Image src="/icons/trash.svg" alt="Remove" width={12} height={12} />
                                                </button>
                                                <Image src="/icons/video-camera.svg" alt="video" width={30} height={30} className="opacity-70" />
                                                <div className="flex flex-col gap-0.5">
                                                    <p className="text-sm text-text font-medium">{video.name}</p>
                                                    <p className="text-xs text-text-placeholder">{(video.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-sm text-text-secondary">Click to upload your video or drag your content here</p>
                                                <p className="text-xs text-text-placeholder">Supported files: .mp4, .MOV</p>
                                            </>
                                        )}
                                    </label>
                                </div>

                                {/* Thumbnail Upload Area */}
                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium text-text">Thumbnail</Label>
                                    <label
                                        onDragOver={handleThumbnailDragOver}
                                        onDragLeave={handleThumbnailDragLeave}
                                        onDrop={handleThumbnailDrop}
                                        className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-border transition-colors cursor-pointer bg-input-bg/30 ${isThumbnailDragging ? 'border-border' : 'border-input-border'} ${thumbnail ? 'p-4' : 'p-8'}`}
                                    >
                                        <Input
                                            type="file"
                                            accept=".jpg,.png"
                                            className="hidden"
                                            onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
                                        />
                                        {thumbnail ? (
                                            <div className="w-full max-w-[500px] aspect-[4/3] relative rounded-lg overflow-hidden bg-bg">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        setThumbnail(null)
                                                    }}
                                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors z-10 cursor-pointer"
                                                >
                                                    <Image src="/icons/trash.svg" alt="Remove" width={12} height={12} />
                                                </button>
                                                <Image
                                                    src={URL.createObjectURL(thumbnail)}
                                                    alt="Thumbnail preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-sm text-text-secondary">Click to upload your thumbnail or drag your content here</p>
                                                <p className="text-xs text-text-placeholder">Supported files: .jpg, .png</p>
                                            </>
                                        )}
                                    </label>
                                </div>

                                {/* Upload Progress Bar */}
                                {isUploading && (
                                    <div className="flex flex-col gap-2">
                                        <div className="w-full bg-input-border rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-button h-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Upload Button */}
                                <Button
                                    className="w-full bg-button rounded-2xl text-bg cursor-pointer hover:bg-button/95 font-semibold text-[14px] h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-bg border-t-transparent rounded-full animate-spin" />
                                            Uploading... {uploadProgress}%
                                        </>
                                    ) : (
                                        <>
                                            <Image src={"/icons/upload.svg"} alt="upload" width={18} height={18} />
                                            Upload video
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Scrollbar>
                    </div>
                </div>
            )}

            {/* Record Form Modal */}
            {showRecordFormModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
                    onClick={handleBackdropClick}
                >
                    <div className="bg-bg-secondary border border-border rounded-2xl p-8 w-[550px] relative animate-fadeIn max-h-[90vh] overflow-y-auto">
                        {/* Close Button */}
                        <Button
                            onClick={handleCloseModal}
                            className="absolute p-0 cursor-pointer top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-colors z-10"
                        >
                            <Image src={"/icons/close.svg"} alt="Close" width={18} height={18} />
                        </Button>

                        {/* Modal Content */}
                        <div className="flex flex-col gap-6 px-0.5">
                            <div className="flex items-center gap-3">
                                <Image src={"/icons/logo.svg"} alt="Recura Logo" width={32} height={32} />
                                <h2 className="text-xl font-semibold text-text">Recura</h2>
                            </div>


                            {/* Title Input */}
                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium text-text">Title</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter your video title"
                                    className="bg-input-bg border-input-border text-text h-11 rounded-2xl px-4"
                                />
                            </div>

                            {/* Description Textarea */}
                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium text-text">Description</Label>
                                <textarea
                                    placeholder="Enter what video is about"
                                    className="bg-input-bg border border-input-border text-text rounded-2xl px-4 py-3 min-h-[100px] resize-none text-sm placeholder:text-text-placeholder focus:outline-none focus:ring-1 focus:ring-border"
                                />
                            </div>

                            {/* Thumbnail Upload Area */}
                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-medium text-text">Thumbnail</Label>
                                <div className="border-2 border-dashed border-input-border rounded-2xl p-12 flex flex-col items-center justify-center gap-2 hover:border-border transition-colors cursor-pointer bg-input-bg/30">
                                    <p className="text-sm text-text-secondary">Click to upload your thumbnail or drag your content here</p>
                                    <p className="text-xs text-text-placeholder">Supported files: .mp4, .MOV</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 pt-2">
                                <Button
                                    onClick={handleCloseModal}
                                    variant="ghost"
                                    className="flex-1 bg-transparent border border-border hover:bg-border text-text rounded-2xl h-11 font-medium cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button className="flex-1 bg-button rounded-2xl text-bg cursor-pointer hover:bg-button/95 font-semibold text-[14px] h-11">
                                    Confirm
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AppTopbar