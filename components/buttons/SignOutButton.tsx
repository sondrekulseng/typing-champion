import { useSignOut } from 'react-firebase-hooks/auth';
import { Button } from '@mantine/core'
import { auth } from "../../firebase.config"

export default function SignOutButton() {

	const [signOut, loading, error] = useSignOut(auth);

	if (error) {
		alert("Error signing out!")
	}

	return (
		<Button loading={loading} onClick={signOut} variant='default'>
			Sign out
		</Button>
	)
}
