"use client"

import { PasswordInput, TextInput, Button, Alert, Modal } from '@mantine/core';
import { FormEvent, useState } from 'react';
import { auth } from "../../firebase.config";
import ErrorUtils from '../../utils/errorUtils';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useDisclosure } from '@mantine/hooks'
import EmailVerification from './EmailVerification';

export default function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [opened, { open, close }] = useDisclosure(false);
	const [openEmailVerifyModal, setOpenModalVerifyModal] = useState(false);
	const [
		signInWithEmailAndPassword,
		user,
		loading,
		error,
	] = useSignInWithEmailAndPassword(auth);

	async function handleLogin(evt: FormEvent<HTMLFormElement>) {
		evt.preventDefault();

		const userCredential = await signInWithEmailAndPassword(email, password);

		if (userCredential == undefined) {
			return
		}

		const user = userCredential.user;

		if (!user.emailVerified) {
			setOpenModalVerifyModal(true)
		}
	}

	return (
		<>
			<Modal opened={opened && !user} onClose={close} title="Login" size="lg" overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}>
				<form onSubmit={handleLogin}>
					<TextInput label="Email" placeholder="example@mail.com" onChange={e => setEmail(e.target.value)} required />
					<PasswordInput label="Password" placeholder="*******" onChange={e => setPassword(e.target.value)} required />
					<br />
					{error
						? <Alert variant="light" color="red" title="Login error" style={{ marginBottom: '1em' }}>
							<strong>{ErrorUtils.parseError(error.message)}</strong>
						</Alert>
						: ""
					}
					<Button type='submit' loading={loading}>Login</Button>
				</form>
			</Modal>
			{openEmailVerifyModal ? <EmailVerification email={email}/> : ""}
			<Button onClick={open}>Login</Button>
		</>
	)
}
