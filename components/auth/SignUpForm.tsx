"use client"

import { PasswordInput, TextInput, Button, Alert, Modal } from '@mantine/core';
import { FormEvent, useState } from 'react';
import { auth } from "../../firebase.config";
import { useCreateUserWithEmailAndPassword, useSendEmailVerification, useUpdateProfile } from 'react-firebase-hooks/auth';
import ErrorUtils from '../../utils/errorUtils';
import { useDisclosure } from '@mantine/hooks'
import EmailVerification from './EmailVerification';

export default function SignUpForm() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordError, setPasswordError] = useState(true);
	const [opened, { open, close }] = useDisclosure(false);
	const [updateProfile, updating, errorUpdate] = useUpdateProfile(auth);
	const [sendEmailVerification, sending, errorEmail] = useSendEmailVerification(auth);
	const [openEmailVerifyModal, setOpenModalVerifyModal] = useState(false);

	const [
		createUserWithEmailAndPassword,
		user,
		loading,
		error,
	] = useCreateUserWithEmailAndPassword(auth);

	if (errorUpdate) {
		console.log(errorUpdate)
	}

	if (updating) {
		console.log(updating)
	}

	async function handleSignUp(evt: FormEvent<HTMLFormElement>) {
		evt.preventDefault();
		const user = await createUserWithEmailAndPassword(email, password);
		if (user) {
			await updateProfile({ displayName: username })
			setOpenModalVerifyModal(true)
		}
	}

	function verifyPassword(input: string) {
		if (password != input) {
			setPasswordError(true)
		} else {
			setPasswordError(false)
		}
	}

	function handleClose() {
		setPasswordError(false)
		close()
	}

	return (
		<>
			<Modal opened={opened && !user} onClose={handleClose} title="New user" size="lg" overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}>
				<form onSubmit={handleSignUp}>
					<TextInput placeholder="MyAwesomeUsername" label="Username (will be public)" onChange={e => setUsername(e.target.value)} required />
					<TextInput placeholder="example@mail" label="Email" onChange={e => setEmail(e.target.value)} required />
					<PasswordInput placeholder="*******" label="Password" onChange={e => setPassword(e.target.value)} required />
					<PasswordInput placeholder="*******" label="Confirm password" onChange={e => verifyPassword(e.target.value)} required />
					<br />
					{passwordError
						? <Alert variant="light" color="yellow" title="Warning" style={{ marginBottom: '1em' }}>
							<strong>Passwords do not match</strong>
						</Alert>
						: ""
					}
					{error
						? <Alert variant="light" color="red" title="Signup error" style={{ marginBottom: '1em' }}>
							<strong>{ErrorUtils.parseError(error.message)}</strong>
						</Alert>
						: ""
					}
					<Button type='submit' loading={loading} disabled={passwordError}>Sign up</Button>
				</form>
			</Modal>
			{openEmailVerifyModal ? <EmailVerification email={email} /> : ""}
			<Button onClick={open}>Sign up</Button>
		</>
	)
}
