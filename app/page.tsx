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
import { useDisclosure } from '@mantine/hooks'
import Scores from './Scores'
import TypingGame from './TypingGame'

export default function Home() {
  let texts = new Map<string, TextData>()
  const [textData, setTextData] = useState<TextData>()
  const [snapshot, loading, error] = useCollection(
    collection(db, 'texts'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  if (loading) {
    return (
      <>
        <Skeleton height={40} width={400} radius="xl" />
        <Skeleton height={40} width={800} radius="xl" />
      </>
    )
  }

  if (error) {
    return <p>Error occured: {error.message}</p>
  }

  if (snapshot) {
    snapshot.forEach(doc => {
      texts.set(doc.id, new TextData(
        doc.id,
        doc.data().title, 
        doc.data().content)
      )
    })
  }

  function getTextByKey(key: string) {
    setTextData(texts.get(key))
  }

  let options = Array.from(texts).map(([key, value]) => ({ value: key, label: value.title }));
  return (
      <>
        <div style={{float: 'left', width: '70%'}}>
          <h1>Typing champion</h1>
            <Select
              label="Choose a text"
              data={options} 
              onChange={(value, option) => getTextByKey(value)}
              placeholder="Search after a text..."
              searchable
            />
            {textData != null
              ? <TypingGame textData={textData}/>
              : "" 
            }
        </div>
        {textData != null
          ? <Scores textId={textData.id}/>
          : ""
        }
      </>
  );
}
