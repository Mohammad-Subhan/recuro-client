"use client"

import React, { useState } from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import toast from 'react-hot-toast'

const TranscriptionTab = ({ transcription }: { transcription: string }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateTranscription = async () => {
        setIsGenerating(true)
        // Handle generative logic here
        setTimeout(() => {
            setIsGenerating(false)
            toast.success("Transcription generated!")
        }, 1500)
    }

    return (
        <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="flex flex-col gap-4">
                {transcription ? (
                    <div className="p-5 rounded-xl border border-border bg-bg-secondary/30">
                        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                            {transcription}
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
