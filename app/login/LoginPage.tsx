"use client"

import { PasswordInput, TextInput, Button, Alert, Modal } from '@mantine/core';
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { auth } from "/firebase.config";
import ErrorUtils from '../errorUtils.ts';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks'
import SignOutButton from './SignOutButton'

type Props = {
	close: Boolean
}
export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [opened, { open, close }] = useDisclosure(false);
	const router = useRouter();
	const [
    	signInWithEmailAndPassword,
    	user,
    	loading,
    	error,
  	] = useSignInWithEmailAndPassword(auth);

  	if (user) {
  		return;
  	}

	return (
		<>
			<Modal opened={opened} onClose={close} title="Login" size="lg" overlayProps={{backgroundOpacity: 0.55, blur: 3}}>
				<TextInput label="Email" placeholder="joe@example.com" onChange={e => setEmail(e.target.value)}/>
				<PasswordInput label="Password" placeholder="*******" onChange={e => setPassword(e.target.value)} />
				<br />
				{error
					? <Alert variant="light" color="red" title="Login error" style={{marginBottom: '1em'}}>
      					<strong>{ErrorUtils.parseError(error.message)}</strong>
    			  	</Alert>
    				: ""
    			}
					<Button loading={loading} onClick={() => signInWithEmailAndPassword(email, password)}>Login</Button>
			</Modal>
			<Button onClick={open}>Login</Button>
		</>
	)
}
