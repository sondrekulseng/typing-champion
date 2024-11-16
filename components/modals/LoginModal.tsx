"use client"

import { Divider, Modal } from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';
import SignInWithGoogleButton from '../buttons/Google/SignInWithGoogleButton';
import SignInWithEmailAndPasswordForm from '../forms/SignInWithEmailAndPasswordForm';
import SignInWithGitHubButton from '../buttons/GitHub/SignInWithGitHubButton';

type Props = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

export default function LoginModal({ open, setOpen }: Readonly<Props>) {

    function handleClose() {
        setOpen(false)
    }

    return (
        <Modal opened={open} onClose={handleClose} title="Login" size="lg" overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}>
            <SignInWithGoogleButton />
            <SignInWithGitHubButton />
            <Divider my="xs" label="or continue with email" labelPosition="center" style={{ paddingTop: '1em', paddingBottom: '1em' }} />
            <SignInWithEmailAndPasswordForm />
        </Modal>
    )
}
