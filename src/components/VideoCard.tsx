"use client"

import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Video } from '@/store/slices/videoSlice'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface VideoCardProps {
    video: Video;
    onDelete?: (video: Video) => void;
}

const formatDuration = (seconds: number): string => {
    if (!seconds || seconds === 0) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
};

const getFormattedDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return 'Today';
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    const years = Math.floor(diffInDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
};

const VideoCard = ({ video, onDelete }: VideoCardProps) => {
    const router = useRouter();

    const onVideoClick = () => {
        router.push(`/dashboard/library/${video._id}`);
    };

    return (
        <div
            className="flex flex-col rounded-2xl overflow-hidden w-full min-w-[180px] group relative"
        >
            <div
                className="relative w-full aspect-video bg-black overflow-hidden cursor-pointer"
                onClick={onVideoClick}
            >
                <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                />
                {video.duration > 0 && (
                    <p className="absolute bottom-[6px] right-[6px] font-medium text-[10px] px-2 py-0.5 bg-bg/70 backdrop-blur-sm rounded-full text-white">
                        {formatDuration(video.duration)}
                    </p>
                )}
            </div>

            <div
                className="flex relative pt-3 flex-col gap-1 px-4 border-l border-r border-b border-border rounded-b-2xl pb-10 hover:bg-text/[0.02] transition-all cursor-pointer"
                onClick={onVideoClick}
            >
                <div className="flex items-start justify-between gap-2 pr-6">
                    <h2 className="font-medium text-sm leading-snug line-clamp-2">{video.title}</h2>
                </div>

                {/* ── Context Menu ─── */}
                <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="p-1 outline-none hover:bg-text/[0.06] transition-colors rounded-full cursor-pointer">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text/50 hover:text-text transition-colors"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 bg-bg border-border rounded-2xl p-1.5 shadow-xl">
                            <DropdownMenuItem
                                className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 rounded-xl cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10 hover:text-red-500 focus:text-red-500"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete?.(video);
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <p className="font-normal text-[10px] text-text/40">
                    {getFormattedDate(video.createdAt)}
                </p>
                <div className="h-6" />
                <div className="flex absolute bottom-4 gap-2 items-center text-[10px] pt-1">
                    <Image
                        src="/icons/user.svg"
                        alt="user icon"
                        className="p-1 bg-text/[0.08] rounded-full"
                        width={24}
                        height={24}
                    />
                    <p className="truncate max-w-[120px]">{video.author?.fullName ?? 'Unknown'}</p>
                </div>
            </div>
        </div>
    );
};

export default VideoCard