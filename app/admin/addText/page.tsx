'use client'

import { db } from "@/firebase.config";
import { TextInput, Button, Textarea, Alert } from "@mantine/core";
import { addDoc, collection } from "firebase/firestore";
import { FormEvent, useState } from "react"

export default function Page() {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [textSubmitted, setTextSubmitted] = useState(false);

    function submitText(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        addDoc(collection(db, "texts"), {
            title: title,
            content: content
        })
        setTitle("")
        setContent("")
        setTextSubmitted(true)
    }


    return (
        <>
            <h3>Add new text</h3>
            <form onSubmit={submitText}>
                <TextInput label="Title" placeholder="My title" onChange={e => setTitle(e.target.value)} value={title} required />
                <Textarea label="Content" placeholder="Content..." onChange={e => setContent(e.target.value)} value={content} required />
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
