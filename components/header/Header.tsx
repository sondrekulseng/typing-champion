import {
    Group,
    Button,
    Divider,
    Box,
    Burger,
    Drawer,
    ScrollArea,
    rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';
import { useEffect, useState } from 'react';
import LoginModal from '../modals/LoginModal';
import SignUpModal from '../modals/SignUpModal';
import VerifyEmailModal from '../modals/VerifyEmailModal';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase.config';
import SignOutButton from '../buttons/SignOutButton';

export default function Header() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const [openLoginModal, setOpenLoginModal] = useState(false)
    const [openSignUpModal, setOpenSignUpModal] = useState(false)
    const [openVerifyEmailModal, setOpenVerifyEmailModal] = useState(false)
    const [userEmail, setUserEmail] = useState("")
    const pathname = usePathname()
    const [user, loading, error] = useAuthState(auth)

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
        }
    }, [user])

    return (
        <>
            <Box pb={30}>
                <header className={classes.header}>
                    <Group justify="space-between">
                        <Link href="/" style={{ color: 'white' }}><h2>Typing champion ✍️</h2></Link>
                        <Group gap={0} visibleFrom="sm">
                            <Link href="/play/start" className={classes.link} style={pathname.includes('/play') ? { fontWeight: 'bold', textDecoration: 'underline' } : {}}>
                                Play
                            </Link>
                            <Link href="/passwordReset" className={classes.link} style={pathname.includes('/passwordReset') ? { fontWeight: 'bold', textDecoration: 'underline' } : {}}>
                                Reset password
                            </Link>
                        </Group>

                        <Group visibleFrom="sm">
                            {user
                                ? (
                                    <>
                                        {user.email}
                                        <SignOutButton />
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

                        <a href="#" className={classes.link}>
                            Home
                        </a>
                        <a href="#" className={classes.link}>
                            Learn
                        </a>
                        <a href="#" className={classes.link}>
                            Academy
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