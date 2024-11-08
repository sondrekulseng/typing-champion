'use client'

import { auth } from "@/firebase.config";
import { Alert, Button } from "@mantine/core";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Page() {
    const [user, loading, error] = useAuthState(auth)

    if (loading) {
        return "Loading..."
    }

    if (error) {
        return (
            <Alert variant="light" color="red" title="Error" style={{ marginTop: '1em' }}>
                An error occured
            </Alert>
        )
    }

    if (user) {
        if (user.uid == '2UxpMawI4YX1f6h75tgK4bx0ye43') {
            return (
                <>
                    <h2>Admin panel</h2>
                    <Button>
                        <Link href="admin/addText">Add text</Link>
                    </Button>
                </>
            )
        }
    }

    return (
        <Alert variant="light" color="red" title="Error" style={{ marginTop: '1em' }}>
            You don't have access to this page
        </Alert>
    )
}