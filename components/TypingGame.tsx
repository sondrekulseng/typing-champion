import TextData from '/models/TextData'
import { useState, useRef } from 'react'
import { TextInput, Alert, Button } from '@mantine/core'
import { useEffect } from 'react'
import { collection, addDoc, query, where, updateDoc } from "firebase/firestore"
import { auth, db } from "/firebase.config"
import firebase from "firebase/app"
import { useCollection } from 'react-firebase-hooks/firestore'

type Props = {
	textData: TextData,
	user: Firebase.User | undefined
}

let correctChars = 0
let errorCount = 0
let currentWordErrorCount = 0
let wordCount = 0
let wordCorrectCharIndex = 0
let maxTypeLength = 100

export default function TypingGame(props: Props) {
	const [textData, setTextData] = useState<TextData>(props.textData)
	const [textContent, setTextContent] = useState(props.textData.content)
	const [user, setUser] = useState(props.userEmail)
	const [userInput, setUserInput] = useState("")
	const [seconds, setSeconds] = useState(0)
	const [gameStarted, setGameStarted] = useState(false)
	const [gameFinished, setGameFinished] = useState(false)
	const [intervalId, setIntervalId] = useState()
	const [wpm, setWpm] = useState(0)
	const [accuracy, setAccuracy] = useState(0)
	const [writtenText, setWrittenText] = useState("")
	const [errorText, setErrorText] = useState("")
	const [prevInputLength, setPrevInputLength] = useState(0)

	const [snapshot, loading, error] = useCollection(
		query(
			collection(db, 'scores'),
			where("textId", "==", textData.id),
			where("userId", "==", props.user != null ? props.user.uid : "")
			)
		);

	function resetGame() {
		setTextData(props.textData)
		setTextContent(props.textData.content)
		setWrittenText("")
		correctChars = 0
		errorCount = 0
		wordCount = 0
		wordCorrectCharIndex = 0
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

		if (userInput.length - 1  > maxTypeLength) {
			// Block error typing over current word
			console.log("blocked")
			return
		}

		setUserInput(userInput)
		const userChar: char = userInput.charAt(userInput.length - 1)
		const answerChar: char = textData.content.charAt(correctChars)

		if (userChar != answerChar || currentWordErrorCount > 0) {
			// Wrong char is typed
			errorCount++
			currentWordErrorCount++
			setTextContent(content => textData.content.slice(correctChars + currentWordErrorCount, textData.content.length))
			setErrorText(content => textData.content.slice(correctChars, correctChars + currentWordErrorCount))
			console.log("NEXT CHAR: " + textData.content.charAt(correctChars + currentWordErrorCount))
			if (textData.content.charAt(correctChars + currentWordErrorCount) == " ") {
				// Max error for current word
				console.log("block start")
				maxTypeLength = wordCorrectCharIndex + currentWordErrorCount - 1
				return
			}
			return
		}

		if (userChar == answerChar) {
			// Correct char is typed
			correctChars++
			maxTypeLength = 100
			setWrittenText(textData.content.slice(0, correctChars))
			setTextContent(textData.content.slice(correctChars, textData.content.length))
			if (userChar == " ") {
				wordCount++
				setUserInput("")
				wordCorrectCharIndex = 0
				currentWordErrorCount = 0
				setErrorText("")
			} else {
				wordCorrectCharIndex++
			}
		}

		if (correctChars == textData.content.length) {
			// All chars has been typed
			wordCount++;
			setUserInput("")
			setGameFinished(true)
			setGameStarted(false)
			setWpm(Math.round(wordCount / seconds * 60))
			setAccuracy(Math.round(100 - (errorCount / textData.content.length * 100)))
			setWrittenText(textData.content.slice(0, correctChars))
			setTextContent(textData.content.slice(correctChars, textData.content.length))
			clearInterval(intervalId)
			return
		}
	}

	function handleCharDelete(userInput: string) {
		setUserInput(userInput.slice(0, userInput.length - 1))

		const userChar: char = userInput.charAt(userInput.length - 1)
		const answerChar: char = textData.content.charAt(correctChars - 1)

		if (userChar != answerChar || currentWordErrorCount > 0) {
			// Delete error char
			currentWordErrorCount--
			setErrorText(textData.content.slice(correctChars, correctChars + currentWordErrorCount))
			setTextContent(textData.content.slice(correctChars + currentWordErrorCount, textData.content.length))
			return
		}

		if (userChar == answerChar) {
			// Delete correct char
			correctChars--
			wordCorrectCharIndex--
			setWrittenText(textData.content.slice(0, correctChars))
			setTextContent(textData.content.slice(correctChars, textData.content.length))
			return
		}
	}

	function submitScore() {
		if (snapshot.docs.length == 0) {
			addDoc(collection(db, "scores"), {
				textId: textData.id,
				userId: props.user.uid,
				displayName: props.user.displayName,
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
		<h3>
		<span style={{color: 'green'}}>{writtenText}</span>
		<span style={{color: 'red'}}>{errorText}</span>
			{textContent}
		</h3>
		<TextInput
			placeholder="Write in the text"
			onChange={e => {
				checkText(e.target.value)
			}}
			onKeyDown={e => {
				if (e.key == "Backspace" && e.target.value.length > 0) {
					handleCharDelete(e.target.value)
					setUserInput(e.target.value.slice(0, e.target.value.length - 1))
					e.preventDefault();
				}
			}}
			value={userInput}
			disabled={gameFinished} 
		/>
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
					: <Button onClick={resetGame}>Reset game</Button>
				}
			  </Alert>
			: ""
		}
		</>
	)
}