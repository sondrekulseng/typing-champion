"use client"

import { PasswordInput, TextInput, Button, Alert } from '@mantine/core';
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { auth } from "/firebase.config";
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import ErrorUtils from '../errorUtils.ts';

export default function Home() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();
	const [
    	createUserWithEmailAndPassword,
    	user,
    	loading,
    	error,
  	] = useCreateUserWithEmailAndPassword(auth);

  	if (user) {
  		router.push("/account");
  		return;
  	}

	return (
		<div>
			<h3>Sign up</h3>
			<TextInput placeholder="Username" label="Username" onChange={e => setEmail(e.target.value)}/>
			<PasswordInput placeholder="Password" label="Password" onChange={e => setPassword(e.target.value)} />
			<br />
			{error
				? <Alert variant="light" color="red" title="Signup error" style={{marginBottom: '1em'}}>
      				<strong>{ErrorUtils.parseError(error.message)}</strong>
    			  </Alert>
    			: ""
    		}
			<Button loading={loading} onClick={() => createUserWithEmailAndPassword(email, password)}>Sign up</Button>
		</div>
	)
}