import { TextLength } from "@/enums/TextLength"
import { db } from "@/firebase.config"
import { Alert } from "@mantine/core"
import { query, collection, where, orderBy } from "firebase/firestore"
import { useCollection } from "react-firebase-hooks/firestore"

type Props = {
    length: TextLength,
    uid: string
}
export default function PersonalHighscoreBanner({ length, uid }: Readonly<Props>) {

    const [snapshot, loading, error] = useCollection(
        query(
            collection(db, 'scores'),
            where('length', '==', length.toLowerCase()),
            where("uid", "==", uid),
            orderBy("wpm", "desc"),
        )
    )

    if (loading) {
        return "Loading personal highscore"
    }

    if (error) {
        return "Error fetching personal highscore"
    }

    if (snapshot) {
        return snapshot?.empty
            ? ""
            : (
                <Alert variant="light" color="blue" title="Personal highscore" style={{ marginTop: '1em' }}>
                    <h3>Your highscore for this category is {snapshot?.docs.at(0)?.data().wpm} WPM</h3>
                </Alert>
            )
    }
}