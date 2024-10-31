import { auth } from "@/firebase.config";
import { Alert, Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useSendEmailVerification } from "react-firebase-hooks/auth";

type Props = {
    email: string
}
export default function EmailVerification({ email }: Readonly<Props>) {

    const [opened, { close }] = useDisclosure(true);
    const [emailSent, setEmailSent] = useState(false);
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

        const emailVerified = auth.currentUser.emailVerified;

        if (emailVerified) {
            setVerificationError(false)
            console.log("Email verified")
            close()
        } else {
            setVerificationError(true)
        }
    }

    async function closeAndSignOut() {
        await auth.signOut();
        close()
    }

    return (
        <>
            <Modal opened={opened} onClose={closeAndSignOut} title="Email verification" size="lg" overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}>
                <h3>Please verify your email</h3>
                <p>Click the button below to send a verification link to: {email}</p>
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
                        <Button onClick={verify}>I have clicked the link</Button>
                    </>)
                    : <Button onClick={sendVerificationLink} loading={sending}>Send verifcation link</Button>
                }
            </Modal>
        </>
    )
}