"use client"

import { PasswordInput, TextInput, Button, Alert, Modal } from '@mantine/core';
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react';
import { auth } from "../../firebase.config";
import ErrorUtils from '../../utils/errorUtils';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import Link from 'next/link';

type Props = {
	open: boolean,
	setOpen: Dispatch<SetStateAction<boolean>>
}

export default function LoginModal({ open, setOpen }: Readonly<Props>) {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showFirebaseAuthError, setShowFirebaseAuthError] = useState(false);
	const [
		signInWithEmailAndPassword,
		user,
		loading,
		error
	] = useSignInWithEmailAndPassword(auth);

	useEffect(() => {
		if (error != undefined) {
			setShowFirebaseAuthError(true)
			return
		}
	}, [error]);

	async function handleLogin(evt: FormEvent<HTMLFormElement>) {
		evt.preventDefault();
		await signInWithEmailAndPassword(email, password);
	}

	function handleClose() {
		setShowFirebaseAuthError(false)
		setOpen(false)
		close()
	}

	return (
		<Modal opened={open} onClose={handleClose} title="Login" size="lg" overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}>
			<form onSubmit={handleLogin}>
				<TextInput label="Email" placeholder="example@mail.com" onChange={e => setEmail(e.target.value)} required />
				<PasswordInput label="Password" placeholder="*******" onChange={e => setPassword(e.target.value)} required />
				<br />
				{showFirebaseAuthError && error
					? <Alert variant="light" color="red" title="Login error" style={{ marginBottom: '1em' }}>
						<strong>{ErrorUtils.parseError(error.message)}</strong>
					</Alert>
					: ""
				}
				<Button type='submit' loading={loading}>Login</Button>
				<p><Link href="/passwordReset" target="_blank">Forgot password?</Link></p>
			</form>
		</Modal>
	)
}
