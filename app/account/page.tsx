"use client";

import { auth } from "/firebase.config"
import { useAuthState } from 'react-firebase-hooks/auth'
import { useState } from 'react'
import { Skeleton } from '@mantine/core'
import SignOutButton from './signOutButton'

export default function Page() {
	const [user, loading, error] = useAuthState(auth)

	if (loading) {
		return <Skeleton height={8} mt={6} height={30} width="50%" />
	}

	if (error) {
		return <p>Error occured</p>
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