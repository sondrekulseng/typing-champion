"use client"

import { PasswordInput, TextInput, Button, Alert, Modal } from '@mantine/core';
import { FormEvent, useEffect, useState } from 'react';
import { auth } from "../../firebase.config";
import ErrorUtils from '../../utils/errorUtils';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useDisclosure } from '@mantine/hooks'
import Link from 'next/link';

export default function LoginForm() {
	
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showFirebaseAuthError, setShowFirebaseAuthError] = useState(false);
	const [opened, { open, close }] = useDisclosure(false);
	const [
		signInWithEmailAndPassword,
		user,
		loading,
		error
	] = useSignInWithEmailAndPassword(auth);

	useEffect(() => {
		if (error != undefined) {
			setShowFirebaseAuthError(true)
		}
	}, [error]);

	async function handleLogin(evt: FormEvent<HTMLFormElement>) {
		evt.preventDefault();
		await signInWithEmailAndPassword(email, password);
	}

	function handleClose() {
		setShowFirebaseAuthError(false)
		close()
	}

	return (
		<>
			<Modal opened={opened} onClose={handleClose} title="Login" size="lg" overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}>
				<form onSubmit={handleLogin}>
					<TextInput label="Email" placeholder="example@mail.com" onChange={e => setEmail(e.target.value)} required />
					<PasswordInput label="Password" placeholder="*******" onChange={e => setPassword(e.target.value)} required />
					<br />
					{showFirebaseAuthError && error != undefined
						? <Alert variant="light" color="red" title="Login error" style={{ marginBottom: '1em' }}>
							<strong>{ErrorUtils.parseError(error.message)}</strong>
						</Alert>
						: ""
					}
					<Button type='submit' loading={loading}>Login</Button>
					<p><Link href="/passwordReset" target="_blank">Forgot password?</Link></p>
				</form>
			</Modal>
			<Button onClick={open}>Login</Button>
		</>
	)
}
