import { FC } from 'react'
import { Movie } from '../models/Movie'
import { Update } from "../models/Update";
import { useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Textarea, Switch } from '@chakra-ui/react'
import * as web3 from '@solana/web3.js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

const MOVIE_REVIEW_PROGRAM_ID = "BNU4WMofFddN8wTKGSm67wapnHfnBqx8BQDZswZwZTf3";

export const Form: FC = () => {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [toggle, setToggle] = useState(true);

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (toggle == true) {
      const movie = new Movie(title, rating, description);
      handleTransactionSubmit(movie);
    } else {
      const movie = new Update(title, rating, description);
      handleUpdateTransactionSubmit(movie);
    }
  };

  const handleTransactionSubmit = async (movie: Movie) => {
    if (!publicKey) {
      alert("Please connect your wallet!");
      return;
    }

    const buffer = movie.serialize();
    const transaction = new web3.Transaction();

    const [pda] = await web3.PublicKey.findProgramAddress(
      [publicKey.toBuffer(), Buffer.from(movie.title)], // new TextEncoder().encode(movie.title)],
      new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
    );

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
          isWritable: true,
        },
        {
          pubkey: web3.SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: buffer,
      programId: new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID),
    });

    transaction.add(instruction);

    try {
      let txid = await sendTransaction(transaction, connection);
      alert(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      );
      console.log(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      );
    } catch (e) {
      console.log(JSON.stringify(e));
      alert(JSON.stringify(e));
    }
  };

  const handleUpdateTransactionSubmit = async (movie: Update) => {
    if (!publicKey) {
      alert("Please connect your wallet!");
      return;
    }

    const buffer = movie.serialize();
    const transaction = new web3.Transaction();

    const [pda] = await web3.PublicKey.findProgramAddress(
      [publicKey.toBuffer(), Buffer.from(movie.title)], // new TextEncoder().encode(movie.title)],
      new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
    );

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
          isWritable: true,
        },
        {
          pubkey: web3.SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: buffer,
      programId: new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID),
    });

    const updateInstruction = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: publicKey,
          isSigner: true,
          isWritable: false,
        },
        {
          pubkey: pda,
          isSigner: false,
          isWritable: true,
        },
      ],
      data: buffer,
      programId: new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID),
    });

    transaction.add(updateInstruction);

    try {
      let txid = await sendTransaction(transaction, connection);
      alert(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      );
      console.log(
        `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
      );
    } catch (e) {
      console.log(JSON.stringify(e));
      alert(JSON.stringify(e));
    }
  };

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
          <FormLabel color="gray.200">Movie Title</FormLabel>
          <Input
            id="title"
            color="gray.400"
            onChange={(event) => setTitle(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel color="gray.200">Add your review</FormLabel>
          <Textarea
            id="review"
            color="gray.400"
            onChange={(event) => setDescription(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel color="gray.200">Rating</FormLabel>
          <NumberInput
            // max={100}
            // min={0}
            onChange={(valueString) => setRating(parseInt(valueString))}
          >
            <NumberInputField id="amount" color="gray.400" />
            <NumberInputStepper color="gray.400">
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl display="center" alignItems="center">
          <FormLabel color="gray.100" mt={2}>
            Update
          </FormLabel>
          <Switch
            id="update"
            onChange={(event) => setToggle((prevCheck) => !prevCheck)}
          />
        </FormControl>
        <Button width="full" mt={4} type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
};