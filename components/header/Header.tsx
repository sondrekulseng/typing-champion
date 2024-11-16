import {
    Group,
    Button,
    Divider,
    Box,
    Burger,
    Text,
    Drawer,
    ScrollArea,
    rem,
    Avatar,
    Menu,
    UnstyledButton,
} from '@mantine/core';
import {
    IconSettings,
    IconChevronDown,
    IconMail,
    IconHelp,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';
import { useEffect, useState } from 'react';
import LoginModal from '../modals/LoginModal';
import SignUpModal from '../modals/SignUpModal';
import VerifyEmailModal from '../modals/VerifyEmailModal';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthState, useUpdateProfile } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase.config';
import SignOutButton from '../buttons/SignOutButton';

export default function Header() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const [openLoginModal, setOpenLoginModal] = useState(false)
    const [openSignUpModal, setOpenSignUpModal] = useState(false)
    const [openVerifyEmailModal, setOpenVerifyEmailModal] = useState(false)
    const [openCreateUsernameModal, setOpenCreateUsernameModal] = useState(false)
    const [userEmail, setUserEmail] = useState("")
    const pathname = usePathname()
    const [user, loading, error] = useAuthState(auth)
    const [updateProfile, updating, errorUpdate] = useUpdateProfile(auth);
    const [providerId, setProviderId] = useState("")

    useEffect(() => {
        if (user == undefined || user == null) {
            setOpenVerifyEmailModal(false)
            return
        }

        if (user.email != null) {
            setUserEmail(user.email)
            setOpenLoginModal(false)
            setOpenSignUpModal(false)
        }

        if (!user.emailVerified) {
            setOpenVerifyEmailModal(true)
            return
        }

        setProviderId(user.providerData[0] != null
            ? user.providerData[0].providerId
            : "unknown"
        )

        user.reload().then(() => {
            if (user.displayName == null) {
                console.error("No display name exists on user!")
                return
            }
            if (user.displayName.includes(" ")) {
                const firstname = user.displayName.split(' ')[0]
                updateProfile({ displayName: firstname })
                    .then(() => user.reload().then().catch(() => console.error("Error reloading user data")))
                    .catch(() => console.error("Error updating displayName"))
            }
        })
    }, [user])

    return (
        <>
            <Box pb={30}>
                <header className={classes.header}>
                    <Group justify="space-between">
                        <Link href="/"><h2>Typing champion ✍️</h2></Link>
                        <Group gap={0} visibleFrom="sm">
                            <Link href="/play/start" className={classes.link} style={pathname.includes('/play') ? { textDecoration: 'underline' } : {}}>
                                <h3>Play</h3>
                            </Link>
                            <Link href="/leaderboard" className={classes.link} style={pathname.includes('/leaderboard') ? { textDecoration: 'underline' } : {}}>
                                <h3>Leaderboard</h3>
                            </Link>
                            <Link href="/passwordReset" className={classes.link} style={pathname.includes('/passwordReset') ? { textDecoration: 'underline' } : {}}>
                                <h3>Reset password</h3>
                            </Link>
                        </Group>
                        <Group visibleFrom="sm">
                            {user
                                ? (
                                    <>
                                        <Menu
                                            width={260}
                                            position="bottom-end"
                                            transitionProps={{ transition: 'pop-top-right' }}
                                            withinPortal
                                        >
                                            <Menu.Target>
                                                <UnstyledButton>
                                                    <Group gap={7}>
                                                        <Avatar src={user.photoURL ? user.photoURL : '/avatar.png'} radius="xl" size={35} />
                                                        <Text fw={500} size="lg" lh={1} mr={3}>
                                                            {user.displayName}
                                                        </Text>
                                                        <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                                                    </Group>
                                                </UnstyledButton>
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                <Menu.Label>Info</Menu.Label>
                                                <Menu.Item
                                                    leftSection={
                                                        <IconMail style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                                                    }
                                                >
                                                    {user.email}
                                                </Menu.Item>
                                                <Menu.Label>Actions</Menu.Label>
                                                {user.uid == 'vjSuDunjAAhOsySLIQlyjiHc0Co1'
                                                    ? <Link href="/admin">
                                                        <Menu.Item
                                                            leftSection={
                                                                <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                                                            }
                                                        >
                                                            Admin panel
                                                        </Menu.Item>
                                                    </Link>
                                                    : ""
                                                }
                                                {providerId == 'password'
                                                    ? <Link href="/passwordReset">
                                                        <Menu.Item
                                                            leftSection={
                                                                <IconHelp style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                                                            }
                                                        >
                                                            Reset password
                                                        </Menu.Item>
                                                    </Link>
                                                    : ""
                                                }
                                                <SignOutButton />
                                            </Menu.Dropdown>
                                        </Menu>
                                    </>
                                )
                                : (
                                    <>
                                        <Button onClick={() => setOpenLoginModal(true)} variant='default'>Login</Button>
                                        <Button onClick={() => setOpenSignUpModal(true)}>Sign up</Button>
                                    </>
                                )
                            }
                        </Group>
                        <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
                    </Group>
                </header>

                <Drawer
                    opened={drawerOpened}
                    onClose={closeDrawer}
                    size="100%"
                    padding="md"
                    title="Navigation"
                    hiddenFrom="sm"
                    zIndex={1000000}
                >
                    <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
                        <Divider my="sm" />
                        <a href="/play/start" className={classes.link}>
                            <h3>Play</h3>
                        </a>
                        <a href="/leaderboard" className={classes.link}>
                            <h3>Leaderboard</h3>
                        </a>
                        <a href="/passwordReset" className={classes.link} >
                            <h3>Reset password</h3>
                        </a>
                        <Divider my="sm" />
                        <Group justify="center" grow pb="xl" px="md">
                            {user
                                ? "Logged in"
                                : <Button onClick={() => setOpenLoginModal(true)} variant='default'>Login</Button>
                            }
                            <Button onClick={() => setOpenSignUpModal(true)}>Sign up</Button>
                        </Group>
                    </ScrollArea>
                </Drawer>
            </Box >
            <LoginModal open={openLoginModal} setOpen={setOpenLoginModal} />
            <SignUpModal open={openSignUpModal} setOpen={setOpenSignUpModal} />
            <VerifyEmailModal
                open={openVerifyEmailModal}
                setOpen={setOpenVerifyEmailModal}
                email={userEmail}
            />
        </>
    );
}