"use client"

import Heading from '@/components/Heading'
import VideoCard from '@/components/VideoCard'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setVideos, setSearch, setSortBy, setOrder, triggerRefetch } from '@/store/slices/videoSlice'
import { Video } from '@/store/slices/videoSlice'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

// ─── Loading Skeleton Card ───────────────────────────────────────────────────
const VideoSkeletonCard = () => (
    <div className="flex flex-col rounded-2xl overflow-hidden w-full min-w-[180px] animate-pulse">
        <div className="aspect-video w-full bg-text/[0.08] rounded-t-2xl" />
        <div className="flex flex-col gap-2 px-4 pt-3 pb-5 border-l border-r border-b border-border rounded-b-2xl">
            <div className="h-3 rounded bg-text/[0.08] w-3/4" />
            <div className="h-2.5 rounded bg-text/[0.06] w-1/2" />
            <div className="h-6" />
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-text/[0.08]" />
                <div className="h-2 rounded bg-text/[0.06] w-20" />
            </div>
        </div>
    </div>
)

// ─── Sort Option Types ───────────────────────────────────────────────────────
type SortOption = { label: string; sortBy: string; order: 'asc' | 'desc' }

const SORT_OPTIONS: SortOption[] = [
    { label: 'Newest first', sortBy: 'createdAt', order: 'desc' },
    { label: 'Oldest first', sortBy: 'createdAt', order: 'asc' },
    { label: 'A → Z', sortBy: 'title', order: 'asc' },
    { label: 'Z → A', sortBy: 'title', order: 'desc' },
]

// ─── Library Page ────────────────────────────────────────────────────────────
const Library = () => {
    const dispatch = useAppDispatch()
    const { videos, search, sortBy, order, fetchTrigger } = useAppSelector((s) => s.video)

    const [localSearch, setLocalSearch] = useState(search)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [videoToDelete, setVideoToDelete] = useState<Video | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const dropdownRef = useRef<HTMLDivElement>(null)
    const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)

    const fetchVideos = async (params: { sortBy?: string; order?: string; search?: string } = {}) => {
        try {
            setLoading(true)
            setError(null)
            const response = await api.get('/api/library', { params })
            dispatch(setVideos(response.data.data as Video[]))
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Failed to fetch videos'
            setError(message)
            toast.error(message)
        } finally {
            setLoading(false)
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchVideos({ sortBy, order, search })
    }, [fetchTrigger]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, []);

    // Debounced search
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setLocalSearch(val)
        if (searchDebounce.current) clearTimeout(searchDebounce.current)
        searchDebounce.current = setTimeout(() => {
            dispatch(setSearch(val))
            fetchVideos({ sortBy, order, search: val })
        }, 400)
    }

    const handleSortSelect = (option: SortOption) => {
        dispatch(setSortBy(option.sortBy))
        dispatch(setOrder(option.order))
        fetchVideos({ sortBy: option.sortBy, order: option.order, search })
        setDropdownOpen(false)
    }

    const handleDelete = async () => {
        if (!videoToDelete) return
        try {
            setDeleteLoading(true)
            await api.delete(`/api/library/${videoToDelete._id}`)
            toast.success('Video deleted')
            setVideoToDelete(null)
            dispatch(triggerRefetch()) // dispatch refetch to update both library & sidebar storage
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to delete video')
        } finally {
            setDeleteLoading(false)
        }
    }

    const currentSortLabel =
        SORT_OPTIONS.find((o) => o.sortBy === sortBy && o.order === order)?.label ?? 'Newest first'

    const skeletons = Array.from({ length: 5 })

    return (
        <div className="h-full w-full flex flex-col gap-[35px]">
            <Heading label="Library" />

            {/* ── Controls Bar ─────────────────────────────────── */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* Search */}
                <div className="relative flex items-center w-full max-w-sm">
                    <Image
                        src="/icons/search.svg"
                        alt="search"
                        width={16}
                        height={16}
                        className="absolute left-3 opacity-40 pointer-events-none"
                    />
                    <input
                        type="text"
                        value={localSearch}
                        onChange={handleSearchChange}
                        placeholder="Search videos…"
                        className="w-full bg-transparent border border-border rounded-xl pl-9 pr-4 py-2 text-sm placeholder:text-text/30 focus:outline-none focus:border-text/30 transition-colors"
                    />
                    {localSearch && (
                        <button
                            className="absolute right-3 text-text/30 cursor-pointer hover:text-text/60 transition-colors"
                            onClick={() => {
                                setLocalSearch('')
                                dispatch(setSearch(''))
                                fetchVideos({ sortBy, order, search: '' })
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Sort Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen((p) => !p)}
                        className="flex items-center gap-2 border border-border rounded-xl px-4 py-2 text-sm text-text/60 hover:text-text hover:border-text/30 transition-colors cursor-pointer"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-50" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 4h10M4 7h6M6 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span>{currentSortLabel}</span>
                        <span className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>▾</span>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 bg-bg border border-border rounded-xl shadow-xl z-20 min-w-[160px] overflow-hidden">
                            {SORT_OPTIONS.map((opt) => {
                                const isActive = opt.sortBy === sortBy && opt.order === order
                                return (
                                    <button
                                        key={opt.label}
                                        onClick={() => handleSortSelect(opt)}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${isActive
                                            ? 'bg-text/[0.06] text-text font-medium'
                                            : 'text-text/60 hover:bg-text/[0.04] hover:text-text'
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Videos Section ───────────────────────────────── */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-start items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Image src="/icons/video-camera.svg" alt="videos" width={20} height={20} />
                        <p className="text-text/40 font-medium text-sm">
                            {loading ? 'Loading…' : `${videos.length} Video${videos.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>

                    <Button
                        onClick={() => fetchVideos({ sortBy, order, search })}
                        disabled={loading}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text bg-bg-secondary hover:bg-border border border-border rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={loading ? "animate-spin" : ""}>
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                        Refresh
                    </Button>
                </div>

                {/* Error State */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                        <p className="text-text/40 text-sm">{error}</p>
                        <button
                            onClick={() => fetchVideos({ sortBy, order, search })}
                            className="text-xs px-4 py-2 border border-border rounded-lg hover:bg-text/[0.04] transition-colors cursor-pointer"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Loading Skeletons */}
                {loading && (
                    <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-3 grid-cols-2 gap-x-5 gap-y-5">
                        {skeletons.map((_, i) => <VideoSkeletonCard key={i} />)}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && videos.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-text/[0.06] flex items-center justify-center">
                            <Image src="/icons/video-camera.svg" alt="no videos" width={28} height={28} className="opacity-30" />
                        </div>
                        <div>
                            <p className="font-medium text-sm text-text/60">
                                {search ? `No videos matching "${search}"` : 'No videos yet'}
                            </p>
                            <p className="text-xs text-text/30 mt-1">
                                {search ? 'Try a different search term.' : 'Record or upload your first video to get started.'}
                            </p>
                        </div>
                        {search && (
                            <button
                                onClick={() => {
                                    setLocalSearch('')
                                    dispatch(setSearch(''))
                                    fetchVideos({ sortBy, order, search: '' })
                                }}
                                className="text-xs px-4 py-2 border border-border rounded-lg hover:bg-text/[0.04] transition-colors cursor-pointer"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                )}

                {/* Video Grid */}
                {!loading && !error && videos.length > 0 && (
                    <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-3 grid-cols-2 gap-x-5 gap-y-5">
                        {videos.map((video) => (
                            <VideoCard key={video._id} video={video} onDelete={setVideoToDelete} />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Delete Confirm Dialog ─────────────────────────────────────── */}
            <Dialog open={!!videoToDelete} onOpenChange={(open) => !open && setVideoToDelete(null)}>
                <DialogContent showCloseButton={false} className="w-[420px] bg-bg-secondary border border-border rounded-2xl p-8 flex flex-col gap-6">
                    <button
                        onClick={() => setVideoToDelete(null)}
                        className="absolute p-0 cursor-pointer top-6 right-6 w-8 h-8 rounded-lg flex items-center justify-center transition-colors outline-none"
                    >
                        <Image src="/icons/close.svg" alt="Close" width={18} height={18} />
                    </button>
                    <div className="flex items-center gap-3">
                        <DialogTitle className="text-xl font-semibold text-text">Delete Video</DialogTitle>
                    </div>
                    <p className="text-sm text-text/50 -mt-2">
                        Are you sure you want to delete <span className="text-text font-medium">"{videoToDelete?.title}"</span>? This cannot be undone.
                    </p>
                    <div className="flex items-center gap-3">
                        <Button
                            className="flex-1 bg-transparent border border-border hover:bg-border text-text rounded-2xl h-11 font-medium cursor-pointer"
                            onClick={() => setVideoToDelete(null)}
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
        </div>
    )
}

export default Library