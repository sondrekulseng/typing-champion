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
import { Modal, Button, Alert } from '@mantine/core'
import Scores from './Scores'

export default function Home() {
  let texts = new Map<string, TextData>()
  const [answerIndex, setAnswerIndex] = useState(0)
  const [correctChars, setCorrectChars] = useState(0)
  const [textData, setTextData] = useState()
  const [textContent, setTextContent] = useState("")
  const [errorCount, setErrorCount] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [totalCharLength, setTotalCharLength] = useState(0)
  const [wordCorrectCharIndex, setWordCorrectCharIndex] = useState(0)
  const [gameFinished, setGameFinished] = useState(false)
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
      texts.set(doc.id, new TextData(
        doc.id,
        doc.data().title, 
        doc.data().content)
      )
    })
  }

  function getTextByKey(key: string) {
    const textData: TextData = texts.get(key)
    setGameFinished(false)
    setCorrectChars(0)
    setWordCount(0)
    setWordCorrectCharIndex(0)
    setErrorCount(0)
    setTextData(textData)
    setTextContent(textData.content)
    setTotalCharLength(textData.content.length - 1)
    setTextId(textData.id)
  }

  function checkText(userInput: string) {
    const userChar: char = userInput.charAt(userInput.length - 1)
    const answerChar: char = textContent.charAt(correctChars)

    console.log("Correct word char: " + wordCorrectCharIndex)
    console.log("User input length: " + userInput.length)

    if (wordCorrectCharIndex != userInput.length - 1) {
      return
    }

    if (correctChars == totalCharLength) {
      setUserInput("")  
      console.log("Game finished")
      setGameFinished(true)
      setWordCount(wordCount + 1)
      return
    }

    if (userChar == answerChar) {
      setCorrectChars(correctChars + 1)
      if (userChar == " ") {
        setWordCount(wordCount + 1)
        setUserInput("")
        setWordCorrectCharIndex(0)
        console.log("reset")
      } else {
        setWordCorrectCharIndex(wordCorrectCharIndex + 1)
      }
    } else {
      setErrorCount(errorCount + 1)
    }
  }

  function calcAccuracy(): Number {
    let totalChars = textContent.length;
    return 100 - (errorCount / totalChars * 100);
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
          searchable
        />
        {textData != null
          ? <h3>{textData.content}</h3>
          : <h3>Select a text from the dropdown above</h3>
        }
        <p>Words typed: {wordCount}</p>
        <p>Number of errors: {errorCount}</p>
        <br/>
        <TextInput 
          placeholder="Write in the text" 
          onChange={e => {
            setUserInput(e.target.value)
            checkText(e.target.value)
          }} 
          value={userInput} />
        {gameFinished ? 
          <Alert variant="light" color="blue" title="Game finished!" style={{marginTop: '1em'}}>
            <h3>Words typed: {wordCount}</h3>
            <h3>Errors: {errorCount}</h3>
            <h3>Accuracy: {calcAccuracy()} %</h3>
          </Alert>
          : ""
        }
        </div>
        <Scores textId={"MSU3NBTCoSNniD3PPyFN"}/>
      </>
  );
}
