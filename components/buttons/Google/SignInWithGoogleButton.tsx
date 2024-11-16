import { auth } from "@/firebase.config";
import { Alert, Button } from "@mantine/core";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { GoogleIcon } from "./GoogleIcon";

export default function SignInWithGoogleButton() {
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

    return (
        <>
            <Button
                onClick={() => signInWithGoogle()}
                loading={loading}
                leftSection={<GoogleIcon />}
                variant="default"
                style={{ width: '100%' }}
            >
                Continue with Google
            </Button>
            {error
                ? <Alert variant="light" color="red" title="Authentication error" style={{ marginTop: '1em' }}>
                    <strong>Error occured while signing in with Google. Please try again.</strong>
                </Alert >
                : ""
            }
        </>
    )
}