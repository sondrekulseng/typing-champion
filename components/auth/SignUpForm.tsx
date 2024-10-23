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
	const [passwordConfirm, setPasswordConfirm] = useState("");
	const [showPasswordErrorAlert, setShowPasswordErrorAlert] = useState(false);
	const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
	const [opened, { open, close }] = useDisclosure(false);
	const [updateProfile, updating, errorUpdate] = useUpdateProfile(auth);
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

	function verifyPassword(passInput: string, passInputConfirm: string) {
		if (passInput != passInputConfirm) {
			setShowPasswordErrorAlert(true)
			setSubmitButtonDisabled(true)
		} else {
			setShowPasswordErrorAlert(false)
			setSubmitButtonDisabled(false)
		}
	}

	function handleClose() {
		setShowPasswordErrorAlert(false)
		close()
	}

	return (
		<>
			<Modal opened={opened && !user} onClose={handleClose} title="New user" size="lg" overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}>
				<form onSubmit={handleSignUp}>
					<TextInput placeholder="MyAwesomeUsername" label="Username (will be public)" onChange={e => setUsername(e.target.value)} required />
					<TextInput placeholder="example@mail" label="Email" onChange={e => setEmail(e.target.value)} required />
					<PasswordInput placeholder="*******" label="Password" onChange={e => {
						setPassword((current => {
							verifyPassword(e.target.value, passwordConfirm)
							return e.target.value
						}))
					 }} required />
					<PasswordInput placeholder="*******" label="Confirm password" onChange={e => {
						setPasswordConfirm((current => {
							verifyPassword(password, e.target.value)
							return e.target.value
						}))
					 }} required />
					<br />
					{showPasswordErrorAlert
						? <Alert variant="light" color="red" title="Error" style={{ marginBottom: '1em' }}>
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
					<Button type='submit' loading={loading} disabled={submitButtonDisabled}>Sign up</Button>
				</form>
			</Modal>
			{openEmailVerifyModal ? <EmailVerification email={email} /> : ""}
			<Button onClick={open}>Sign up</Button>
		</>
	)
}
