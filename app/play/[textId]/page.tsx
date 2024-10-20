'use client'

import { useDocument } from 'react-firebase-hooks/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc } from 'firebase/firestore';
import { auth, db } from "../../../firebase.config"
import TypingGame from '@/components/TypingGame';
import TextData from '../../../models/TextData';
import ScoreTable from '@/components/ScoreTable';
import SignOutButton from '@/components/auth/SignOutButton';
import SignUpForm from '@/components/auth/SignUpForm';
import LoginForm from '@/components/auth/LoginForm';
import { Paper } from '@mantine/core';

type Props = {
    params: { textId: string }
}

export default function Page({ params }: Readonly<Props>) {

    const [document, loading, error] = useDocument(
        doc(db, 'texts', params.textId)
    );

    const [user, userLoad, userError] = useAuthState(auth)

    if (loading) {
        return <h3>Loading game...</h3>
    }

    if (error) {
        return error.message
    }

    if (document) {
        if (document.data() == undefined) {
            return <h3>Invalid textId</h3>
        }

        const textData = new TextData(
            document.id,
            document.data().title,
            document.data().content
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
                    {user && user.emailVerified
                        ? (<><p><strong>Hello {user.displayName}!</strong></p> <SignOutButton /></>)
                        : (<>
                            <br />
                            <LoginForm /> / <SignUpForm />
                        </>
                        )
                    }
                </div>
            </>
        )
    }
}
