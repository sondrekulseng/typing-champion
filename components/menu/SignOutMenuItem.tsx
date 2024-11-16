import { useSignOut } from 'react-firebase-hooks/auth';
import { Menu, rem } from '@mantine/core'
import { auth } from "../../firebase.config"
import { IconLogout } from '@tabler/icons-react';

export default function SignOutMenuItem() {

	const [signOut, loading, error] = useSignOut(auth);

	if (error) {
		alert("Error signing out!")
	}

	return (
		<Menu.Item
			onClick={signOut}
			leftSection={
				<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
			}
		>
			Sign out
		</Menu.Item>
	)
}
