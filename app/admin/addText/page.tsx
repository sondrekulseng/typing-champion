'use client'

import { TextLength } from "@/enums/TextLength";
import { db } from "@/firebase.config";
import { Button, Textarea, Alert } from "@mantine/core";
import { collection, doc, documentId, getCountFromServer, query, setDoc, where } from "firebase/firestore";
import { FormEvent, useState } from "react"

export default function Page() {

    const [lengthCategory, setLengthCategory] = useState(TextLength.SHORT);
    const [length, setLength] = useState(0);
    const [content, setContent] = useState("");
    const [textSubmitted, setTextSubmitted] = useState(false);

    function submitText(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        const lengthFormatted = lengthCategory.toLowerCase();
        getCountFromServer(
            query(
                collection(db, 'texts'),
                where(documentId(), '>=', lengthFormatted),
                where(documentId(), '<', lengthFormatted + '~')
            ))
            .then(result => {
                const lastIndex = result.data().count
                setDoc(
                    doc(db, "texts", lengthCategory.toLowerCase() + "-" + lastIndex),
                    { content: content }
                )
            })
        setContent("")
        setTextSubmitted(true)
    }

    function handleContentChange(inputContent: string) {
        setContent(inputContent)
        setLength(inputContent.length)
        if (inputContent.length <= 150) {
            setLengthCategory(TextLength.SHORT)
            return
        }
        if (inputContent.length > 150 && inputContent.length <= 250) {
            setLengthCategory(TextLength.MEDIUM)
            return
        }
        if (inputContent.length > 250 && inputContent.length < 350) {
            setLengthCategory(TextLength.LONG)
            return
        }
        setLengthCategory(TextLength.INSANE)
    }


    return (
        <>
            <h3>Add new text</h3>
            <form onSubmit={submitText}>
                <Textarea label="Content" placeholder="Content..." onChange={e => handleContentChange(e.target.value)} value={content} required />
                <p>Length: {length} / category: {lengthCategory}</p>
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
