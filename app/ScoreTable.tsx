"use client"

import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from "/firebase.config"
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import firebase from "firebase/app"
import { Skeleton, Table, TableColumn, Alert, Checkbox } from '@mantine/core'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Props = {
	textId: string,
	user: Firebase.User | undefined
}
export default function ScoreTable(props: Props) {

	const [showPersonalScores, setShowPersonalScores] = useState(false);
	const [scores, setScores] = useState([]);
	const [scoreQuery, setScoreQuery] = useState(
		query(
			collection(db, 'scores'),
			where("textId", "==", props.textId),
			orderBy("wpm", "desc"),
			limit(10)
		)
	)
	const [snapshot, loading, error] = useCollection(scoreQuery);

	useEffect(() => {
		if (showPersonalScores) {
			setScoreQuery(
				query(
					collection(db, 'scores'),
					where("textId", "==", props.textId),
					where("userId", "==", props.user.uid),
					orderBy("wpm", "desc"),
					limit(10)
				)
			)
		} else {
			setScoreQuery(
				query(
					collection(db, 'scores'),
					where("textId", "==", props.textId),
					orderBy("wpm", "desc"),
					limit(10)
				)
			)
		}
	}, [showPersonalScores, props])

	if (loading) {
		return <p>Loading scores...</p>
	}

	if (error) {
		return <Alert variant="light" color="red" title="Error loading scores">An error occured while fetching scores. Try again later</Alert>
	}

	if (snapshot) {
		const rows = snapshot.docs.map((doc, index) => (
    		<Table.Tr key={doc.id}>
    			<Table.Td>{index + 1}</Table.Td>
      			<Table.Td>{doc.data().displayName}</Table.Td>
      			<Table.Td>{doc.data().wpm}</Table.Td>
      			<Table.Td>{doc.data().accuracy}%</Table.Td>
    		</Table.Tr>
  		));

		return (
			<>
			<Table style={{marginBottom: '1em'}}>
      			<Table.Thead>
        			<Table.Tr>
        				<Table.Th>#</Table.Th>
          				<Table.Th>User</Table.Th>
          				<Table.Th>WPM</Table.Th>
          				<Table.Th>Accuracy</Table.Th>
        			</Table.Tr>
      			</Table.Thead>
      			<Table.Tbody>{rows}</Table.Tbody>
    		</Table>
    		{props.user == undefined
    			? <Alert variant="light" color="blue" title="Not logged in">
                	Login to submit scores
            </Alert>
          : <Checkbox label="Show personal highscore" checked={showPersonalScores} onChange={evt => setShowPersonalScores(evt.currentTarget.checked)} />
          	}
          	</>
		)
	}


}
