import TextData from '../../models/TextData'
import { useEffect, useState } from 'react'
import { TextInput, Alert, Button } from '@mantine/core'
import { collection, addDoc, query, where, updateDoc } from "firebase/firestore"
import { db } from "../../firebase.config"
import { useCollection } from 'react-firebase-hooks/firestore'
import { User } from 'firebase/auth'
import dayjs from 'dayjs'
import Styles from './TypingGame.module.css'

type Props = {
	textData: TextData,
	length: string,
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
	const [lengthCategory, setLengthCategory] = useState("")
	const [typedText, setTypedText] = useState("")
	const [mistypedText, setMistypedText] = useState("")
	const [userInput, setUserInput] = useState("")
	const [seconds, setSeconds] = useState(0)
	const [gameStarted, setGameStarted] = useState(false)
	const [gameFinished, setGameFinished] = useState(false)
	const [intervalId, setIntervalId] = useState<NodeJS.Timeout | undefined>()
	const [wpm, setWpm] = useState(0)
	const [accuracy, setAccuracy] = useState(0)
	const [currentHighscore, setCurrentHighscore] = useState(0)

	const [snapshot, loading, error] = useCollection(
		query(
			collection(db, 'scores'),
			where("length", "==", lengthCategory),
			where("uid", "==", props.user != null ? props.user.uid : "")
		)
	);

	useEffect(() => {
		if (snapshot && props.user) {
			if (snapshot.docs.length > 0) {
				const storedWpm = snapshot.docs[0].data().wpm;
				setCurrentHighscore(storedWpm)
			}
		}
		if (props.length != lengthCategory) {
			setLengthCategory(props.length)
			resetGame()
		}
	}, [snapshot, props.user, props.length])

	function resetGame() {
		setTextData(props.textData)
		setTextContent(props.textData.content)
		setTypedText("")
		setMistypedText("")
		wordCount = 0
		correctChars = 0
		wordCorrectCharIndex = 0
		errorCount = 0
		currentWordErrorCount = 0
		setSeconds(0)
		setGameFinished(false)
		setUserInput("")
		clearInterval(intervalId)
		setGameStarted(false);
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
			setMistypedText(textData.content.slice(correctChars, correctChars + currentWordErrorCount))
			return
		}

		if (userChar == answerChar) {
			// Correct char is typed
			correctChars++
			setTypedText(textData.content.slice(0, correctChars))
			setTextContent(textData.content.slice(correctChars, textData.content.length))
			if (userChar == " ") {
				wordCount++
				setUserInput("")
				wordCorrectCharIndex = 0
				currentWordErrorCount = 0
				setMistypedText("")
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
			setTypedText(textData.content.slice(0, correctChars))
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
			setMistypedText(textData.content.slice(correctChars, correctChars + currentWordErrorCount))
			setTextContent(textData.content.slice(correctChars + currentWordErrorCount, textData.content.length))
			return
		}

		if (userChar == answerChar) {
			// Delete correct char
			correctChars--
			wordCorrectCharIndex--
			setTypedText(textData.content.slice(0, correctChars))
			setTextContent(textData.content.slice(correctChars, textData.content.length))
			return
		}
	}

	function submitScore() {
		if (snapshot == undefined || props.user == undefined) {
			console.error("An error occured while submitting high score")
			return;
		}

		const timestamp = dayjs().format("DD-MM-YYYY")
		if (snapshot.docs.length == 0) {
			addDoc(collection(db, "scores"), {
				uid: props.user.uid,
				displayName: props.user.displayName,
				wpm: wpm,
				timestamp: timestamp,
				length: props.length.toLowerCase()
			})
		} else if (wpm > currentHighscore) {
			updateDoc(snapshot.docs[0].ref, { wpm: wpm, timestamp: timestamp })
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
			<h2>
				<span className={Styles.typedText}>{typedText}</span>
				<span className={Styles.mistypedText}>{mistypedText}</span>
				{textContent}
			</h2>
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
			{gameStarted ? <Button onClick={resetGame} className={Styles.marginTop}>Reset game</Button> : ""}
			{gameFinished
				? <Alert variant="light" color="blue" title="Game finished!" className={Styles.marginTop}>
					<h3>WPM: {wpm}<br />
						Accuracy: {accuracy}% ({errorCount} errors)<br />
						Elapsed time: {seconds}s</h3>
					{props.user
						? wpm > currentHighscore
							? (
								<>
									<h3>New personal high score! 🎉</h3>
									<Button onClick={submitScore}>Submit high score</Button>
								</>
							) : (
								<>
									<h3>Good effort! Your current high score is {currentHighscore} WPM</h3>
									<Button onClick={resetGame}>New game</Button>
								</>
							)
						: (
							<>
								<h3><i>You must be logged in to submit your high score</i></h3>
								<Button onClick={resetGame}>New game</Button>
							</>
						)
					}
				</Alert >
				: ""
			}
		</>
	)
}