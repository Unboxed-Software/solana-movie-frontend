import { Card } from './Card'
import { FC, useEffect, useState } from 'react'
import { Movie } from '../models/Movie'
import * as web3 from '@solana/web3.js'
import { useConnection } from "@solana/wallet-adapter-react"

const MOVIE_REVIEW_PROGRAM_ID = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN'

export const MovieList: FC = () => {
  const { connection } = useConnection()
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    connection.getParsedAccountInfo
    connection.getProgramAccounts(new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)).then(async (accounts) => {
        const movies: Movie[] = accounts.reduce((acc :Movie[] , { account }) => {
        console.log(account);
        const movie = Movie.deserialize(account.data)
            if (!movie) return acc;
            return [...acc,movie]
      },[]);
      setMovies(movies)
    })
  }, [])

  return (
    <div>
      {
        movies.map((movie, i) => <Card key={i} movie={movie} /> )
      }
    </div>
  )
}