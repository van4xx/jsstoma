import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  useColorModeValue,
  Center,
  Alert,
  AlertIcon,
  FormErrorMessage,
  Image,
  Container,
} from '@chakra-ui/react';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated, isAdmin, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const { username, password } = formData;
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Clear errors when unmounting
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear field error when typing
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    if (!username.trim()) {
      errors.username = 'Имя пользователя обязательно';
    }
    if (!password) {
      errors.password = 'Пароль обязателен';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    const success = await login(username, password);
    setIsSubmitting(false);
    
    if (success) {
      navigate('/');
    }
  };
  
  return (
    <Box 
      minH="100vh" 
      bg={useColorModeValue('gray.50', 'gray.800')}
      py={12}
    >
      <Container maxW="lg">
        <Center mb={8}>
          <Heading fontSize="3xl" textAlign="center">Clinic Price Manager</Heading>
        </Center>
        
        <Box
          bg={useColorModeValue('white', 'gray.700')}
          rounded="lg"
          shadow="lg"
          p={8}
        >
          <Stack spacing={6}>
            <Center>
              <Heading size="lg">Вход в систему</Heading>
            </Center>
            
            {error && (
              <Alert status="error" rounded="md">
                <AlertIcon />
                {error}
              </Alert>
            )}
            
            <form onSubmit={onSubmit}>
              <Stack spacing={4}>
                <FormControl id="username" isRequired isInvalid={!!formErrors.username}>
                  <FormLabel>Имя пользователя</FormLabel>
                  <Input
                    type="text"
                    name="username"
                    value={username}
                    onChange={onChange}
                    size="lg"
                    bg={useColorModeValue('white', 'gray.700')}
                    borderColor={useColorModeValue('gray.300', 'gray.600')}
                    _focus={{
                      borderColor: 'brand.500',
                      boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                    }}
                  />
                  <FormErrorMessage>{formErrors.username}</FormErrorMessage>
                </FormControl>
                
                <FormControl id="password" isRequired isInvalid={!!formErrors.password}>
                  <FormLabel>Пароль</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    size="lg"
                    bg={useColorModeValue('white', 'gray.700')}
                    borderColor={useColorModeValue('gray.300', 'gray.600')}
                    _focus={{
                      borderColor: 'brand.500',
                      boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                    }}
                  />
                  <FormErrorMessage>{formErrors.password}</FormErrorMessage>
                </FormControl>
                
                <Button
                  colorScheme="brand"
                  bg="brand.500"
                  color="white"
                  _hover={{
                    bg: 'brand.600',
                  }}
                  size="lg"
                  type="submit"
                  isLoading={isSubmitting}
                  w="100%"
                  mt={4}
                >
                  Войти
                </Button>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Login; 