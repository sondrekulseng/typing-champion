import { auth } from "@/firebase.config";
import ErrorUtils from "@/utils/errorUtils";
import { TextInput, PasswordInput, Alert, Button } from "@mantine/core";
import Link from "next/link";
import { useState, useEffect, FormEvent } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";

export default function SignInWithEmailAndPasswordForm() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showFirebaseAuthError, setShowFirebaseAuthError] = useState(false);
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error
    ] = useSignInWithEmailAndPassword(auth);

    useEffect(() => {
        if (error != undefined) {
            setShowFirebaseAuthError(true)
            return
        }
    }, [error]);

    async function handleLogin(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        await signInWithEmailAndPassword(email, password);
    }

    return (
        <form onSubmit={handleLogin}>
            <TextInput label="Email" placeholder="example@mail.com" onChange={e => setEmail(e.target.value)} required />
            <PasswordInput label="Password" placeholder="*******" onChange={e => setPassword(e.target.value)} required />
            <br />
            {showFirebaseAuthError && error
                ? <Alert variant="light" color="red" title="Login error" style={{ marginBottom: '1em' }}>
                    <strong>{ErrorUtils.parseError(error.message)}</strong>
                </Alert>
                : ""
            }
            <Button type='submit' loading={loading}>Login</Button>
            <p><Link href="/passwordReset" target="_blank">Forgot password?</Link></p>
        </form>
    )
}