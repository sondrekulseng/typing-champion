import { auth, db } from "@/firebase.config";
import { Alert, Button } from "@mantine/core";
import { collection, deleteDoc, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { useDeleteUser } from "react-firebase-hooks/auth";

export default function DeleteAccountButton() {
    const [deleteUser, loading, error] = useDeleteUser(auth)
    const [isDeleting, setIsDeleting] = useState(false)

    async function handleDelete() {
        if (auth.currentUser == null) {
            alert("You are not logged in!")
            return
        }
        setIsDeleting(true)
        const q = query(collection(db, "scores"), where('uid', "==", auth.currentUser.uid))
        const snapshot = await getDocs(q)

        if (!snapshot.empty) {
            const doc = snapshot.docs[0].ref
            await deleteDoc(doc);
        }

        await deleteUser()
        setIsDeleting(false)
    }

    return (
        <>
            <Button onClick={handleDelete} loading={isDeleting} color="red">Confirm deletion</Button>
            {error
                ? <Alert variant="light" color="red" title="Google login error" style={{ marginTop: '1em' }}>
                    <strong>Error occured while deleting account. Try to sign out and in again.</strong>
                </Alert >
                : ""
            }
        </>
    )
}