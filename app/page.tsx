'use client'

import { auth, db } from "../firebase.config"
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter, usePathname } from 'next/navigation'
import { Select, LoadingOverlay, Loader } from '@mantine/core'
import { useCollection } from 'react-firebase-hooks/firestore'
import { collection } from 'firebase/firestore';
import TextData from '../models/TextData'
import { useState } from 'react'

export default function Home() {
  let texts = new Map<string, TextData>()
  const { push } = useRouter();
  const pathname = usePathname();
  const [loadingEnabled, setLoadingEnabled] = useState(false);

  const [snapshot, loading, error] = useCollection(
    collection(db, 'texts'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const [user, userLoad, userError] = useAuthState(auth)

  if (loading) {
    return <Loader color="blue" />
    
  }

  if (error) {
    return <p>An error occured while fetching texts!</p>
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

  let options = Array.from(texts).map(([key, value]) => ({ value: key, label: value.title }));
  return (
    <>
      <LoadingOverlay visible={loadingEnabled} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <h3>Test your typing speed and compare against other opponents!</h3>
      <Select
        label="Choose a text"
        data={options}
        onChange={(value, option) => {
          setLoadingEnabled(true)
          push(`${pathname}play/${value}`)
        }}
        placeholder="Search after a text..."
        selectFirstOptionOnChange={true}
        searchable
      />
      <br /><p><i>Website created by <a href="https://sondre.kulseng.no/" target="_blank">Sondre Kulseng</a></i></p>
    </>
  );
}
