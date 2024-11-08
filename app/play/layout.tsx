'use client'

import SelectText from '@/components/selects/SelectText';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {

    const { push } = useRouter()
    const pathname = usePathname()
    const segments = pathname.split('/')
    const pathTextId = segments[segments.length - 1]
    const [textId, setTextId] = useState(pathTextId)

    useEffect(() => {
        if (textId != pathTextId) {
            const newPath = pathname.replace(pathTextId, textId)
            push(newPath)
        }
    })

    return (
        <>
            <SelectText textId={textId} setTextId={setTextId} />
            {children}
        </>
    )
}