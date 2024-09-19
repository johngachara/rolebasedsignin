import { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import {collection, getDocs, doc, updateDoc, deleteDoc, getDoc} from 'firebase/firestore';
import { db } from "./firebase.js";
import { useNavigate } from 'react-router-dom';
import CreateUserModal from "./CreateUserModal.jsx";
import EditUserModal from "./EditUserModal.jsx";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function AdminPage() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(null); // Add state to track admin status

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
            if (user) {
                try {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);
                    const userData = userDoc.data();

                    if (userData && userData.isAdmin) {
                        setIsAdmin(true);
                        fetchUsers();
                    } else {
                        setIsAdmin(false);
                        toast({
                            title: 'Access Denied',
                            description: 'You do not have permission to access this page.',
                            status: 'error',
                            duration: 3000,
                            isClosable: true,
                        });
                        navigate('/');
                    }
                } catch (error) {
                    toast({
                        title: 'Error fetching user data',
                        description: error.message,
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                    navigate('/'); // Redirect on error
                }
            } else {
                navigate('/'); // Redirect if no user is logged in
            }
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, [navigate, toast]);

    const fetchUsers = async () => {
        try {
            const usersCollection = collection(db, 'users');
            const userSnapshot = await getDocs(usersCollection);
            const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(userList);
        } catch (error) {
            toast({
                title: 'Error fetching users',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleCreateUser = () => {
        onCreateOpen();
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        onEditOpen();
    };

    const handleUpdateUser = async (userId, updatedData) => {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, updatedData);
            await fetchUsers(); // Refresh the user list
            onEditClose();
            toast({
                title: 'User updated successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error updating user',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteDoc(doc(db, 'users', userId));
                await fetchUsers();
                toast({
                    title: 'User deleted successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } catch (error) {
                toast({
                    title: 'Error deleting user',
                    description: error.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    };

    if (isAdmin === null) {
        return null; // Optionally show a loading spinner or similar
    }

    return (
        <Box width="100vw" display="flex"  justifyContent="center" margin="auto" mt={8}>
            <VStack spacing={6} align="stretch">
                <Heading as="h1" size="xl">Admin Panel</Heading>
                <Button onClick={handleCreateUser} colorScheme="green">Create New User</Button>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Email</Th>
                            <Th>Display Name</Th>
                            <Th>Role</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {users.map((user) => (
                            <Tr key={user.id}>
                                <Td>{user.email}</Td>
                                <Td>{user.displayName}</Td>
                                <Td>{user.isAdmin ? 'Admin' : 'User'}</Td>
                                <Td>
                                    <Button onClick={() => handleEditUser(user)} mr={2}>Edit</Button>
                                    <Button onClick={() => handleDeleteUser(user.id)} colorScheme="red">Delete</Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </VStack>

            <CreateUserModal isOpen={isCreateOpen} onClose={onCreateClose} refreshUsers={fetchUsers} />
            <EditUserModal isOpen={isEditOpen} onClose={onEditClose} onUpdate={handleUpdateUser} user={selectedUser} refreshUsers={fetchUsers} />
        </Box>
    );
}

export default AdminPage;
