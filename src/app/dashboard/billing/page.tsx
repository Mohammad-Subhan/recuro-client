"use client"

import Heading from '@/components/Heading'
import { Button } from '@/components/ui/button'
import React from 'react'
import toast from 'react-hot-toast'

const Billing = () => {
    return (
        <div className="h-full w-full flex flex-col gap-[35px]">
            <Heading label="Billing" />
            <div className="flex flex-col gap-4">
                {/* Current Plan Section */}
                <div className="flex flex-col gap-6 bg-text/3 p-5 rounded-2xl">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-medium text-text">Current Plan</h2>
                        <p className="text-xs text-text-secondary">Your payment history</p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="text-2xl font-semibold text-text">$0/Month</div>
                        <div className="text-xs text-text-secondary uppercase tracking-wide">FREE</div>
                    </div>

                </div>
                <Button
                    onClick={() => toast("Coming soon!")}
                    className="w-fit px-8 h-10 rounded-2xl cursor-pointer hover:bg-button/95 bg-button text-bg"
                >
                    Change Plan
                </Button>
            </div>
        </div>
    )
}

export default Billing