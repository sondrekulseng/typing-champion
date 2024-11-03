import TextData from '../models/TextData'
import { useState } from 'react'
import { TextInput, Alert, Button } from '@mantine/core'
import { collection, addDoc, query, where, updateDoc } from "firebase/firestore"
import { db } from "../firebase.config"
import { useCollection } from 'react-firebase-hooks/firestore'
import { User } from 'firebase/auth'

type Props = {
	textData: TextData,
	user: User | undefined | null
}

let wordCount = 0
let correctChars = 0
let wordCorrectCharIndex = 0
let errorCount = 0
let currentWordErrorCount = 0

export default function TypingGame(props: Props) {
	
	const [textData, setTextData] = useState<TextData>(props.textData)
	const [textContent, setTextContent] = useState(props.textData.content)
	const [userInput, setUserInput] = useState("")
	const [seconds, setSeconds] = useState(0)
	const [gameStarted, setGameStarted] = useState(false)
	const [gameFinished, setGameFinished] = useState(false)
	const [intervalId, setIntervalId] = useState<NodeJS.Timeout | undefined>()
	const [wpm, setWpm] = useState(0)
	const [accuracy, setAccuracy] = useState(0)
	const [writtenText, setWrittenText] = useState("")
	const [errorText, setErrorText] = useState("")

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
		wordCount = 0
		correctChars = 0
		wordCorrectCharIndex = 0
		errorCount = 0
		currentWordErrorCount = 0
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

		if (currentWordErrorCount > 4 || correctChars + currentWordErrorCount === textData.content.length) {
			// Block user from typing more errors
			return
		}

		setUserInput(userInput)
		const userChar = userInput.charAt(userInput.length - 1)
		const answerChar = textData.content.charAt(correctChars)

		if (userChar != answerChar || currentWordErrorCount > 0) {
			// Wrong char is typed
			errorCount++
			currentWordErrorCount++
			setTextContent(textData.content.slice(correctChars + currentWordErrorCount, textData.content.length))
			setErrorText(textData.content.slice(correctChars, correctChars + currentWordErrorCount))
			return
		}

		if (userChar == answerChar) {
			// Correct char is typed
			correctChars++
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
		const userChar = userInput.charAt(userInput.length - 1)
		const answerChar = textData.content.charAt(correctChars - 1)

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
		if (snapshot == undefined || props.user == undefined) {
			alert("Error submitting your score. Try again later.")
			return;
		}
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
				updateDoc(snapshot.docs[0].ref, { wpm: wpm })
			}
		}
		resetGame()
	}

	function startTimer() {
		const intervalId = setInterval(() => {
			setSeconds(prevSeconds => Math.round((prevSeconds + 0.1) * 100) / 100);
		}, 100);
		setIntervalId(intervalId)
	}

	return (
		<>
			<h3>
				<span style={{ backgroundColor: 'rgba(51, 170, 51, .6)' }}>{writtenText}</span>
				<span style={{ backgroundColor: 'rgba(247, 2, 2, .6)' }}>{errorText}</span>
				{textContent}
			</h3>
			<TextInput
				placeholder="Write in the text"
				onChange={e => checkText(e.target.value)}
				onKeyDown={e => {
					const target = e.target as HTMLTextAreaElement;
					const inputValue = target.value
					if (e.key == "Backspace" && inputValue.length > 0) {
						handleCharDelete(inputValue)
						setUserInput(inputValue.slice(0, inputValue.length - 1))
						e.preventDefault();
					}
					if (e.key === "ArrowLeft") {
						e.preventDefault();
					}
				}}

				value={userInput}
				disabled={gameFinished}
			/>
			{seconds} s <br />
			{gameFinished
				? <Alert variant="light" color="blue" title="Game finished!" style={{ marginTop: '1em' }}>
					<h3>WPM: {wpm}</h3>
					<h3>Accuracy: {accuracy}% ({errorCount} errors)</h3>
					<h3>Elapsed time: {seconds}s</h3>
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