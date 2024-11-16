import { auth } from "@/firebase.config";
import { Button, Alert } from "@mantine/core";
import { useSignInWithGithub } from "react-firebase-hooks/auth";
import Styles from './GitHub.module.css'
import { GithubIcon } from '@mantinex/dev-icons';
import ErrorUtils from "@/utils/errorUtils";

export default function SignInWithGitHubButton() {
    const [signInWithGitHub, user, loading, error] = useSignInWithGithub(auth);

    return (
        <>
            <Button
                onClick={() => signInWithGitHub()}
                loading={loading}
                leftSection={<GithubIcon style={{ width: '1rem', height: '1rem' }} />}
                className={Styles.githubButton}
                variant="default"
            >
                Continue with GitHub
            </Button>
            {error
                ? <Alert variant="light" color="red" title="GitHub login error" style={{ marginTop: '1em' }}>
                    <strong>{ErrorUtils.parseError(error.message, "Google")}</strong>
                </Alert >
                : ""
            }
        </>
    )
}