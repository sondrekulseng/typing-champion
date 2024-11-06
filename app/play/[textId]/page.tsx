'use client'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from "../../../firebase.config"
import TypingGame from '@/components/TypingGame';
import TextData from '../../../models/TextData';
import ScoreTable from '@/components/tables/ScoreTable';
import { Paper } from '@mantine/core';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';

type Props = {
    params: { textId: string }
}

export default function Page({ params }: Readonly<Props>) {

    const [user] = useAuthState(auth) 

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
            <div style={{ marginTop: '3em' }}>
                <div style={{ float: 'left', width: '70%' }}>
                    <h2>Type the paragraph below:</h2>
                    <Paper withBorder={true} style={{ padding: '1em' }}>
                        <TypingGame textData={textData} user={user} />
                    </Paper>
                </div>
                <div style={{ float: 'right', width: '25%' }}>
                    <h2>Leaderboard</h2>
                    <ScoreTable textId={textData.id} user={user} />
                </div>
            </div>
        )
    }
}
