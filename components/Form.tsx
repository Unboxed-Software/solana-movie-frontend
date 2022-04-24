import { FC } from 'react';
import { Movie } from '../models/Movie';
import { useState } from 'react';
import * as web3 from '@solana/web3.js'
import { Box, Button, FormControl, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Textarea } from '@chakra-ui/react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const MOVIE_REVIEW_PROGRAM_ID = '4X5hVHsHeGHjLEB9hrUqQ57sEPcYPPfW54fndmQrsgCF'

export const Form: FC = () => {
    const [title, setTitle] = useState('')
    const [rating, setRating] = useState(0)
    const [message, setMessage] = useState('')

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const handleSubmit = (event: any) => {
        event.preventDefault()
        const movie = new Movie(title, rating, message)
        handleTransactionSubmit(movie)
    }

    const handleTransactionSubmit = async (movie: Movie) => {
        if (!publicKey) {
            alert('Please connect your wallet!')
            return
        }

        const buffer = movie.serialize()
        console.log(buffer)
        const pda = (await web3.PublicKey.findProgramAddress(
            [publicKey.toBuffer()],
            new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
          ))[0]
        const transaction = new web3.Transaction()
        const instruction = new web3.TransactionInstruction({
            keys: [
                {
                    pubkey: publicKey,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: pda,
                    isSigner: false,
                    isWritable: true
                },
                {
                    pubkey: web3.SystemProgram.programId,
                    isSigner: false,
                    isWritable: false
                }
            ],
            data: buffer,
            programId: new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
        })

        transaction.add(instruction)

        try {
            let txid = await sendTransaction(transaction, connection)
            console.log(txid)
        } catch (e) {
            alert(JSON.stringify(e))
        }
    }

    return (
        <Box
            p={4}
            display={{ md: "flex" }}
            maxWidth="32rem"
            borderWidth={1}
            margin={2}
            justifyContent="center"
        >
            <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                    <FormLabel color='gray.200'>
                        Movie Title
                        </FormLabel>
                    <Input 
                    id='title' 
                    color='gray.400'
                    onChange={event => setTitle(event.currentTarget.value)}
                />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel color='gray.200'>
                        Add your review
                        </FormLabel>
                    <Textarea 
                        id='review' 
                        color='gray.400'
                        onChange={event => setMessage(event.currentTarget.value)}
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel color='gray.200'>
                        Rating
                        </FormLabel>
                    <NumberInput 
                        max={5} 
                        min={1} 
                        onChange={(valueString) => setRating(parseInt(valueString))}
                    >
                        <NumberInputField id='amount' color='gray.400' />
                        <NumberInputStepper color='gray.400'>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </FormControl>
                <Button width="full" mt={4} type="submit">
                    Submit Review
                </Button>
            </form>
        </Box>
    );
}