"use client"

import React from 'react'

const TranscriptionTab = ({ transcription }: { transcription: string }) => {
    return (
        <div className="flex flex-col gap-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-text">Transcription</h2>

            <div className="flex flex-col gap-4">
                <div className="p-5 rounded-xl border border-border bg-bg-secondary/30">
                    <p className="text-sm text-text-secondary leading-relaxed">
                        {transcription}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default TranscriptionTab
