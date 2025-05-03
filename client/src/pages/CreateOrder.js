import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  IconButton,
  Flex,
  Stack,
  Divider,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
  useToast,
  Spinner,
  Center,
  InputGroup,
  InputLeftElement,
  Badge,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import axios from 'axios';

const CreateOrder = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  
  const navigate = useNavigate();
  const toast = useToast();

  // Fetch available products with prices
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        // Filter out products without prices
        setProducts(res.data.filter(p => p.price !== null));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить товары',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // Filter products based on search
  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      (product.code && product.code.toLowerCase().includes(searchLower)) ||
      (product.description && product.description.toLowerCase().includes(searchLower))
    );
  });

  // Add product to cart
  const addToCart = (product) => {
    // Check if product is already in cart
    const existingItem = cart.find(item => item.productId === product._id);
    
    if (existingItem) {
      // Update quantity if already in cart
      setCart(cart.map(item =>
        item.productId === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Add new item to cart
      setCart([...cart, {
        productId: product._id,
        name: product.name,
        code: product.code,
        price: product.price,
        quantity: 1
      }]);
    }
    
    toast({
      title: 'Товар добавлен',
      description: `${product.name} добавлен в заказ`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  // Update item quantity in cart
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(cart.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  // Calculate total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Submit order
  const handleSubmit = async () => {
    if (cart.length === 0) {
      toast({
        title: 'Ошибка',
        description: 'Заказ не может быть пустым',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSubmitting(true);
    
    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        notes: notes.trim() || undefined
      };
      
      const res = await axios.post('/api/orders', orderData);
      
      toast({
        title: 'Заказ создан',
        description: `Заказ #${res.data.orderNumber} успешно создан`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      navigate(`/orders/${res.data._id}`);
    } catch (err) {
      console.error('Error creating order:', err);
      toast({
        title: 'Ошибка',
        description: err.response?.data?.message || 'Не удалось создать заказ',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setSubmitting(false);
    }
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    onClose();
  };

  const tableBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (loading) {
    return (
      <Center h="calc(100vh - 100px)">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    );
  }

  return (
    <Box>
      <Heading size="lg" mb={2}>Создание заказа</Heading>
      <Text mb={6} color="gray.600">Выберите товары из прайс-листа и укажите количество</Text>

      <Flex 
        direction={{ base: 'column', lg: 'row' }} 
        gap={6}
      >
        {/* Products list */}
        <Box flex={1}>
          <Box mb={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Поиск товаров"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg="white"
                borderRadius="md"
              />
            </InputGroup>
          </Box>

          <TableContainer
            border="1px"
            borderColor={borderColor}
            borderRadius="lg"
            boxShadow="sm"
            maxH="600px"
            overflowY="auto"
          >
            <Table variant="simple" bg={tableBg} size="sm">
              <Thead position="sticky" top={0} bg={tableBg} zIndex={1}>
                <Tr>
                  <Th>Код</Th>
                  <Th>Название</Th>
                  <Th isNumeric>Цена (₽)</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <Tr key={product._id}>
                      <Td fontFamily="mono">{product.code || '-'}</Td>
                      <Td>
                        <Text fontWeight="medium">{product.name}</Text>
                        {product.description && (
                          <Text fontSize="xs" color="gray.500">{product.description}</Text>
                        )}
                      </Td>
                      <Td isNumeric fontWeight="bold">₽{product.price.toLocaleString()}</Td>
                      <Td textAlign="right">
                        <IconButton
                          icon={<AddIcon />}
                          size="sm"
                          colorScheme="brand"
                          variant="ghost"
                          onClick={() => addToCart(product)}
                          aria-label="Add to cart"
                        />
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={4} textAlign="center" py={4}>
                      {searchTerm ? 'Не найдено товаров по вашему запросу' : 'Нет доступных товаров'}
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        {/* Order summary */}
        <Box 
          width={{ base: '100%', lg: '400px' }}
          bg={tableBg}
          p={4}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
          boxShadow="sm"
        >
          <Heading size="md" mb={4}>Заказ</Heading>
          
          {cart.length > 0 ? (
            <>
              <Box maxH="300px" overflowY="auto" mb={4}>
                {cart.map(item => (
                  <Flex 
                    key={item.productId} 
                    justify="space-between" 
                    align="center"
                    py={2}
                    borderBottom="1px"
                    borderColor={borderColor}
                  >
                    <Box flex={1}>
                      <Text fontWeight="medium">{item.name}</Text>
                      <Flex justify="space-between" align="center">
                        <Text fontSize="sm" color="gray.500">
                          {item.code || 'Без кода'} • ₽{item.price.toLocaleString()}
                        </Text>
                        <Text fontWeight="bold">
                          ₽{(item.price * item.quantity).toLocaleString()}
                        </Text>
                      </Flex>
                    </Box>
                    <Flex ml={4} align="center">
                      <NumberInput
                        size="sm"
                        maxW={20}
                        min={1}
                        value={item.quantity}
                        onChange={(_, value) => updateQuantity(item.productId, value)}
                        mr={2}
                      >
                        <NumberInputField textAlign="center" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => removeFromCart(item.productId)}
                        aria-label="Remove from cart"
                      />
                    </Flex>
                  </Flex>
                ))}
              </Box>

              <Divider my={3} />
              
              <Flex justify="space-between" fontWeight="bold" fontSize="lg" mb={4}>
                <Text>Итого:</Text>
                <Text>₽{calculateTotal().toLocaleString()}</Text>
              </Flex>
              
              <FormControl mb={4}>
                <FormLabel fontSize="sm">Примечания к заказу</FormLabel>
                <Textarea
                  placeholder="Дополнительная информация"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  size="sm"
                  rows={3}
                />
              </FormControl>
              
              <Stack spacing={3}>
                <Button
                  colorScheme="brand"
                  size="md"
                  w="100%"
                  onClick={handleSubmit}
                  isLoading={submitting}
                >
                  Оформить заказ
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  w="100%"
                  onClick={onOpen}
                >
                  Очистить заказ
                </Button>
              </Stack>
            </>
          ) : (
            <Box textAlign="center" py={10}>
              <Text color="gray.500" mb={4}>Ваш заказ пуст</Text>
              <Text fontSize="sm">
                Добавьте товары в заказ из прайс-листа
              </Text>
            </Box>
          )}
        </Box>
      </Flex>

      {/* Clear cart confirmation dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Очистить заказ
            </AlertDialogHeader>

            <AlertDialogBody>
              Вы уверены? Эта операция удалит все товары из текущего заказа.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Отмена
              </Button>
              <Button colorScheme="red" onClick={clearCart} ml={3}>
                Очистить
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default CreateOrder; 