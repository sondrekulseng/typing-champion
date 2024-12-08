'use client'

import { TextLength } from "@/enums/TextLength";
import { db } from "@/firebase.config";
import { TextInput, Button, Textarea, Alert } from "@mantine/core";
import { addDoc, collection, getCountFromServer, query, where } from "firebase/firestore";
import { FormEvent, useEffect, useState } from "react"

export default function Page() {

    const [length, setLength] = useState(TextLength.SHORT);
    const [title, setTitle] = useState("");
    const [textsByLength, setTextsByLength] = useState(
        query(
            collection(db, 'texts'),
            where('length', '==', length)
        )
    );
    const [content, setContent] = useState("");
    const [textSubmitted, setTextSubmitted] = useState(false);

    useEffect(() => {
        setTextsByLength(
            query(
                collection(db, 'texts'),
                where('length', '==', length)
            )
        )
    }, [length])

    function submitText(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        getCountFromServer(textsByLength)
            .then(result => {
                const lastIndex = result.data().count
                addDoc(collection(db, "texts"), {
                    length: length,
                    title: title,
                    content: content,
                    index: lastIndex
                })
            })
        setTitle("")
        setContent("")
        setTextSubmitted(true)
    }

    function handleContentChange(inputContent: string) {
        setContent(inputContent)
        if (inputContent.length <= 300) {
            setLength(TextLength.SHORT)
            return
        }
        if (inputContent.length > 300 && inputContent.length <= 400) {
            setLength(TextLength.MEDIUM)
            return
        }
        if (inputContent.length > 400 && inputContent.length < 500) {
            setLength(TextLength.LONG)
            return
        }
        setLength(TextLength.INSANE)
    }


    return (
        <>
            <h3>Add new text</h3>
            <form onSubmit={submitText}>
                <TextInput label="Title" placeholder="My title" onChange={e => setTitle(e.target.value)} value={title} required />
                <Textarea label="Content" placeholder="Content..." onChange={e => handleContentChange(e.target.value)} value={content} required />
                <p>Text length: {length}</p>
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
