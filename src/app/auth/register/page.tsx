"use client"

import AuthForm from '@/components/AuthForm'
import React from 'react'

const Register = () => {
    return (
        <div className="flex justify-center items-center min-h-dvh">
            <AuthForm isLogin={false} />
        </div>
    )
}

export default Register