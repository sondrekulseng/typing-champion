import TextData from './TextData'
import { useState } from 'react'
import { TextInput, Alert, Button } from '@mantine/core';
import { useEffect } from 'react'
import { collection, addDoc, query, where, updateDoc } from "firebase/firestore";
import { auth, db } from "/firebase.config"
import firebase from "firebase/app"
import { useCollection } from 'react-firebase-hooks/firestore';

type Props = {
	textData: TextData,
	user: Firebase.User | undefined
}

export default function TypingGame(props: Props) {
	const [textData, setTextData] = useState<TextData>(props.textData)
	const [textContent, setTextContent] = useState(props.textData.content)
	const [user, setUser] = useState(props.userEmail)
	const [userInput, setUserInput] = useState("")
  const [correctChars, setCorrectChars] = useState(0)
	const [errorCount, setErrorCount] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [wordCorrectCharIndex, setWordCorrectCharIndex] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [intervalId, setIntervalId] = useState()
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [writtenText, setWrittenText] = useState("")

  	useEffect(() => {
  		resetGame()
  	}, [props.textData])

		const [snapshot, loading, error] = useCollection(
			query(
				collection(db, 'scores'),
				where("textId", "==", textData.id),
				where("userEmail", "==", props.user != null ? props.user.email : "")
			)
		);

  	function resetGame() {
  		setTextData(props.textData)
  		setTextContent(props.textData.content)
  		setWrittenText("")
  		setCorrectChars(0)
  		setErrorCount(0)
  		setWordCount(0)
  		setWordCorrectCharIndex(0)
  		setSeconds(0)
  		setGameFinished(false)
  		setUserInput("")
  		clearInterval(intervalId)
  	}

	function checkText(userInput: string) {
		if (!gameStarted) {
			startTimer()
			setGameStarted(true)
		}

    	const userChar: char = userInput.charAt(userInput.length - 1)
    	const answerChar: char = textData.content.charAt(correctChars)

	    if (wordCorrectCharIndex != userInput.length - 1) {
    	  return
    	}

	    if (correctChars == textData.content.length - 1) {
    	  	setUserInput("")
      		console.log("Game finished")
      		setGameFinished(true)
      		setWpm(Math.round(wordCount / seconds * 60))
      		setAccuracy(Math.round(100 - (errorCount / textData.content.length * 100)))
      		setGameStarted(false)
      		setWordCount(wordCount + 1)
      		setWrittenText(textData.content.slice(0, correctChars + 1))
      		setTextContent(content => textData.content.slice(correctChars + 1, textData.content.length))
      		clearInterval(intervalId)
      		return
    	}

    	if (userChar == answerChar) {
      		setCorrectChars(correctChars + 1)
      		setWrittenText(textData.content.slice(0, correctChars + 1))
      		setTextContent(content => textData.content.slice(correctChars + 1, textData.content.length))
      		if (userChar == " ") {
        		setWordCount(wordCount + 1)
        		setUserInput("")
        		setWordCorrectCharIndex(0)
      		} else {
        		setWordCorrectCharIndex(wordCorrectCharIndex + 1)
      		}
    	} else {
      		setErrorCount(errorCount + 1)
    	}
  	}

  	function submitScore() {
			if (snapshot.docs.length == 0) {
				addDoc(collection(db, "scores"), {
	  			textId: textData.id,
	  			userEmail: props.user.email,
	  			wpm: wpm,
	  			accuracy: accuracy
	  		})
			} else {
				const storedWpm = snapshot.docs[0].data().wpm;
				if (wpm > storedWpm) {
					updateDoc(snapshot.docs[0].ref, {wpm: wpm })
				}
			}
  		resetGame()
  	}

  	function startTimer() {
  		const intervalId = setInterval(() => {
            setSeconds(prevSeconds => Math.round((prevSeconds + 0.1)*100)/100);
        }, 100);
        setIntervalId(intervalId)
  	}

	return (
		<>
			<h3>{textData.title}</h3>
			<h4>
				<span style={{color: 'green'}}>{writtenText}</span>
				{textContent}
			</h4>
        	<TextInput
          		placeholder="Write in the text"
          		onChange={e => {
            		setUserInput(e.target.value)
            		checkText(e.target.value)
          	}}
          	value={userInput} />
          	{seconds} s <br />
        	{gameFinished
        		? <Alert variant="light" color="blue" title="Game finished!" style={{marginTop: '1em'}}>
            		<h3>Words typed: {wordCount}</h3>
            		<h3>Errors: {errorCount}</h3>
            		<h3>Elapsed time: {seconds}s</h3>
            		<h3>WPM: {wpm}</h3>
            		<h3>Accuracy: {accuracy} %</h3>
            		{props.user != undefined
            			? <Button onClick={submitScore}>Submit score</Button>
            			: ""
            		}
          		  </Alert>
          		: ""
          	}
          </>
        )
}
