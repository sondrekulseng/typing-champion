"use client"

import { PasswordInput, TextInput, Button, Alert } from '@mantine/core';
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { auth } from "/firebase.config";
import ErrorUtils from '../errorUtils.ts';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Loader } from '@mantine/core';

export default function Page() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();
	const [
    	signInWithEmailAndPassword,
    	user,
    	loading,
    	error,
  	] = useSignInWithEmailAndPassword(auth);

  	if (user) {
  		router.push("/");
  		return;
  	}

	return (
		<div>
			<h3>Login</h3>
			<TextInput label="Username" placeholder="joe@example.com" onChange={e => setEmail(e.target.value)}/>
			<PasswordInput label="Password" placeholder="*******" onChange={e => setPassword(e.target.value)} />
			<br />
			{error
				? <Alert variant="light" color="red" title="Login error" style={{marginBottom: '1em'}}>
      				<strong>{ErrorUtils.parseError(error.message)}</strong>
    			  </Alert>
    			: ""
    		}
			<Button loading={loading} onClick={() => signInWithEmailAndPassword(email, password)}>Login</Button>
		</div>
	)
}