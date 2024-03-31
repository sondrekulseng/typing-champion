"use client"

import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from "/firebase.config"
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import React from 'react'
import { Skeleton, Table, TableColumn } from '@mantine/core'
import { useState } from 'react'

type Props = {
	textId: string,
	userEmail: string | undefined
}
export default function Scores(props: Props) {

	const [scores, setScores] = useState([]);
	const [snapshot, loading, error] = useCollection(
		query(
			collection(db, 'scores'), 
			where("textId", "==", props.textId),
			orderBy("wpm", "desc"),
			limit(10)
		)
	);

	if (snapshot) {
		const rows = snapshot.docs.map((doc) => (
    		<Table.Tr key={doc.id}>
      			<Table.Td>{doc.data().userEmail}</Table.Td>
      			<Table.Td>{doc.data().wpm}</Table.Td>
      			<Table.Td>{doc.data().accuracy}%</Table.Td>
    		</Table.Tr>
  		));
		return (
			<div style={{float: 'right', width: '25%'}}>
			<h1>Scores</h1>
			<Table>
      			<Table.Thead>
        			<Table.Tr>
          				<Table.Th>User</Table.Th>
          				<Table.Th>WPM</Table.Th>
          				<Table.Th>Accuracy</Table.Th>
        			</Table.Tr>
      			</Table.Thead>
      			<Table.Tbody>{rows}</Table.Tbody>
    		</Table>
		</div>
		)
	}

	if (error) {
		console.log(error.message)
	}

	return (
		<div style={{float: 'right', width: '25%'}}>
		</div>
	)
}