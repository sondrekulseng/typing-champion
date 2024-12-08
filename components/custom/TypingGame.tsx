import { useEffect, useState } from 'react'
import { TextInput, Alert, Button } from '@mantine/core'
import { collection, addDoc, query, where, updateDoc } from "firebase/firestore"
import { db } from "../../firebase.config"
import { useCollection } from 'react-firebase-hooks/firestore'
import { User } from 'firebase/auth'
import dayjs from 'dayjs'
import Styles from './TypingGame.module.css'

type Props = {
	textContent: string,
	timeLimit: number,
	user: User | undefined | null
}

let wordCount = 0
let correctChars = 0
let wordCorrectCharIndex = 0
let errorCount = 0
let currentWordErrorCount = 0

export default function TypingGame(props: Props) {

	const FULL_TEXT = props.textContent;

	const [remainingText, setRemainingText] = useState(FULL_TEXT)
	const [timeLimit, setTimeLimit] = useState(props.timeLimit)
	const [typedText, setTypedText] = useState("")
	const [mistypedText, setMistypedText] = useState("")
	const [userInput, setUserInput] = useState("")
	const [remainingSeconds, setRemainingSeconds] = useState(timeLimit)
	const [gameStarted, setGameStarted] = useState(false)
	const [gameFinished, setGameFinished] = useState(false)
	const [intervalId, setIntervalId] = useState<NodeJS.Timeout | undefined>()
	const [wpm, setWpm] = useState(0)
	const [accuracy, setAccuracy] = useState(0)
	const [currentHighscore, setCurrentHighscore] = useState(0)

	const [snapshot, loading, error] = useCollection(
		query(
			collection(db, 'scores'),
			where("timeLimit", "==", timeLimit),
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
		if (props.timeLimit != timeLimit) {
			setTimeLimit(props.timeLimit)
			resetGame()
		}
	}, [snapshot, props.user, props.timeLimit])

	function resetGame() {
		setRemainingText(FULL_TEXT)
		setTypedText("")
		setMistypedText("")
		wordCount = 0
		correctChars = 0
		wordCorrectCharIndex = 0
		errorCount = 0
		currentWordErrorCount = 0
		setRemainingSeconds(timeLimit)
		setGameFinished(false)
		setUserInput("")
		clearInterval(intervalId)
		setGameStarted(false);
	}

	function checkText(userInput: string) {
		if (!gameStarted) {
			if (timeLimit > 0) {
				startCountdown(timeLimit)
			}
			setGameStarted(true)
		}

		if (currentWordErrorCount > 4 || correctChars + currentWordErrorCount === FULL_TEXT.length) {
			// Block user from typing more errors
			return
		}

		setUserInput(userInput)
		const userChar = userInput.charAt(userInput.length - 1)
		const answerChar = FULL_TEXT.charAt(correctChars)

		if (userChar != answerChar || currentWordErrorCount > 0) {
			// Wrong char is typed
			errorCount++
			currentWordErrorCount++
			setRemainingText(FULL_TEXT.slice(correctChars + currentWordErrorCount, FULL_TEXT.length))
			setMistypedText(FULL_TEXT.slice(correctChars, correctChars + currentWordErrorCount))
			return
		}

		if (userChar == answerChar) {
			// Correct char is typed
			correctChars++
			setTypedText(FULL_TEXT.slice(0, correctChars))
			setRemainingText(FULL_TEXT.slice(correctChars, FULL_TEXT.length))
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

		if (correctChars == FULL_TEXT.length) {
			// All chars has been typed
			wordCount++;
			finishGame()
			return
		}
	}

	function finishGame() {
		setUserInput("")
		setGameFinished(true)
		setGameStarted(false)
		setWpm(Math.round(wordCount / timeLimit * 60))
		setRemainingSeconds(timeLimit)
		setAccuracy(Math.round(100 - (errorCount / FULL_TEXT.length * 100)))
		setTypedText(FULL_TEXT.slice(0, correctChars))
		setRemainingText(FULL_TEXT.slice(correctChars, FULL_TEXT.length))
		clearInterval(intervalId)
	}

	function handleCharDelete(userInput: string) {
		const userChar = userInput.charAt(userInput.length - 1)
		const answerChar = FULL_TEXT.charAt(correctChars - 1)

		if (userChar != answerChar || currentWordErrorCount > 0) {
			// Delete error char
			currentWordErrorCount--
			setMistypedText(FULL_TEXT.slice(correctChars, correctChars + currentWordErrorCount))
			setRemainingText(FULL_TEXT.slice(correctChars + currentWordErrorCount, FULL_TEXT.length))
			return
		}

		if (userChar == answerChar) {
			// Delete correct char
			correctChars--
			wordCorrectCharIndex--
			setTypedText(FULL_TEXT.slice(0, correctChars))
			setRemainingText(FULL_TEXT.slice(correctChars, FULL_TEXT.length))
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
			addDoc(
				collection(db, "scores"),
				{
					uid: props.user.uid,
					displayName: props.user.displayName,
					wpm: wpm,
					timestamp: timestamp,
					timeLimit: timeLimit
				}
			)
		} else if (wpm > currentHighscore) {
			updateDoc(snapshot.docs[0].ref, { wpm: wpm, timestamp: timestamp })
		}
		resetGame()
	}

	function startCountdown(initialSeconds: number) {

		setRemainingSeconds(initialSeconds)

		const intervalId = setInterval(() => {
			setRemainingSeconds((prevSeconds) => {
				const updatedSeconds = Math.round((prevSeconds - 0.1) * 100) / 100;

				if (updatedSeconds <= 0) {
					clearInterval(intervalId);
					finishGame();
				}

				return updatedSeconds;
			});
		}, 100);

		setIntervalId(intervalId); // Save the interval ID if needed for later
	}
	return (
		<>
			<h2>
				<span className={Styles.typedText}>{typedText}</span>
				<span className={Styles.mistypedText}>{mistypedText}</span>
				{remainingText}
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
				style={{ marginTop: '2em' }}
				value={userInput}
				disabled={gameFinished}
			/>
			<h3>{remainingSeconds} s </h3>
			{gameStarted ? <Button onClick={resetGame} className={Styles.marginTop}>Reset game</Button> : ""}
			{gameFinished
				? <Alert variant="light" color="blue" title="Game finished!" className={Styles.marginTop}>
					<h3>WPM: {wpm}<br />
						Accuracy: {accuracy}% ({errorCount} errors)<br />
						Elapsed time: {remainingSeconds}s</h3>
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