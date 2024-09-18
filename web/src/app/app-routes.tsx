import { Center, Box, Heading } from '@chakra-ui/react';
import { Navigate, useRoutes } from 'react-router-dom';
import { MovieList } from './components/MovieList';
import { Form } from './components/Form';

export function AppRoutes() {
  return useRoutes([
    { index: true, element: <Navigate replace to="/home" /> },
    {
      path: '/home',
      element: (
        <Home />
      ),
    },

  ]);
}


const Home = () => {
  return (
    <div className={"App"}>
      <Center>
        <Box>
          <Heading as="h1" size="lg" color="white" ml={4} mt={8}>
            Add a review
          </Heading>

          <Form />
          <Heading as="h1" size="l" color="white" ml={4} mt={8}>
            Existing Reviews
          </Heading>
          <MovieList />
        </Box>
      </Center>
    </div>
  )
}