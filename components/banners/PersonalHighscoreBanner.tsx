import { TimeLimit } from "@/enums/TimeLimit"
import { db } from "@/firebase.config"
import TimeLimitParser from "@/utils/TimeLimitParser"
import { Alert, Skeleton } from "@mantine/core"
import { query, collection, where, orderBy } from "firebase/firestore"
import { useCollection } from "react-firebase-hooks/firestore"

type Props = {
    timeLimit: TimeLimit,
    uid: string
}
export default function PersonalHighscoreBanner({ timeLimit, uid }: Readonly<Props>) {

    const [snapshot, loading, error] = useCollection(
        query(
            collection(db, 'scores'),
            where('timeLimit', '==', TimeLimitParser.parseToSeconds(timeLimit)),
            where("uid", "==", uid),
            orderBy("wpm", "desc"),
        )
    )

    if (loading) {
        return <Skeleton height={100} radius="sm" style={{ marginTop: '1em' }} />
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