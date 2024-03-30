import TextData from './TextData'
import { useState } from 'react'
import { TextInput, Alert } from '@mantine/core';
import { useEffect } from 'react'

type Props = {
	textData: TextData
}

export default function TypingGame(props: Props) {
	const [textData, setTextData] = useState<TextData>(props.textData)
	const [userInput, setUserInput] = useState("")
  	const [correctChars, setCorrectChars] = useState(0)
	const [errorCount, setErrorCount] = useState(0)
  	const [wordCount, setWordCount] = useState(0)
  	const [wordCorrectCharIndex, setWordCorrectCharIndex] = useState(0)
  	const [gameFinished, setGameFinished] = useState(false)

  	useEffect(() => {
  		setTextData(props.textData)
  		setCorrectChars(0)
  		setErrorCount(0)
  		setWordCount(0)
  		setWordCorrectCharIndex(0)
  		setGameFinished(false)
  	}, [props])

	function checkText(userInput: string) {
    	const userChar: char = userInput.charAt(userInput.length - 1)
    	const answerChar: char = textData.content.charAt(correctChars)

	    if (wordCorrectCharIndex != userInput.length - 1) {
    	  return
    	}

	    if (correctChars == textData.content.length - 1) {
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
      		} else {
        		setWordCorrectCharIndex(wordCorrectCharIndex + 1)
      		}
    	} else {
      		setErrorCount(errorCount + 1)
    	}
  	}

    function calcAccuracy(): Number {
    	let totalChars = textData.content.length;
    	return 100 - (errorCount / totalChars * 100);
  	}

	return (
		<>
			<h3>{textData.title}</h3>
			<h4>{textData.content}</h4>
        	<TextInput 
          		placeholder="Write in the text" 
          		onChange={e => {
            		setUserInput(e.target.value)
            		checkText(e.target.value)
          	}} 
          	value={userInput} />
        	{gameFinished 
        		? <Alert variant="light" color="blue" title="Game finished!" style={{marginTop: '1em'}}>
            		<h3>Words typed: {wordCount}</h3>
            		<h3>Errors: {errorCount}</h3>
            		<h3>Accuracy: {calcAccuracy()} %</h3>
          		  </Alert>
          		: ""
          	}
          </>
        )
}