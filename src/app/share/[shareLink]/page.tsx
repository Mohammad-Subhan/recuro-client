"use client"

import TranscriptionTab from '@/components/video/TranscriptionTab'
import React, { useEffect, useState } from 'react'
import { Video } from '@/store/slices/videoSlice'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// ─── Helpers ─────────────────────────────────────────────────────────────────
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

const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-text/[0.08] rounded-lg ${className}`} />
)

// ─── Share Page ───────────────────────────────────────────────────────────────
const SharePage = ({ params }: { params: Promise<{ shareLink: string }> }) => {
    const { shareLink } = React.use(params)
    const [video, setVideo] = useState<Video | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                setLoading(true)
                setError(null)
                const response = await api.get(`/api/library/share/${shareLink}`)
                setVideo(response.data.data as Video)
            } catch (err: any) {
                const message = err?.response?.data?.message || 'Video not found or no longer available'
                setError(message)
                toast.error(message)
            } finally {
                setLoading(false)
            }
        }
        fetchVideo()
    }, [shareLink])

    if (error && !loading) {
        return (
            <div className="min-h-dvh w-full flex flex-col items-center justify-center gap-3 text-center px-4">
                <p className="text-text/40 text-sm">{error}</p>
                <p className="text-text/25 text-xs">This link may have been removed or is invalid.</p>
            </div>
        )
    }

    return (
        <div className="min-h-dvh w-full flex flex-col">
            {/* ── Minimal nav bar ────────────────────────────────────────── */}
            <header className="w-full border-b border-border px-6 py-4 flex items-center gap-3">
                <Link href="/" className="flex items-center gap-2">
                    <img src="/icons/logo.svg" alt="Recura" width={28} height={28} />
                    <span className="text-sm font-semibold tracking-tight text-text/70">Recura</span>
                </Link>
            </header>

            <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-10 flex flex-col gap-[35px]">
                {/* ── Header ─────────────────────────────────────────────── */}
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
                        {loading ? (
                            <div className="flex flex-col gap-6 animate-fadeIn">
                                <Skeleton className="h-6 w-32" />
                                <div className="p-5 rounded-xl border border-border bg-bg-secondary/30 flex flex-col gap-3">
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-5/6" />
                                    <Skeleton className="h-3 w-4/6" />
                                    <Skeleton className="h-3 w-full" />
                                </div>
                            </div>
                        ) : (
                            <TranscriptionTab transcription={video?.transcription || ""} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SharePage
