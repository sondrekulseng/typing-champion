"use client"

import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from "../../firebase.config"
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Table, Alert, Checkbox } from '@mantine/core'
import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import TimeLimitParser from '@/utils/TimeLimitParser';
import { TimeLimit } from '@/enums/TimeLimit';

type Props = {
	timeLimit: TimeLimit
}
export default function ScoreTable({ timeLimit }: Readonly<Props>) {

	const RESULT_LIMIT = 20
	const [uid, setUid] = useState("")
	const [user, userLoading, userError] = useAuthState(auth)
	const [showPersonalScores, setShowPersonalScores] = useState(false);
	const [scoreQuery, setScoreQuery] = useState(
		query(
			collection(db, 'scores'),
			orderBy("wpm", "desc"),
			limit(RESULT_LIMIT)
		)
	)
	const [snapshot, loading, error] = useCollection(scoreQuery);

	useEffect(() => {
		if (user) {
			setUid(user.uid)
		} else {
			setUid("")
		}
		if (showPersonalScores) {
			setScoreQuery(
				query(
					collection(db, 'scores'),
					where('timeLimit', '==', TimeLimitParser.parseToSeconds(timeLimit)),
					where("uid", "==", uid),
					orderBy("wpm", "desc"),
					limit(RESULT_LIMIT)
				)
			)
		} else {
			setScoreQuery(
				query(
					collection(db, 'scores'),
					where('timeLimit', '==', TimeLimitParser.parseToSeconds(timeLimit)),
					orderBy("wpm", "desc"),
					limit(RESULT_LIMIT)
				)
			)
		}
	}, [showPersonalScores, user, timeLimit])

	if (loading || userLoading) {
		return <p>Loading scores...</p>
	}

	if (error || userError) {
		console.log(error)
		return <Alert variant="light" color="red" title="Error loading scores">An error occured. Please try again later</Alert>
	}

	if (snapshot) {
		if (snapshot.docs.length == 0 && !showPersonalScores) {
			return <Alert variant="light" color="blue" title="No scores yet">
				The leaderboard is empty. Be the first!
			</Alert>
		}
		const rows = snapshot.docs.map((doc, index) => (
			<Table.Tr key={doc.id} style={doc.data().uid == uid ? { fontWeight: 'bold' } : {}}>
				<Table.Td>{index + 1}</Table.Td>
				<Table.Td>{doc.data().displayName}</Table.Td>
				<Table.Td>{doc.data().uid}</Table.Td>
				<Table.Td>{doc.data().wpm} WPM</Table.Td>
				<Table.Td>{doc.data().timestamp}</Table.Td>
			</Table.Tr >
		));

		return (
			<>
				{user == undefined
					? ""
					: (
						<>
							{snapshot.docs.at(0)?.data().uid == user.uid && !showPersonalScores
								? <Alert variant="light" color="green" title="Congratulations!" style={{ marginBottom: '1em' }}>
									You are the champion in this category! Here is your crown 👑
								</Alert>
								: ""
							}
							<Checkbox
								label="Only show personal highscore"
								checked={showPersonalScores}
								onChange={evt => setShowPersonalScores(evt.currentTarget.checked)}
							/>
						</>
					)
				}
				<Table style={{ marginBottom: '1em' }}>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>#</Table.Th>
							<Table.Th>Username</Table.Th>
							<Table.Th>UID</Table.Th>
							<Table.Th>Speed</Table.Th>
							<Table.Th>Date</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>{rows}</Table.Tbody>
				</Table>
			</>
		)
	}
}
