'use client'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from "../../firebase.config"
import TypingGame from '@/components/custom/TypingGame';
import TextData from '../../models/TextData';
import { Alert, Paper } from '@mantine/core';
import { collection, documentId, getCountFromServer, getDocs, limit, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import PersonalHighscoreBanner from '@/components/banners/PersonalHighscoreBanner';
import SelectTextLength from '@/components/selects/SelectTextLength';
import { TextLength } from '@/enums/TextLength';

export default function Page() {

    const [user] = useAuthState(auth)
    const [textData, setTextData] = useState<TextData>()
    const [loading, setLoading] = useState(true)
    const [lengthCategory, setLengthCategory] = useState(TextLength.SHORT)

    useEffect(() => {
        setLoading(true)
        const textsByLength = query(
            collection(db, 'texts'),
            where(documentId(), '>=', lengthCategory.toLowerCase()),
            where(documentId(), '<', lengthCategory.toLowerCase() + '~')
        )
        getCountFromServer(textsByLength)
            .then(result => Math.floor(Math.random() * (result.data().count)))
            .then(randomIndex => {
                getDocs(
                    query(
                        textsByLength,
                        where(documentId(), '==', lengthCategory.toLowerCase() + "-" + randomIndex),
                        limit(1)
                    ))
                    .then(result => {
                        if (result.docs.length == 0) {
                            setLoading(false)
                            return
                        }
                        const document = result.docs.at(0)

                        setTextData(
                            new TextData(
                                document?.data().title,
                                document?.data().content
                            )
                        )
                        setLoading(false);
                    })
            })
    }, [lengthCategory])

    return (
        <div style={{ marginTop: '3em' }}>
            <SelectTextLength setLength={setLengthCategory}></SelectTextLength>
            <Paper withBorder={true} style={{ padding: '1em', marginTop: '1em' }}>
                {loading
                    ? "Loading..."
                    : textData ? <TypingGame textData={textData} length={lengthCategory.toLowerCase()} user={user} /> : "Error fetching textdata! Try another category"
                }
            </Paper>
            {user
                ? <PersonalHighscoreBanner length={lengthCategory} uid={user.uid} />
                : <Alert variant="light" color="blue" title="Not logged in" style={{ marginTop: '1em' }}>
                    <h3>Login or sign up to submit your highscore</h3>
                </Alert>
            }
        </div>
    )

}
