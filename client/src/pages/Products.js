import React, { useState, useEffect, useContext } from 'react';
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
  InputGroup,
  InputLeftElement,
  Input,
  useColorModeValue,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Badge,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Не удалось загрузить прайс-лист');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      (product.code && product.code.toLowerCase().includes(searchLower)) ||
      (product.description && product.description.toLowerCase().includes(searchLower))
    );
  });

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
      <Heading size="lg" mb={2}>Прайс-лист</Heading>
      <Text mb={6} color="gray.600">Ваш персональный прайс-лист товаров и услуг</Text>

      {error && (
        <Alert status="error" mb={4} rounded="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Box mb={6}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Поиск по названию, коду или описанию"
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
      >
        <Table variant="simple" bg={tableBg}>
          <Thead>
            <Tr>
              <Th>Код</Th>
              <Th>Название</Th>
              <Th>Описание</Th>
              <Th isNumeric>Цена (₽)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <Tr key={product._id}>
                  <Td fontFamily="mono">{product.code || '-'}</Td>
                  <Td fontWeight="medium">{product.name}</Td>
                  <Td>{product.description || '-'}</Td>
                  <Td isNumeric fontWeight="bold">
                    {product.price !== null ? (
                      `₽${product.price.toLocaleString()}`
                    ) : (
                      <Badge colorScheme="red">Не установлена</Badge>
                    )}
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
  );
};

export default Products; 