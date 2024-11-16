"use client"

import { Modal, Divider } from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';
import SignUpWithEmailAndPasswordForm from '../forms/SignUpWithEmailAndPasswordForm';
import SignInWithGoogleButton from '../buttons/Google/SignInWithGoogleButton';

type Props = {
	open: boolean,
	setOpen: Dispatch<SetStateAction<boolean>>
}

export default function SignUpModal({ open, setOpen }: Readonly<Props>) {

	function handleClose() {
		setOpen(false)
	}

	return (
		<Modal opened={open} onClose={handleClose} title="Sign Up" size="lg" overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}>
			<SignInWithGoogleButton />
			<Divider my="xs" label="or create an account" labelPosition="center" style={{ paddingTop: '1em', paddingBottom: '1em' }} />
			<SignUpWithEmailAndPasswordForm />
		</Modal>
	)
}
