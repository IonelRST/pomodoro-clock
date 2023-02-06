import { FaArrowDown, FaArrowUp, FaPlay, FaPause, FaSync } from 'react-icons/fa'
import React, { useState, useEffect, useRef } from 'react'

function App () {
  const [breakLength, setBreakLength] = useState(59)
  const [sessionLength, setSessionLength] = useState(25)
  const [breakTime, setBreakTime] = useState(false)

  const [timer, setTimer] = useState(25 * 60) // 25 minutes
  const [start, setStart] = useState(false)

  const firstStart = useRef(true)
  const tick = useRef() // <-- React ref

  useEffect(() => {
    if (firstStart.current) {
      firstStart.current = !firstStart.current
      return
    }

    if (start && timer > -1) {
      tick.current = setInterval(() => {
        // <-- set tick ref current value
        setTimer(timer => timer - 1)
      }, 1000)
    } else if (start && timer < 0) {
      document.getElementById('beep').play()
      if (!breakTime) {
        setTimer(breakLength * 60)
        setBreakTime(true)
      } else {
        setTimer(sessionLength * 60)
        setBreakTime(false)
      }
    } else {
      clearInterval(tick.current) // <-- access tick ref current value
    }

    return () => clearInterval(tick.current) // <-- clear on unmount!
  }, [start, timer])

  const toggleStart = () => {
    setStart(!start)
  }

  const resetTimer = () => {
    if (firstStart.current) {
      firstStart.current = !firstStart.current
      return
    }
    document.getElementById('beep').pause()
    setBreakTime(false)
    setStart(false)
    setTimer(sessionLength * 60)
    setBreakLength(5*60)
    setSessionLength(25*60)
  }

  const dispSecondsAsMins = seconds => {
    const mins = Math.floor(seconds / 60)
    const seconds_ = seconds % 60
    return (
      (mins === 0
        ? '00'
        : mins < 10
        ? '0' + mins.toString()
        : mins.toString() )+
      ':' +
      (seconds_ === 0
        ? '00'
        : seconds_ < 10
        ? '0' + seconds_.toString()
        : seconds_.toString())
    )
  }

  const updateLenght = id => {
    switch (id) {
      case 'break-increment':
        if(breakLength <= 1 || breakLength > 59) return 
        setBreakLength(breakLength + 1)
        break
      case 'break-decrement':
        if(breakLength <= 1 || breakLength > 59) return 
        setBreakLength(breakLength - 1)
        break
      case 'session-increment':
        if(sessionLength <= 1 || sessionLength > 59) return 
        setSessionLength(sessionLength + 1)
        setTimer((Number(sessionLength) + 1) * 60)
        break
      case 'session-decrement':
        if(sessionLength <= 1 || sessionLength > 59) return 
        setSessionLength(sessionLength - 1)
        setTimer(Number(sessionLength - 1) * 60)
        break
      default:
        break
    }
  }

  return (
    <div className='clock-container'>
      <audio
        id='beep'
        preload='auto'
        src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'
      ></audio>
      <h1>25 + 5 Clock</h1>
      <div className='clock-settings'>
        <div className='clock-setting'>
          <h3 id='break-label'>Break Length</h3>
          <div className='control'>
            <FaArrowDown
              id='break-decrement'
              onClick={e => {
                updateLenght(e.target.id)
              }}
            />
            <h3 id='break-length'>{breakLength}</h3>
            <FaArrowUp
              id='break-increment'
              onClick={e => {
                updateLenght(e.target.id)
              }}
            />
          </div>
        </div>
        <div className='clock-setting'>
          <h3 id='session-label'>Session Length</h3>
          <div className='control'>
            <FaArrowDown
              id='session-decrement'
              onClick={e => {
                updateLenght(e.target.id)
              }}
            />
            <h3 id='session-length'>{sessionLength}</h3>
            <FaArrowUp
              id='session-increment'
              onClick={e => {
                updateLenght(e.target.id)
              }}
            />
          </div>
        </div>
      </div>
      <div className='timer'>
        <h1 id='timer-label'>{breakTime ? "Break" : "Session"}</h1>
        <h1 id='time-left'>{dispSecondsAsMins(timer)}</h1>
      </div>
      <div className='buttons'>
        <div id='start_stop' onClick={toggleStart}>
          <FaPlay />
          <FaPause />
        </div>
        <FaSync id='reset' onClick={resetTimer} />
      </div>
    </div>
  )
}

export default App
