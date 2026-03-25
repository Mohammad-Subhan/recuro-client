"use client"

import React, { useEffect, useState } from 'react'
import { Sidebar, SidebarContent } from './ui/sidebar'
import Image from 'next/image'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import { useRouter, usePathname } from 'next/navigation'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { useAppSelector } from '@/store/hooks'

const menuItems = [
    {
        label: "Home",
        icon: "/icons/home.svg",
        activeIcon: "/icons/home-active.svg",
        link: "/dashboard"
    },
    {
        label: "My Library",
        icon: "/icons/library.svg",
        activeIcon: "/icons/library-active.svg",
        link: "/dashboard/library"
    },
    {
        label: "Billing",
        icon: "/icons/card.svg",
        activeIcon: "/icons/card-active.svg",
        link: "/dashboard/billing"
    },
    {
        label: "Settings",
        icon: "/icons/settings.svg",
        activeIcon: "/icons/settings-active.svg",
        link: "/dashboard/settings"
    }
];

const AppSidebar = () => {
    const pathname = usePathname()
    const { fetchTrigger } = useAppSelector(s => s.video)
    const [storageUsed, setStorageUsed] = useState(0)
    const [storageLimit, setStorageLimit] = useState(1024 * 1024 * 1024)

    useEffect(() => {
        api.get('/api/user/me')
            .then(res => {
                const u = res.data.data.user
                setStorageUsed(u.storageUsed ?? 0)
                setStorageLimit(u.storageLimit ?? 1024 * 1024 * 1024)
            })
            .catch(err => console.error("Failed to fetch storage stats", err))
    }, [fetchTrigger])

    // Format metrics
    const usedMb = (storageUsed / (1024 * 1024)).toFixed(0)
    const limitGb = (storageLimit / (1024 * 1024 * 1024)).toFixed(0)
    const percent = Math.min(100, Math.max(0, (storageUsed / storageLimit) * 100))

    return (
        <Sidebar className="bg-bg border-none">
            <SidebarContent className="flex flex-col w-full h-full px-[30px] py-[35px] gap-[60px]">
                <div className="flex justify-center items-center gap-[10px]">
                    <Image src={"/icons/logo.svg"} alt="Recura Logo" width={40} height={40} />
                    <p className="text-[26px] font-semibold">Recura</p>
                </div>

                <div className="flex flex-col w-full h-full gap-11">
                    <div className="flex flex-col gap-[5px]">
                        <p className="font-semibold text-sm text-text-secondary pb-[15px]">Menu</p>
                        {menuItems.map((item, index) => (
                            <MenuItem key={index} item={item} currentPath={pathname} />
                        ))}
                    </div>

                    <div className="flex flex-col gap-2 mt-2 px-1">
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-text">Storage</span>
                            <span className="text-text-secondary">{usedMb} MB / {limitGb} GB</span>
                        </div>
                        <div className="w-full h-1.5 bg-bg-secondary rounded-full overflow-hidden border border-border">
                            <div 
                                className="h-full bg-button transition-all duration-500 rounded-full"
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                    </div>

                    <Separator className="bg-border" />

                    <div className="flex flex-col gap-7 px-[15px] py-[18px] border border-border rounded-2xl w-full">
                        <div className="flex flex-col gap-3">
                            <h1 className="font-semibold text-text">Upgrade to Pro</h1>
                            <p className="text-xs text-text-secondary">Unlock unlimited videos, AI features like transcription, AI summary and more</p>
                        </div>

                        <Button
                            onClick={() => toast("Coming soon!")}
                            className="bg-button w-full rounded-2xl text-bg cursor-pointer hover:bg-button/95 font-semibold text-[14px]"
                        >
                            Upgrade
                        </Button>
                    </div>
                </div>
            </SidebarContent>
        </Sidebar>
    )
}

interface MenuItemProps {
    label: string;
    icon: string;
    activeIcon: string;
    link: string;
}

const MenuItem = ({ item, currentPath }: { item: MenuItemProps, currentPath: string }) => {

    const isActive: boolean = currentPath === item.link;
    const router = useRouter();

    const onClick = () => {
        router.push(item.link);
    }

    return (
        <div className={`flex items-center gap-4 cursor-pointer p-[10px] ${isActive ? "bg-bg-secondary" : "hover:bg-bg-secondary/20"} rounded-2xl`} onClick={onClick}>
            <Image src={isActive ? item.activeIcon : item.icon} alt={item.label} width={24} height={24} />
            <p className={`text-sm font-medium ${isActive ? "text-text" : "text-text-secondary"}`}>{item.label}</p>
        </div>
    )
}

export default AppSidebar;