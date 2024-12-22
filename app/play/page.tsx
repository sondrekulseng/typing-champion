'use client'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from "../../firebase.config"
import TypingGame from '@/components/custom/TypingGame';
import { Alert, Loader, Paper, Switch } from '@mantine/core';
import { collection, documentId, getCountFromServer, getDocs, limit, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import PersonalHighscoreBanner from '@/components/banners/PersonalHighscoreBanner';
import SelectTimeLimit from '@/components/selects/SelectTextLength';
import { TimeLimit } from '@/enums/TimeLimit';
import TimeLimitParser from '@/utils/TimeLimitParser';

export default function Page() {

    const [user] = useAuthState(auth)
    const [textContent, setTextContent] = useState("")
    const [loading, setLoading] = useState(true)
    const [timeLimit, setTimeLimit] = useState(TimeLimit.PRACTICE)
    const [showTimer, setShowTimer] = useState(true)

    useEffect(() => {
        setLoading(true)
        const timeLimitFormatted = timeLimit.replace(" ", "-").toLowerCase()
        const textsByLength = query(
            collection(db, 'texts'),
            where(documentId(), '>=', timeLimitFormatted),
            where(documentId(), '<', timeLimitFormatted + '~')
        )
        getCountFromServer(textsByLength)
            .then(result => Math.floor(Math.random() * (result.data().count)))
            .then(randomIndex => {
                getDocs(
                    query(
                        textsByLength,
                        where(documentId(), '==', TimeLimitParser.parseToDbKey(timeLimit, randomIndex)),
                        limit(1)
                    ))
                    .then(result => {
                        if (result.docs.length == 0) {
                            setLoading(false)
                            setTextContent("")
                            return
                        }
                        const document = result.docs.at(0)
                        setTextContent(document?.data().content)
                        setLoading(false);
                    })
            })
    }, [timeLimit])

    return (
        <div style={{ marginTop: '3em' }}>
            <SelectTimeLimit defaultTime={timeLimit} setTimeLimit={setTimeLimit} />
            <Switch
                defaultChecked
                label="Show timer"
                onChange={event => setShowTimer(event.currentTarget.checked)}
                style={{ marginTop: '1em' }}
            />
            {timeLimit != TimeLimit.PRACTICE
                ? <h3>You have {timeLimit} to type as much as possible:</h3>
                : <h3>Practice mode! Results do not count towards the leaderboard</h3>
            }
            <Paper withBorder={true} style={{ padding: '1em', marginTop: '1em' }}>
                {loading
                    ? <Loader color="blue" />
                    : textContent
                        ? <TypingGame
                            textContent={textContent}
                            timeLimit={TimeLimitParser.parseToSeconds(timeLimit)}
                            showTimer={showTimer}
                            user={user}
                        />
                        : "Error fetching textdata! Try another category"
                }
            </Paper>
            {timeLimit != TimeLimit.PRACTICE
                ? user
                    ? <PersonalHighscoreBanner timeLimit={timeLimit} uid={user.uid} />
                    : (
                        <Alert variant="light" color="blue" title="Not logged in" style={{ marginTop: '1em' }}>
                            <h3>Login or sign up to submit your highscore</h3>
                        </Alert>
                    )
                : ""
            }
        </div>
    )

}
