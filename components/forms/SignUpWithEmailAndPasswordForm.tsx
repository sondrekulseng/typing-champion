import { auth } from "@/firebase.config";
import ErrorUtils from "@/utils/errorUtils";
import { Alert, Button, PasswordInput, TextInput } from "@mantine/core";
import { FormEvent, useEffect, useState } from "react";
import { useCreateUserWithEmailAndPassword, useUpdateProfile } from "react-firebase-hooks/auth";

export default function SignUpWithEmailAndPasswordForm() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [showPasswordErrorAlert, setShowPasswordErrorAlert] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [showFirebaseAuthError, setShowFirebaseAuthError] = useState(false);
    const [showUsernameFormatError, setShowUsernameFormatError] = useState(false);
    const [updateProfile, updating, errorUpdate] = useUpdateProfile(auth);
    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error
    ] = useCreateUserWithEmailAndPassword(auth);

    useEffect(() => {
        if (error != undefined) {
            setShowFirebaseAuthError(true)
        }
    }, [error]);

    async function handleSignUp(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        const user = await createUserWithEmailAndPassword(email, password);
        if (user) {
            await updateProfile({ displayName: username })
        }
    }

    function verifyPassword(passInput: string, passInputConfirm: string) {
        if (passInput != passInputConfirm) {
            setShowPasswordErrorAlert(true)
            setSubmitButtonDisabled(true)
            setSubmitButtonDisabled(true)
        } else {
            setShowPasswordErrorAlert(false)
            setSubmitButtonDisabled(false)
            setSubmitButtonDisabled(false)
        }
    }

    function verifyUsername(usernameInput: string) {
        if (usernameInput.includes(" ")) {
            setShowUsernameFormatError(true)
            setSubmitButtonDisabled(true)
        } else {
            setShowUsernameFormatError(false)
            setSubmitButtonDisabled(false)
            setUsername(usernameInput)
        }
    }

    return (
        <form onSubmit={handleSignUp}>
            <TextInput placeholder="MyAwesomeUsername" label="Username (will be public)" onChange={e =>
                setUsername(() => {
                    verifyUsername(e.target.value)
                    return e.target.value
                })
            } required />
            {showUsernameFormatError
                ? <Alert variant="light" color="red" title="Error" style={{ marginBottom: '1em', marginTop: '1em' }}>
                    <strong>Username cannot contain spaces</strong>
                </Alert>
                : ""
            }
            <TextInput placeholder="example@mail.com" label="Email" onChange={e => setEmail(e.target.value)} required />
            <PasswordInput placeholder="*******" label="Password" onChange={e => {
                setPassword(() => {
                    verifyPassword(e.target.value, passwordConfirm)
                    return e.target.value
                })
            }} required />
            <PasswordInput placeholder="*******" label="Confirm password" onChange={e => {
                setPasswordConfirm(() => {
                    verifyPassword(password, e.target.value)
                    return e.target.value
                })
            }} required />
            <br />
            {showPasswordErrorAlert
                ? <Alert variant="light" color="red" title="Error" style={{ marginBottom: '1em' }}>
                    <strong>Passwords do not match</strong>
                </Alert>
                : ""
            }
            {showFirebaseAuthError && error
                ? <Alert variant="light" color="red" title="Signup error" style={{ marginBottom: '1em' }}>
                    <strong>{ErrorUtils.parseError(error.message)}</strong>
                </Alert>
                : ""
            }
            <Button type='submit' loading={loading} disabled={submitButtonDisabled}>Sign up</Button>
        </form>
    )
}
