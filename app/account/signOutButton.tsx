import { useSignOut } from 'react-firebase-hooks/auth';
import { Button } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { auth } from "/firebase.config"

export default function SignOutButton() {
	const [signOut, loading, error] = useSignOut(auth);
	const router = useRouter()

	if (error) {
		alert("Error signing out!")
	}

	return (
		<Button 
			loading={loading} 
			onClick={async () => {
				const success = await signOut();
				if (success) {
					router.push("/login")
				}}}
		>Sign out</Button>
	)

}