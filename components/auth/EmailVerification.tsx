import { auth } from "@/firebase.config";
import { Alert, Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useSendEmailVerification } from "react-firebase-hooks/auth";

type Props = {
    email: string
}
export default function EmailVerification({ email }: Readonly<Props>) {

    const [emailSent, setEmailSent] = useState(false)
    const [sendEmailVerification, sending, error] = useSendEmailVerification(
        auth
    );

    async function sendVerificationLink() {
        const linkSent = await sendEmailVerification();
        if (linkSent) {
            setEmailSent(linkSent)
        }
    }

    const handleClose = () => {
        auth.signOut();
        close();
    };

    const [opened, { open, close }] = useDisclosure(true);
    return (
        <>
            <Modal opened={opened} onClose={handleClose} title="Email verification" size="lg" overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}>
                <h3>Please verify your email</h3>
                <p>Click the button below to send a verification link to: {email}</p>
                {emailSent
                    ? (<>
                        <Alert variant="light" color="green" title="Email sent!">
                            Make sure to check your spam folder
                        </Alert>
                        <Button onClick={handleClose}>Close</Button>
                    </>)
                    : <Button onClick={sendVerificationLink} loading={sending}>Send verifcation link</Button>
                }
            </Modal>
        </>
    )
}