import  { useState } from 'react';
import {
    useColorModeValue,
    useToast, Box, VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button,Heading
} from '@chakra-ui/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase'; // Firestore config
import { Eye, EyeOff } from 'lucide-react';
function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const handleSignIn = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Sign in the user with email and password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch the user's role from Firestore based on their email
            const userDocRef = doc(db, 'users', user.uid); // Assuming 'users' collection with uid as document ID
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const isAdmin = userData.isAdmin; // Check isAdmin field from Firestore


                navigate('/')

                // Show success toast
                toast({
                    title: `Welcome ${userData.displayName}!`,
                    description: `You are signed in as ${isAdmin ? 'Admin' : 'User'}`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                throw new Error('Invalid username or password');
            }
        } catch (error) {
            // Display error toast
            toast({
                title: 'Error signing in',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };
    const bgColor = useColorModeValue('white', 'gray.700');
    const textColor = useColorModeValue('gray.900', 'white');


    return (
        <Box
            minHeight="100vh"
            width="100vw"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={useColorModeValue('gray.50', 'gray.800')}
        >
            <Box
                maxWidth="400px"
                width="100%"
                bg={bgColor}
                p={8}
                borderRadius="xl"
                boxShadow="lg"
                textAlign="center"
            >
                <VStack spacing={8} as="form" onSubmit={handleSignIn}>
                    <Heading size="xl" color={textColor}>
                        Sign In
                    </Heading>
                    <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <InputGroup>
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                            <InputRightElement width="3rem">
                                <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <Button
                        type="submit"
                        colorScheme="blue"
                        width="full"
                        isLoading={isLoading}
                        loadingText="Signing In"
                    >
                        Sign In
                    </Button>
                </VStack>
            </Box>
        </Box>
    );
}

export default SignIn;
