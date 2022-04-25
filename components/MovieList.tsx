import { Card } from './Card'
import { FC, useEffect, useState } from 'react'
import { Movie } from '../models/Movie'

const MOVIE_REVIEW_PROGRAM_ID = '4X5hVHsHeGHjLEB9hrUqQ57sEPcYPPfW54fndmQrsgCF'

export const MovieList: FC = () => {
    const [movies, setMovies] = useState<Movie[]>([])

    useEffect(() => {
        setMovies(Movie.mocks)
    }, [])
    
    return (
        <div>
            {
                movies.map((movie, i) => {
                    return (
                        <Card key={i} movie={movie} />
                    )
                })
            }
        </div>
    )
}