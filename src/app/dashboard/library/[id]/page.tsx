"use client"

import TranscriptionTab from '@/components/video/TranscriptionTab'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Video } from '@/store/slices/videoSlice'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDuration = (seconds: number): string => {
    if (!seconds || seconds === 0) return '0:00'
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    return `${m}:${String(s).padStart(2, '0')}`
}

const getFormattedDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    if (diffInDays === 0) return 'Today'
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7)
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`
    }
    if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30)
        return `${months} month${months > 1 ? 's' : ''} ago`
    }
    const years = Math.floor(diffInDays / 365)
    return `${years} year${years > 1 ? 's' : ''} ago`
}

const formatFileSize = (bytes: number): string => {
    if (!bytes) return '—'
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-text/[0.08] rounded-lg ${className}`} />
)

// ─── Page ─────────────────────────────────────────────────────────────────────
const VideoPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params)
    const router = useRouter()

    const [video, setVideo] = useState<Video | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Edit dialog state
    const [editOpen, setEditOpen] = useState(false)
    const [editTitle, setEditTitle] = useState('')
    const [editDesc, setEditDesc] = useState('')
    const [editLoading, setEditLoading] = useState(false)

    // Delete dialog state
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                setLoading(true)
                setError(null)
                const response = await api.get(`/api/library/${id}`)
                setVideo(response.data.data as Video)
            } catch (err: any) {
                const message = err?.response?.data?.message || 'Failed to load video'
                setError(message)
                toast.error(message)
            } finally {
                setLoading(false)
            }
        }
        fetchVideo()
    }, [id])

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleCopyLink = () => {
        if (!video) return
        const shareUrl = `${window.location.origin}/share/${video.shareLink}`
        navigator.clipboard.writeText(shareUrl)
        toast.success('Share link copied!')
    }

    const handleDownload = async () => {
        if (!video) return
        try {
            const response = await fetch(video.videoUrl)
            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${video.title || 'video'}.mp4`
            a.click()
            URL.revokeObjectURL(url)
        } catch {
            toast.error('Failed to download video')
        }
    }

    const openEditDialog = () => {
        if (!video) return
        setEditTitle(video.title)
        setEditDesc(video.description || '')
        setEditOpen(true)
    }

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!video || !editTitle.trim()) {
            toast.error('Title is required')
            return
        }
        try {
            setEditLoading(true)
            const response = await api.patch(`/api/library/${video._id}`, {
                title: editTitle.trim(),
                description: editDesc.trim(),
            })
            setVideo(response.data.data as Video)
            toast.success('Video updated!')
            setEditOpen(false)
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to update video')
        } finally {
            setEditLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!video) return
        try {
            setDeleteLoading(true)
            await api.delete(`/api/library/${video._id}`)
            toast.success('Video deleted')
            router.push('/dashboard/library')
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to delete video')
            setDeleteLoading(false)
        }
    }

    // ── Error state ──────────────────────────────────────────────────────────
    if (error && !loading) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center gap-4 pt-10">
                <p className="text-text/40 text-sm">{error}</p>
                <Button
                    onClick={() => router.back()}
                    className="text-xs px-4 py-2 border border-border rounded-lg hover:bg-text/[0.04] transition-colors cursor-pointer"
                >
                    ← Go back
                </Button>
            </div>
        )
    }

    return (
        <>
            <div className="h-full w-full flex flex-col gap-[35px] pt-5">
                {/* ── Header ────────────────────────────────────────────── */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        {loading ? (
                            <>
                                <Skeleton className="h-8 w-64 rounded-xl" />
                                <Skeleton className="h-4 w-40" />
                            </>
                        ) : (
                            <>
                                <h1 className="text-3xl font-semibold text-text">{video?.title}</h1>
                                <div className="flex items-center gap-2 text-xs text-text/50">
                                    <span className="text-text font-semibold">{video?.author?.fullName}</span>
                                    <span>·</span>
                                    <span>{video ? getFormattedDate(video.createdAt) : '—'}</span>
                                    {video?.duration ? (
                                        <>
                                            <span>·</span>
                                            <span>{formatDuration(video.duration)}</span>
                                        </>
                                    ) : null}
                                    {video?.size ? (
                                        <>
                                            <span>·</span>
                                            <span>{formatFileSize(video.size)}</span>
                                        </>
                                    ) : null}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            className="w-9 h-9 p-0 flex items-center justify-center cursor-pointer"
                            onClick={openEditDialog}
                            disabled={loading || !video}
                            title="Edit video"
                        >
                            <Image src="/icons/edit.svg" alt="Edit" width={18} height={18} />
                        </Button>
                        <Button
                            className="w-9 h-9 p-0 flex items-center justify-center cursor-pointer"
                            onClick={handleCopyLink}
                            disabled={loading || !video}
                            title="Copy share link"
                        >
                            <Image src="/icons/link.svg" alt="Share" width={18} height={18} />
                        </Button>
                        <Button
                            className="w-9 h-9 p-0 flex items-center justify-center cursor-pointer"
                            onClick={handleDownload}
                            disabled={loading || !video}
                            title="Download video"
                        >
                            <Image src="/icons/download.svg" alt="Download" width={18} height={18} />
                        </Button>
                        <Button
                            className="w-9 h-9 p-0 flex items-center justify-center cursor-pointer bg-red-500/10 hover:bg-red-500/20 border border-red-500/20"
                            onClick={() => setDeleteOpen(true)}
                            disabled={loading || !video}
                            title="Delete video"
                        >
                            <Image src="/icons/trash.svg" alt="Delete" width={18} height={18} />
                        </Button>
                    </div>
                </div>

                <div className="flex xl:flex-row flex-col gap-6">
                    {/* ── Left Side ──────────────────────────────────────── */}
                    <div className="flex-1 flex flex-col gap-6">
                        {/* Video Player */}
                        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black relative">
                            {loading ? (
                                <Skeleton className="w-full h-full rounded-2xl" />
                            ) : video?.videoUrl ? (
                                <video
                                    src={video.videoUrl}
                                    controls
                                    controlsList="nodownload"
                                    disablePictureInPicture
                                    className="w-full h-full object-contain"
                                    poster={video.thumbnailUrl}
                                />
                            ) : null}
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-3 pb-10">
                            <h2 className="text-lg font-semibold text-text">Description</h2>
                            {loading ? (
                                <div className="flex flex-col gap-2">
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-5/6" />
                                    <Skeleton className="h-3 w-4/6" />
                                </div>
                            ) : (
                                <p className="text-sm text-text/50 leading-relaxed whitespace-pre-wrap">
                                    {video?.description || <span className="italic text-text/30">No description provided.</span>}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ── Right Side - Transcription ───────────────────────────────── */}
                    <div className="w-full lg:w-[400px] flex flex-col gap-6">
                        <div className="flex items-center gap-6 relative">
                            <div className="text-sm font-medium pb-3 relative transition-colors duration-200 text-text">
                                Transcription
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-text rounded-full animate-slideIn" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border -z-10" />
                        </div>
                        <TranscriptionTab videoId={video?._id || ""} transcription={video?.transcription || ""} />
                    </div>
                </div>
            </div>

            {/* ── Edit Dialog ──────────────────────────────────────────────── */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent showCloseButton={false} className="w-[480px] bg-bg-secondary border border-border rounded-2xl p-8 flex flex-col gap-6">
                    <Button
                        onClick={() => setEditOpen(false)}
                        className="absolute p-0 cursor-pointer top-6 right-6 w-8 h-8 rounded-lg flex items-center justify-center transition-colors outline-none"
                    >
                        <Image src="/icons/close.svg" alt="Close" width={18} height={18} />
                    </Button>
                    <div className="flex items-center gap-3">
                        <DialogTitle className="text-xl font-semibold text-text">Edit Video</DialogTitle>
                    </div>
                    <form onSubmit={handleEdit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium text-text" htmlFor="edit-title">Title</Label>
                            <Input
                                id="edit-title"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="Enter your video title"
                                className="bg-input-bg border-input-border text-text h-11 rounded-2xl px-4"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium text-text" htmlFor="edit-desc">Description</Label>
                            <textarea
                                id="edit-desc"
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                                placeholder="Enter what the video is about"
                                rows={4}
                                className="bg-input-bg border border-input-border text-text rounded-2xl px-4 py-3 min-h-[100px] resize-none text-sm placeholder:text-text-placeholder focus:outline-none focus:ring-1 focus:ring-border"
                            />
                        </div>
                        <div className="flex items-center gap-3 pt-1">
                            <Button
                                type="button"
                                onClick={() => setEditOpen(false)}
                                className="flex-1 bg-transparent border border-border hover:bg-border text-text rounded-2xl h-11 font-medium cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={editLoading}
                                className="flex-1 bg-button rounded-2xl text-bg cursor-pointer hover:bg-button/95 font-semibold text-[14px] h-11 disabled:opacity-50"
                            >
                                {editLoading ? 'Saving…' : 'Save changes'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ── Delete Confirm Dialog ─────────────────────────────────────── */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent showCloseButton={false} className="w-[420px] bg-bg-secondary border border-border rounded-2xl p-8 flex flex-col gap-6">
                    <Button
                        onClick={() => setDeleteOpen(false)}
                        className="absolute p-0 cursor-pointer top-6 right-6 w-8 h-8 rounded-lg flex items-center justify-center transition-colors outline-none"
                    >
                        <Image src="/icons/close.svg" alt="Close" width={18} height={18} />
                    </Button>
                    <div className="flex items-center gap-3">
                        <DialogTitle className="text-xl font-semibold text-text">Delete Video</DialogTitle>
                    </div>
                    <p className="text-sm text-text/50 -mt-2">
                        Are you sure you want to delete <span className="text-text font-medium">"{video?.title}"</span>? This cannot be undone.
                    </p>
                    <div className="flex items-center gap-3">
                        <Button
                            className="flex-1 bg-transparent border border-border hover:bg-border text-text rounded-2xl h-11 font-medium cursor-pointer"
                            onClick={() => setDeleteOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl h-11 font-semibold text-[14px] cursor-pointer disabled:opacity-50"
                            onClick={handleDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? 'Deleting…' : 'Yes, delete'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default VideoPage