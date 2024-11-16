import { auth } from "@/firebase.config";
import { Alert, Button } from "@mantine/core";
import { useDeleteUser } from "react-firebase-hooks/auth";

export default function DeleteAccountButton() {
    const [deleteUser, loading, error] = useDeleteUser(auth);

    return (
        <>
            <Button onClick={deleteUser} loading={loading} color="red">Delete account</Button>
            {error
                ? <Alert variant="light" color="red" title="Google login error">
                    <strong>Error occured while deleting account. Try to sign out and in again.</strong>
                </Alert >
                : ""
            }
        </>
    )
}