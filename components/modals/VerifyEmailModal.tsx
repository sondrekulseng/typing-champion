import { auth } from "@/firebase.config";
import { Alert, Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Dispatch, SetStateAction, useState } from "react";
import { useAuthState, useSendEmailVerification } from "react-firebase-hooks/auth";

type Props = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    email: string
}
export default function VerifyEmailModal({ open, setOpen, email }: Readonly<Props>) {

    const [emailSent, setEmailSent] = useState(false);
    const [verificationLoading, setVerifcationLoading] = useState(false);
    const [verificationError, setVerificationError] = useState(false);
    const [sendEmailVerification, sending, error] = useSendEmailVerification(auth);

    async function sendVerificationLink() {
        const linkSent = await sendEmailVerification();
        if (linkSent) {
            setEmailSent(linkSent)
        }
    }

    async function verify() {
        if (auth.currentUser == null) {
            alert("User is not logged!")
            return
        }
        setVerifcationLoading(true)
        await auth.currentUser.reload();
        const emailVerified = auth.currentUser.emailVerified;

        if (emailVerified) {
            setVerificationError(false)
            setOpen(false)
            close()
        } else {
            setVerificationError(true)
        }
        setEmailSent(false);
        setVerifcationLoading(false)
    }

    async function closeAndSignOut() {
        await auth.signOut();
        setOpen(false);
        close();
    }

    return (
        <>
            <Modal opened={open} onClose={closeAndSignOut} title="Email verification" size="lg" overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}>
                <h3>Please verify your email</h3>
                <p>A verification link will be sent to: {email}</p>
                {error
                    ? (<>
                        <Alert variant="light" color="red" title="Could not send email" style={{ marginBottom: '1em' }}>
                            An error occured while sending verificaiton email. Please try again.
                        </Alert>
                    </>)
                    : ""
                }
                {verificationError
                    ? (<>
                        <Alert variant="light" color="red" title="Not verified" style={{ marginBottom: '1em' }}>
                            Email not verified. Please click the link in your email.
                        </Alert>
                    </>)
                    : ""
                }
                {emailSent
                    ? (<>
                        <Alert variant="light" color="green" title="Email sent!" style={{ marginBottom: '1em' }} hidden={verificationError}>
                            Make sure to check your spam folder
                        </Alert>
                        <Button onClick={verify} loading={verificationLoading}>I have clicked the link</Button>
                    </>)
                    : <Button onClick={sendVerificationLink} loading={sending}>Send verifcation link</Button>
                }
            </Modal>
        </>
    )
}