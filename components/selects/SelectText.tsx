'use client'

import { db } from "@/firebase.config";
import TextData from "@/models/TextData";
import { Select, Skeleton } from "@mantine/core"
import { collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { Dispatch, SetStateAction } from 'react';

type Props = {
    textId: string,
    setTextId: Dispatch<SetStateAction<string>>
}
export default function SelectText({ textId, setTextId }: Readonly<Props>) {

    let texts = new Map<string, TextData>()

    const [snapshot, loading, error] = useCollection(
        collection(db, 'texts'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    if (loading) {
        return (
            <>
                <Skeleton height={12} mt={6} width={'10%'} />
                <Skeleton height={30} mt={6} />
            </>
        )

    }

    if (error) {
        return <p>An error occured while fetching texts!</p>
    }

    if (snapshot) {
        snapshot.forEach(doc => {
            texts.set(
                doc.id,
                new TextData(
                    doc.id,
                    doc.data().title,
                    doc.data().content
                )
            )
        })
    }

    const options = Array.from(texts).map(([key, value]) => ({ value: key, label: value.title }));

    return (
        <Select
            label="Choose a text"
            data={options}
            placeholder="Search after a text..."
            onChange={(value, option) => {
                if (value != null) {
                    setTextId(value)
                }
            }}
            selectFirstOptionOnChange={true}
            defaultValue={options.find(op => op.value == textId)
                ? options.find(op => op.value == textId)?.value
                : ""
            }
            searchable
        />
    )
}