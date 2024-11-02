"use client"

import { auth } from "@/firebase.config";
import ErrorUtils from "@/utils/errorUtils";
import { Alert, Button, PasswordInput, TextInput } from "@mantine/core";
import { FormEvent, useEffect, useState } from "react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";

export default function Page() {

    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [showEmailSendingError, setShowEmailSendingError] = useState(false);
    const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(
        auth
    );

    useEffect(() => {
        if (error != undefined) {
            setEmailSent(false);
            setShowEmailSendingError(true);
        }
    }, [error])

    async function handleReset(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        const emailSent = await sendPasswordResetEmail(email);
        if (emailSent) {
            setEmailSent(true);
            setShowEmailSendingError(false);
        }
    }

    return (
        <>
            <h3>Reset your password</h3>
            <p>Fill in the form below to send a password reset link to your email.</p>
            <form onSubmit={handleReset}>
                <TextInput label="Email" placeholder="example@mail.com" onChange={e => setEmail(e.target.value)} disabled={emailSent} required />
                {emailSent
                    ? <Alert variant="light" color="green" title="Submitted" style={{ marginTop: '1em' }}>
                        <strong>If `{email}` is linked to an account, you’ll receive a password reset link shortly.
                            Make sure to check your spam folder.</strong>
                    </Alert>
                    : ""
                }
                {showEmailSendingError && error != undefined
                    ? <Alert variant="light" color="red" title="Error" style={{ marginTop: '1em' }}>
                        <strong>{ErrorUtils.parseError(error?.message)}</strong>
                    </Alert>
                    : ""
                }
                <Button type='submit' loading={sending} style={{ marginTop: '1em' }} disabled={emailSent}>Send reset link</Button>
            </form>
        </>
    )
}