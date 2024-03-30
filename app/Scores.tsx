import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from "/firebase.config"
import { collection, query, where } from 'firebase/firestore';
import React from 'react'
import { Skeleton } from '@mantine/core'

type Props = {
	textId: string
}
export default function Scores(props: Props) {

	const [user, userLoad, userError] = useAuthState(auth)
	const [snapshot, loading, error] = useCollection(
		query(
			collection(db, 'scores'), 
			where("textId", "==", props.textId)
		)
	);

	if (snapshot) {
		snapshot.forEach(doc => console.log("WPM: " + doc.data().wpm))
	}

	if (error || userError) {
		console.log(error.message)
	}

	return (
		<div style={{float: 'right', width: '25%'}}>
			<h1>Scores</h1>
			{user ? "" : "Login to view scores"}
		</div>
	)
}