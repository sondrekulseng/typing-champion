"use client"

import { PasswordInput, TextInput, Button, Alert, Modal } from '@mantine/core';
import { FormEvent, useState } from 'react';
import { auth } from "../../firebase.config";
import { useCreateUserWithEmailAndPassword, useUpdateProfile } from 'react-firebase-hooks/auth';
import ErrorUtils from '../../utils/errorUtils';
import { useDisclosure } from '@mantine/hooks'

export default function SignUpForm() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [opened, { open, close }] = useDisclosure(false);
	const [updateProfile, updating, errorUpdate] = useUpdateProfile(auth);
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
		}
	}

	return (
		<>
		<Modal opened={opened} onClose={close} title="New user" size="lg" overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}>
		<form onSubmit={handleSignUp}>
		<TextInput placeholder="MyAwesomeUsername" label="Username (will be public)" onChange={e => setUsername(e.target.value)} required />
		<TextInput placeholder="example@mail" label="Email" onChange={e => setEmail(e.target.value)} required />
		<PasswordInput placeholder="*******" label="Password" onChange={e => setPassword(e.target.value)} required />
		<br />
		{error
			? <Alert variant="light" color="red" title="Signup error" style={{ marginBottom: '1em' }}>
				<strong>{ErrorUtils.parseError(error.message)}</strong>
			  </Alert>
			: ""
		}
		<Button type='submit' loading={loading}>Sign up</Button>
		</form>
		</Modal>
		<Button onClick={open}>Sign up</Button>
		</>
	)
}
