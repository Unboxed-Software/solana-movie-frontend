
import { Center, Box, Heading } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { AppBar } from '../components/AppBar'
import { Card } from '../components/Card'
import { Form } from '../components/Form'
import { Movie } from '../models/Movie'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const movies = Movie.mocks()
  return (
    <div className={styles.App}>
      <AppBar />

      <Center>
        <Box>
          <Heading as="h1" size="l" color="white" ml={4} mt={8}>
            Add a review
          </Heading>
          <Form />
          <Heading as="h1" size="l" color="white" ml={4} mt={8}>
            Existing Reviews
          </Heading>
          {
            movies.map((movie, i) => {
              return (
                <Card key={i} movie={movie} />
              )
            })
          }
        </Box>
      </Center>
    </div>
  )
}

export default Home
