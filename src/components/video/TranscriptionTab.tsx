"use client"

import React, { useState } from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'

const TranscriptionTab = ({ videoId, transcription }: { videoId: string, transcription: string }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentTranscription, setCurrentTranscription] = useState(transcription);
    const router = useRouter();

    const handleGenerateTranscription = async () => {
        setIsGenerating(true)
        try {
            const response = await api.post(`/api/library/${videoId}/transcribe`)
            setCurrentTranscription(response.data.data.transcription)
            toast.success("Transcription generated successfully!")
            // Refresh the page to show updated transcription
            router.refresh()
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Failed to generate transcription"
            toast.error(errorMessage)
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="flex flex-col gap-4">
                {currentTranscription ? (
                    <div className="p-5 rounded-xl border border-border bg-bg-secondary/30">
                        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                            {currentTranscription}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between p-4 rounded-xl border border-border bg-bg-secondary/30">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-sm font-medium text-text">No transcription available</h3>
                            <p className="text-xs text-text-secondary">
                                Generate transcription for your video using AI automatically.
                            </p>
                        </div>
                        <Button
                            onClick={handleGenerateTranscription}
                            disabled={isGenerating}
                            variant="outline"
                            className="bg-button hover:bg-button/95 text-bg rounded-2xl cursor-pointer px-5 h-9 gap-2 w-full sm:w-auto shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-bg border-t-transparent rounded-full animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Image src="/icons/ai.svg" alt="Generate" width={16} height={16} />
                                    Generate
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TranscriptionTab
