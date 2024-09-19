import  { useEffect, useState } from 'react';
import {Box, VStack, Heading, Text, Button, useBreakpointValue, Center} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { doc, getDoc } from 'firebase/firestore';
import {auth, db} from "./firebase.js";

function UserPage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                const userData = userDoc.data();
                setUser({ ...currentUser, ...userData });
            } else {
                setUser(null);
              navigate('/Signin')
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleSignOut = () => {
        auth.signOut();
    };

    const handleAdminPanel = () => {
     navigate('/Admin')
    };


    const boxPadding = useBreakpointValue({ base: '4', md: '8' });
    const headingSize = useBreakpointValue({ base: 'xl', md: '2xl' });
    const textSize = useBreakpointValue({ base: 'md', md: 'xl' });
    if (!user) return null;



    return (
        <Center h="100vh" width="100vw" bg="gray.100">
            <Box
                bg="white"
                maxWidth="50%"
                w="100%"
                p={boxPadding}
                boxShadow="lg"
                borderRadius="md"
                textAlign="center"
            >
                <VStack spacing={6}>
                    <Heading as="h1" size={headingSize}>
                        Welcome to My App
                    </Heading>
                    <Text fontSize={textSize}>
                        Hello, {user.displayName || user.email}!
                    </Text>
                    {user.isAdmin && (
                        <Button onClick={handleAdminPanel} colorScheme="blue" w="full">
                            Go to Admin Panel
                        </Button>
                    )}
                    <Button onClick={handleSignOut} colorScheme="red" w="full">
                        Sign Out
                    </Button>
                </VStack>
            </Box>
        </Center>
    );
}

export default UserPage;