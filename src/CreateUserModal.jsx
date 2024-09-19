import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    VStack,
    useToast,
} from '@chakra-ui/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import {auth, db} from "./firebase.js";


function CreateUserModal({ isOpen, onClose, refreshUsers }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                email,
                displayName,
                isAdmin,
            });

            toast({
                title: 'User created successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            refreshUsers();
            onClose();
        } catch (error) {
            toast({
                title: 'Error creating user',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create New User</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleCreateUser}>
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Display Name</FormLabel>
                                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                            </FormControl>
                            <Checkbox isChecked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)}>
                                Is Admin
                            </Checkbox>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit" colorScheme="blue" mr={3} isLoading={isLoading}>
                            Create User
                        </Button>
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}

export default CreateUserModal;