import {
    Button,
    Center,
    HStack,
    Input,
    Spacer,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Stack,
    FormControl,
} from "@chakra-ui/react"
import { FC, useState } from "react"
import { CommentCoordinator } from "../coordinators/CommentCoordinator"
import { Movie } from "../models/Movie"

interface CommentListProps {
    movie: Movie
}

export const CommentList: FC<CommentListProps> = ({
    movie,
}: CommentListProps) => {
    const [page, setPage] = useState(1)

    return (
        <div>
            <Stack>
                <Center>
                    <HStack w="full" mt={2} mb={8} ml={4} mr={4}>
                        {page > 1 && (
                            <Button onClick={() => setPage(page - 1)}>
                                Previous
                            </Button>
                        )}
                        <Spacer />
                        {CommentCoordinator.commentCount > page * 5 && (
                            <Button onClick={() => setPage(page + 1)}>
                                Next
                            </Button>
                        )}
                    </HStack>
                </Center>
            </Stack>
        </div>
    )
}
