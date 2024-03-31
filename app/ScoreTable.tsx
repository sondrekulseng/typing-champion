"use client"

import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from "/firebase.config"
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import React from 'react'
import { Skeleton, Table, TableColumn, Alert } from '@mantine/core'
import { useState } from 'react'
import Link from 'next/link'

type Props = {
	textId: string,
	userEmail: string | undefined
}
export default function ScoreTable(props: Props) {

	const [scores, setScores] = useState([]);
	const [snapshot, loading, error] = useCollection(
		query(
			collection(db, 'scores'), 
			where("textId", "==", props.textId),
			orderBy("wpm", "desc"),
			limit(10)
		)
	);

	if (props.userEmail == undefined) {
		return <Alert variant="light" color="blue" title="Not logged in">
			<Link href="/login">Login</Link> or <Link href="/signup">sign up</Link> to view and submit scores</Alert>
	}

	if (loading) {
		return <p>Loading scores...</p>
	}

	if (snapshot) {
		const rows = snapshot.docs.map((doc, index) => (
    		<Table.Tr key={doc.id}>
    			<Table.Td>{index + 1}</Table.Td>
      			<Table.Td>{doc.data().userEmail}</Table.Td>
      			<Table.Td>{doc.data().wpm}</Table.Td>
      			<Table.Td>{doc.data().accuracy}%</Table.Td>
    		</Table.Tr>
  		));
		return (
			<Table>
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