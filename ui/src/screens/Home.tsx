import React from 'react'
import styled from 'styled-components'
import Sound from 'react-sound'
import { navigate } from '@reach/router'
import { Button } from 'nes-react'
import { RouteComponentProps } from '@reach/router'

const NesButton = Button as any

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Home: React.FC<RouteComponentProps> = () => {
  const [isButtonPressed, setIsButtonPressed] = React.useState(false)
  const [isButtonReleased, setIsButtonReleased] = React.useState(false)

  function pressButton() {
    setIsButtonPressed(true)
    setTimeout(() => {
      setIsButtonPressed(false)
    }, 300)
  }

  function releaseButton() {
    setIsButtonReleased(true)
    setTimeout(() => {
      navigate('/pokemon')
    }, 300)
    setTimeout(() => {
      setIsButtonReleased(false)
    }, 300)
  }

  return (
    <Container>
      <h1>Welcome to your Pokédex!</h1>
      <NesButton onMouseDown={pressButton} onMouseUp={releaseButton}>
        Click to Start
      </NesButton>
      <Sound
        url="/audio/clickPress.mp3"
        playStatus={isButtonPressed ? 'PLAYING' : 'STOPPED'}
        autoLoad={true}
        volume={50}
      />
      <Sound
        url="/audio/clickRelease.mp3"
        playStatus={isButtonReleased ? 'PLAYING' : 'STOPPED'}
        autoLoad={true}
        volume={50}
      />
    </Container>
  )
}

export default Home
