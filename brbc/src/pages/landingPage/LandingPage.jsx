import React from 'react'
import { Container, Typography, Button } from '@mui/material';
import '../landingPage/landingPage.scss'

const LandingPage = () => {
  return (
    <div>
      <Container className='landingPage' maxWidth='md'>
        <Typography className='h2' gutterBottom align='center'>
            BRBC Conference 2025
        </Typography>

        <Typography variant='body1' align='center' paragraph>
            Join us in worship
        </Typography>

        <div className='actions'>
            <Button variant='contained' color='primary' size='large'>
                Register Now
            </Button>
        </div>

      </Container>
    </div>
  )
}

export default LandingPage
