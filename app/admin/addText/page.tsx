'use client'

import { TimeLimit } from "@/enums/TimeLimit";
import { db } from "@/firebase.config";
import TimeLimitParser from "@/utils/TimeLimitParser";
import { Button, Textarea, Alert } from "@mantine/core";
import { collection, doc, documentId, getCountFromServer, query, setDoc, where } from "firebase/firestore";
import { FormEvent, useState } from "react"

export default function Page() {

    const [timeLimit, setTimeLimit] = useState(TimeLimit.HALF_MINUTE);
    const [length, setLength] = useState(0);
    const [content, setContent] = useState("");
    const [textSubmitted, setTextSubmitted] = useState(false);

    function submitText(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        const timeLimitFormatted = timeLimit.replace(" ", "-").toLowerCase()
        getCountFromServer(
            query(
                collection(db, 'texts'),
                where(documentId(), '>=', timeLimitFormatted),
                where(documentId(), '<', timeLimitFormatted + '~')
            ))
            .then(result => {
                const index = result.data().count
                setDoc(
                    doc(db, "texts", TimeLimitParser.parseToDbKey(timeLimit, index)),
                    { content: content }
                )
            })
        setContent("")
        setTextSubmitted(true)
    }

    function handleContentChange(inputContent: string) {
        setContent(inputContent)
        setLength(inputContent.length)
        if (inputContent.length <= 300) {
            setTimeLimit(TimeLimit.HALF_MINUTE)
            return
        }
        if (inputContent.length > 300 && inputContent.length <= 600) {
            setTimeLimit(TimeLimit.ONE_MINUTE)
            return
        }
        if (inputContent.length > 600) {
            setTimeLimit(TimeLimit.TWO_MINUTES)
            return
        }
    }


    return (
        <>
            <h3>Add new text</h3>
            <form onSubmit={submitText}>
                <Textarea label="Content" placeholder="Content..." onChange={e => handleContentChange(e.target.value)} value={content} required />
                <p>Length: {length} / category: {timeLimit}</p>
                {textSubmitted
                    ? (
                        <Alert variant="light" color="green" title="Success" style={{ marginTop: '1em' }}>
                            New text was submitted
                        </Alert>
                    )
                    : ""
                }
                <Button type="submit" style={{ marginTop: '1em' }}>Add</Button>
            </form>
        </>
    )
}
