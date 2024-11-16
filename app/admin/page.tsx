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
        if (user.uid == 'vjSuDunjAAhOsySLIQlyjiHc0Co1') {
            return (
                <>
                    <h2>Admin panel</h2>
                    <Link href="admin/addText">
                        <Button>Add text</Button>
                    </Link>
                </>
            )
        }
    }

    return (
        <Alert variant="light" color="red" title="Error" style={{ marginTop: '1em' }}>
            You are not authorized to access this page
        </Alert>
    )
}