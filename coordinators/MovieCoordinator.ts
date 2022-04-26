import bs58 from 'bs58'
import * as web3 from '@solana/web3.js'
import { Movie } from '../models/Movie'

const MOVIE_REVIEW_PROGRAM_ID = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN'

export class MovieCoordinator {
    static accounts: web3.PublicKey[] = []
    static get accountTotal() {
        return this.accounts.length
    }

    static async preFetchAccounts(connection: web3.Connection, filters: AccountFilter[]) {
        const accounts = await connection.getProgramAccounts(
            new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID),
            {
                dataSlice: { offset: 0, length: 18 },
                filters: filters.map(filter => filter.rpcFilter)
            }
        )

        accounts.sort( (a, b) => {
            return a.account.data.slice(6, 6 + a.account.data[2]).compare(b.account.data.slice(6, 6 + b.account.data[2]))
        })

        this.accounts = accounts.map(account => account.pubkey)
    }

    static async fetchPage(connection: web3.Connection, page: number, perPage: number, filters: AccountFilter[] = [], reload: boolean = false): Promise<Movie[]> {
        if (this.accountTotal === 0 || reload) {
            await this.preFetchAccounts(connection, filters)
        }

        const paginatedPublicKeys = this.accounts.slice(
            (page - 1) * perPage,
            page * perPage,
        )

        if (paginatedPublicKeys.length === 0) {
            return []
        }

        const accounts = await connection.getMultipleAccountsInfo(paginatedPublicKeys)

        const movies = accounts.reduce((accum: Movie[], account) => {
            const movie = Movie.deserialize(account?.data)
            if (!movie) {
                return accum
            }

            return [...accum, movie]
        }, [])

        return movies
    }
}

interface AccountFilter {
    rpcFilter: web3.GetProgramAccountsFilter
}

export class MovieTitleFilter implements AccountFilter {
    rpcFilter: web3.GetProgramAccountsFilter;

    constructor(title: string) {
        this.rpcFilter = { memcmp: { offset: 6, bytes: bs58.encode(Buffer.from(title))}}
    }
}

export class MovieRatingFilter {
    rpcFilter: web3.GetProgramAccountsFilter;

    constructor(rating: number) {
        this.rpcFilter = {
            memcmp: {
                offset: 1,
                bytes: bs58.encode([rating])
            }
        }
    }
}