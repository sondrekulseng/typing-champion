'use client'

import { useDocument } from 'react-firebase-hooks/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc } from 'firebase/firestore';
import { auth, db } from "../../../firebase.config"
import TypingGame from '@/components/TypingGame';
import TextData from '../../../models/TextData';
import ScoreTable from '@/components/tables/ScoreTable';
import SignOutButton from '@/components/buttons/SignOutButton';
import SignUpModal from '@/components/modals/SignUpModal';
import LoginModal from '@/components/modals/LoginModal';
import { Alert, Button, Paper } from '@mantine/core';
import { useEffect, useState } from 'react';
import VerifyEmailModal from '@/components/modals/VerifyEmailModal';

type Props = {
    params: { textId: string }
}

export default function Page({ params }: Readonly<Props>) {

    const [user, userLoad, userError] = useAuthState(auth)
    const [userEmail, setUserEmail] = useState("")

    const [openLoginModal, setOpenLoginModal] = useState(false)
    const [openSignUpModal, setOpenSignUpModal] = useState(false)
    const [openVerifyEmailModal, setOpenVerifyEmailModal] = useState(false)

    useEffect(() => {
        if (user == undefined || user == null) {
            setOpenVerifyEmailModal(false)
            return
        }

        if (user.email != null) {
            setUserEmail(user.email)
            setOpenLoginModal(false)
            setOpenSignUpModal(false)
        }

        if (!user.emailVerified) {
            setOpenVerifyEmailModal(true)
        }
    }, [user])

    const [document, loading, error] = useDocument(
        doc(db, 'texts', params.textId)
    );


    if (loading) {
        return <h3>Loading game...</h3>
    }

    if (error) {
        return <h3>An error occured. Try refreshing the page.</h3>
    }

    if (document) {
        if (document.data() == undefined) {
            return <h3>Invalid textId</h3>
        }

        const textData = new TextData(
            document.id,
            document.data()?.title,
            document.data()?.content
        );

        return (
            <>
                <div style={{ float: 'left', width: '70%' }}>
                    <h3>Ready to race! Type the text below:</h3>
                    <Paper withBorder={true} style={{ padding: '1em' }}>
                        <TypingGame textData={textData} user={user} />
                    </Paper>
                </div>
                <div style={{ float: 'right', width: '25%' }}>
                    <h3>Leaderboard</h3>
                    <ScoreTable textId={textData.id} user={user} />
                    {user
                        ? (
                            <>
                                <Alert variant="light" color="green" title="Logged in" style={{ marginTop: '1em', marginBottom: '1em' }}>
                                    Email: {userEmail}
                                </Alert>
                                <SignOutButton />
                            </>
                        )
                        : (
                            <div style={{ marginTop: '1em' }}>
                                <Button onClick={() => setOpenLoginModal(true)}>Login</Button> |
                                <Button onClick={() => setOpenSignUpModal(true)}>Sign up</Button>
                            </div>
                        )
                    }
                    <LoginModal open={openLoginModal} setOpen={setOpenLoginModal} />
                    <SignUpModal open={openSignUpModal} setOpen={setOpenSignUpModal} />
                    <VerifyEmailModal
                        open={openVerifyEmailModal}
                        setOpen={setOpenVerifyEmailModal}
                        email={userEmail}
                    />
                </div>
            </>
        )
    }
}
