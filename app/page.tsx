"use client"

import { TextInput } from '@mantine/core';
import { auth, db } from "/firebase.config"
import { useAuthState } from 'react-firebase-hooks/auth'
import { Skeleton } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { Select } from '@mantine/core'
import { useCollection } from 'react-firebase-hooks/firestore'
import { collection } from 'firebase/firestore';
import TextData from './TextData'
import { useState } from 'react'

export default function Home() {
  let texts = new Map<string, TextData>()
  const [textData, setTextData] = useState();
  const [snapshot, loading, error] = useCollection(
    collection(db, 'texts'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  if (loading) {
    return (
      <>
        <Skeleton height={8} mt={6} height={30} width="50%" />
        <Skeleton height={8} mt={6} height={30} width="20%" />
      </>
    )
  }

  if (error) {
    return <p>Error occured: {error.message}</p>
  }

  if (snapshot) {
    snapshot.forEach(doc => {
      texts.set(doc.id, new TextData(doc.data().title, doc.data().content))
    })
  }

  function getTextByKey(key: string) {
    setTextData(texts.get(key))
  }

  let options = Array.from(texts).map(([key, value]) => ({ value: key, label: value.title }));
  return (
      <>
        <h1>Typing champion</h1>
        <Select
          label="Choose a text"
          placeholder="Pick value"
          data={options}  
          onChange={(value, option) => getTextByKey(value)}
          searchable
        />
        {textData != null
          ? <h3>{textData.content}</h3>
          : <h3>Select a text from the dropdown above</h3>
        }
        <br/>
        <TextInput placeholder="Write in the text"/>
      </>
  );
}
