"use client"

import AIToolsTab from '@/components/video/AIToolsTab'
import TranscriptionTab from '@/components/video/TranscriptionTab'
import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

type TabType = 'ai-tools' | 'transcription'

const VideoPage = ({ params }: { params: Promise<{ id: string }> }) => {
    // const { id } = React.use(params);
    const [activeTab, setActiveTab] = useState<TabType>('ai-tools');

    return (
        <div className="h-full w-full flex flex-col gap-[35px] pt-5">
            {/* Video Title and Info */}
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold text-text">Dare to dream big</h1>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <span className="text-text font-semibold">John Doe</span>
                        <span>4d ago</span>
                    </div>
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-3">
                    <Button className="w-9 h-9 p-0 flex items-center justify-center cursor-pointer">
                        <Image src="/icons/edit.svg" alt="Edit" width={18} height={18} />
                    </Button>
                    <Button className="w-9 h-9 p-0 flex items-center justify-center cursor-pointer">
                        <Image src="/icons/link.svg" alt="Share" width={18} height={18} />
                    </Button>
                    <Button className="w-9 h-9 p-0 flex items-center justify-center cursor-pointer">
                        <Image src="/icons/download.svg" alt="Download" width={18} height={18} />
                    </Button>
                </div>
            </div>

            <div className="flex xl:flex-row flex-col gap-6">
                {/* Left Side - Video and Description */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Video Thumbnail/Player Placeholder */}
                    <div className="w-full aspect-video rounded-2xl overflow-hidden bg-bg-secondary relative cursor-pointer">
                        <video
                            src="/videos/video.mp4"
                            controls={true}
                            className="w-full h-full object-cover"
                        />
                        {/* Play Button Overlay */}
                    </div>

                    {/* Description Section */}
                    <div className="flex flex-col gap-3 pb-10">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-text">Description</h2>
                            <Button className="w-8 h-8 rounded-lg hover:bg-bg-secondary flex items-center justify-center transition-colors cursor-pointer">
                                <Image src="/icons/edit.svg" alt="Edit" width={16} height={16} />
                            </Button>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation, ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </div>
                </div>

                {/* Right Side - Tabs */}
                <div className="w-full lg:w-[400px] flex flex-col gap-6">
                    {/* Tabs Navigation */}
                    <div className="flex items-center gap-6 relative">
                        <Button
                            onClick={() => setActiveTab('ai-tools')}
                            className={`text-sm font-medium pb-3 cursor-pointer relative transition-colors duration-200 ${activeTab === 'ai-tools'
                                ? 'text-text'
                                : 'text-text-secondary hover:text-text'
                                }`}
                        >
                            AI tools
                            {activeTab === 'ai-tools' && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-text rounded-full animate-slideIn" />
                            )}
                        </Button>

                        <Button
                            onClick={() => setActiveTab('transcription')}
                            className={`text-sm font-medium pb-3 cursor-pointer relative transition-colors duration-200 ${activeTab === 'transcription'
                                ? 'text-text'
                                : 'text-text-secondary hover:text-text'
                                }`}
                        >
                            Transcription
                            {activeTab === 'transcription' && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-text rounded-full animate-slideIn" />
                            )}
                        </Button>

                        {/* Bottom border for tabs */}
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border -z-10" />
                    </div>

                    {/* Tab Content */}
                    <div key={activeTab}>
                        {activeTab === 'ai-tools' ? <AIToolsTab /> : <TranscriptionTab />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoPage