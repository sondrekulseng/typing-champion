"use client"

import { PasswordInput, TextInput, Button, Alert, Modal } from '@mantine/core';
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { auth } from "/firebase.config";
import { useCreateUserWithEmailAndPassword, useUpdateProfile } from 'react-firebase-hooks/auth';
import { updateProfile } from "firebase/auth";
import ErrorUtils from '../errorUtils.ts';
import { useDisclosure } from '@mantine/hooks'

export default function SignUpPage() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [opened, { open, close }] = useDisclosure(false);
	const router = useRouter();
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

	return (
		<>
			<Modal opened={opened} onClose={close} title="New user" size="lg" overlayProps={{backgroundOpacity: 0.55, blur: 3}}>
			<TextInput placeholder="MyAwesomeUsername" label="Username (will be public)" onChange={e => setUsername(e.target.value)}/>
				<TextInput placeholder="example@mail.com" label="Email" onChange={e => setEmail(e.target.value)}/>
				<PasswordInput placeholder="Password" label="Password" onChange={e => setPassword(e.target.value)} />
				<br />
				{error
					? <Alert variant="light" color="red" title="Signup error" style={{marginBottom: '1em'}}>
      				<strong>{ErrorUtils.parseError(error.message)}</strong>
    			  </Alert>
    			: ""
    		}
			<Button loading={loading} onClick={async () => {
				const user = await createUserWithEmailAndPassword(email, password);
				if (user) {
					await updateProfile({ displayName: username })
				}
			}}>Sign up</Button>
		</Modal>
		<Button onClick={open}>Sign up</Button>
		</>
	)
}
