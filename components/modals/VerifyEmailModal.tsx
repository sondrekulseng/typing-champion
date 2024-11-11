import { auth } from "@/firebase.config";
import { Alert, Button, Loader, Modal } from "@mantine/core";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSendEmailVerification } from "react-firebase-hooks/auth";

type Props = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    email: string
}

let EMAIL_SENT = false;

export default function VerifyEmailModal({ open, setOpen, email }: Readonly<Props>) {

    const [verificationLoading, setVerifcationLoading] = useState(false);
    const [verificationError, setVerificationError] = useState(false);
    const [sendEmailVerification, sending, error] = useSendEmailVerification(auth);

    useEffect(() => {
        if (!EMAIL_SENT && open) {
            sendEmailVerification()
            EMAIL_SENT = true
        }
    }, [open])

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
        } else {
            setVerificationError(true)
        }
        setVerifcationLoading(false)
    }

    async function closeAndSignOut() {
        await auth.signOut();
        setVerificationError(false);
        setVerifcationLoading(false);
        setOpen(false);
    }

    return (
        <Modal opened={open} onClose={closeAndSignOut} closeOnClickOutside={false} title="Email verification" size="lg" overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}>
            <h3>Check your email</h3>
            {sending
                ? <div style={{ display: "flex", alignItems: "center" }}>
                    <Loader color="blue" size={'sm'} />
                    <span style={{ marginLeft: "0.5em" }}>Sending verification email</span>
                </div>
                : ""
            }
            {!error && !sending
                ? (
                    <>
                        <p>A verificaiton link was sent to: <strong>{email}</strong><br />
                            Make sure to check your spam folder.
                        </p>
                        <Button onClick={verify} loading={verificationLoading}>I have verified my email</Button>
                    </>
                ) : ""
            }
            {error
                ? (<>
                    <Alert variant="light" color="red" title="Error sending email" style={{ marginBlock: '1em' }}>
                        An error occured while sending verificaiton email. Please try again.
                    </Alert>
                    <Button onClick={sendEmailVerification}>Retry</Button>
                </>)
                : ""
            }
            {verificationError
                ? (<>
                    <Alert variant="light" color="red" title="Not verified" style={{ marginTop: '1em' }}>
                        Email not verified. Please click the link in your email.
                    </Alert>
                </>)
                : ""
            }
        </Modal>
    )
}