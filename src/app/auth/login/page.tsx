"use client"

import AuthForm from '@/components/AuthForm'
import React from 'react'

const Login = () => {
    return (
        <div className="flex justify-center items-center min-h-dvh">
            <AuthForm isLogin={true} />
        </div>
    )
}

export default Login