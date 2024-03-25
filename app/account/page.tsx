"use client";

import { Button } from '@mantine/core';
import { auth } from "/firebase.config";
import { useRouter } from 'next/navigation'
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useState } from 'react';
import { Skeleton } from '@mantine/core';

export default function Page() {
	const [isLoading, setLoading] = useState(true);
	const [email, setEmail] = useState();
	const router = useRouter();

	onAuthStateChanged(auth, loggedInUser => {
		if (!loggedInUser) {
			router.push("/login")
			return
		} 
		setLoading(false);
		setEmail(loggedInUser.email);
	})

	function logOut() {
		signOut(auth)
			.then(() => router.push("/login"))
			.catch(error => alert(error.message));
	}

	if (isLoading) {
		return <Skeleton height={8} mt={6} height={30} width="50%" />
	}

	return (
		<>
			<h3>Hello {email}!</h3>
			<Button onClick={logOut}>Sign out</Button>
		</>
	)
}