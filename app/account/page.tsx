"use client";

import { useAuthState } from 'react-firebase-hooks/auth'
import { useState } from 'react'
import { Skeleton } from '@mantine/core'
import { useRouter } from 'next/navigation'
import SignOutButton from './signOutButton'
import { auth } from "/firebase.config"

export default function Page() {
	const [user, loading, error] = useAuthState(auth)
	const router = useRouter()

	if (loading) {
		return <Skeleton height={8} mt={6} height={30} width="50%" />
	}

	if (error) {
		return <p>Error occured</p>
	}

	if (!user) {
		router.push("/login")
	}

	if (user) {
		return (
			<>
				<h3>Hello {user.email}!</h3>
				<SignOutButton />
			</>
		)
	}
}