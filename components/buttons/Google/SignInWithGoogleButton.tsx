import { auth } from "@/firebase.config";
import { Alert, Button } from "@mantine/core";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { GoogleIcon } from "./GoogleIcon";
import Styles from "./Google.module.css"
import ErrorUtils from "@/utils/errorUtils";

export default function SignInWithGoogleButton() {
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

    return (
        <>
            <Button
                onClick={() => signInWithGoogle()}
                loading={loading}
                leftSection={<GoogleIcon />}
                className={Styles.googleButton}
                variant="default"
            >
                Continue with Google
            </Button>
            {error
                ? <Alert variant="light" color="red" title="Google login error">
                    <strong>{ErrorUtils.parseError(error.message, "GitHub")}</strong>
                </Alert >
                : ""
            }
        </>
    )
}