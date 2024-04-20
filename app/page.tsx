"use client"

import { TextInput } from '@mantine/core';
import { auth, db } from "/firebase.config"
import { useAuthState } from 'react-firebase-hooks/auth'
import { Skeleton } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { Select, Alert, Link} from '@mantine/core'
import { useCollection } from 'react-firebase-hooks/firestore'
import { collection } from 'firebase/firestore';
import TextData from './TextData'
import { useState } from 'react'
import ScoreTable from './ScoreTable'
import TypingGame from './TypingGame'
import LoginPage from './Login/LoginPage'
import SignUpPage from './Login/SignUpPage'
import SignOutButton from './Login/SignOutButton'

export default function Home() {
  let texts = new Map<string, TextData>()
  const [textData, setTextData] = useState<TextData>()
  const [snapshot, loading, error] = useCollection(
    collection(db, 'texts'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const [user, userLoad, userError] = useAuthState(auth)

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
              selectFirstOptionOnChange={true}
              searchable
            />
            {textData != null
              ? <TypingGame textData={textData} user={user}/>
              : ""
            }
        </div>
        <div style={{float: 'right', width: '25%'}}>
          <h1>Scores</h1>
          {textData != null
            ? <ScoreTable textId={textData.id} user={user} />
            : <Alert variant="light" color="blue" title="No text selected">
                  Select a text to view scores
                </Alert>
          }
          <br />
          {user ? "Hello " + user.displayName + "!" : ""}
          <br />
          {user
            ? <SignOutButton/>
            : (<>
                <LoginPage/> / <SignUpPage/>
                </>
              )
          }
        </div>
      </>
  );
}
