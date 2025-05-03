import React, { useEffect, useState, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Card,
  CardHeader,
  CardBody,
  Button,
  Flex,
  Icon,
  Divider,
  useColorModeValue,
  Spinner,
  Center,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  VStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  IconButton,
  InputGroup,
  InputLeftElement,
  Spacer,
  Tooltip,
  Container,
  useToast,
  Image,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useBreakpointValue,
  Tfoot,
} from '@chakra-ui/react';
import { 
  FiShoppingCart, 
  FiDollarSign, 
  FiAlertCircle, 
  FiUser, 
  FiPackage, 
  FiLogOut, 
  FiSearch, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiCornerDownRight, 
  FiCheck, 
  FiX,
  FiClock,
  FiEye,
  FiMessageSquare,
  FiPhone,
  FiMail,
  FiMenu,
  FiHome,
  FiSettings,
  FiBarChart2,
  FiArrowRight
} from 'react-icons/fi';
import API from '../utils/api';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { user, isAdmin, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen: isMobileMenuOpen, onOpen: onMobileMenuOpen, onClose: onMobileMenuClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: "Вы вышли из системы",
      status: "info",
      duration: 3000,
      isClosable: true,
      position: "top-right"
    });
  };
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const sidebarBg = useColorModeValue('white', 'gray.800');
  const activeBg = useColorModeValue('brand.50', 'brand.900');
  const activeColor = useColorModeValue('brand.600', 'brand.200');
  
  // Load data based on active tab
  useEffect(() => {
    setLoading(false);
  }, [activeTab]);

  const menuItems = isAdmin ? [
    { icon: FiHome, label: 'Панель управления', index: 0 },
    { icon: FiUser, label: 'Клиники', index: 1 },
    { icon: FiPackage, label: 'Товары', index: 2 },
    { icon: FiShoppingCart, label: 'Заказы', index: 3 },
  ] : [
    { icon: FiHome, label: 'Панель управления', index: 0 },
    { icon: FiPackage, label: 'Прайс-лист', index: 1 },
    { icon: FiShoppingCart, label: 'Заказы', index: 2 },
    { icon: FiPlus, label: 'Создать заказ', index: 3 },
  ];
  
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Header */}
      <Flex 
        as="header"
        bg={cardBg} 
        p={4} 
        shadow="md" 
        justify="space-between"
        align="center"
        position="sticky"
        top={0}
        zIndex={10}
        borderBottomWidth="1px" 
        borderColor={borderColor}
      >
        <Flex align="center">
          {isMobile && (
            <IconButton
              icon={<FiMenu />}
              aria-label="Open menu"
              mr={4}
              variant="ghost"
              onClick={onMobileMenuOpen}
            />
          )}
          <Heading size="lg" color="brand.500" letterSpacing="tight" fontWeight="extrabold">
            Dental Lab
          </Heading>
        </Flex>
        
        <HStack spacing={4}>
          <Flex align="center" color={useColorModeValue('gray.600', 'gray.300')}>
            <Icon as={FiUser} mr={2} />
            <Text fontWeight="medium">{user?.username}</Text>
          </Flex>
          <Menu>
            <MenuButton 
              as={Avatar}
              size="sm"
              bg="brand.500"
              color="white"
              cursor="pointer"
              _hover={{ transform: 'scale(1.05)', boxShadow: 'md' }}
              transition="all 0.2s"
            />
            <MenuList shadow="lg" borderRadius="xl">
              <MenuItem 
                icon={<Icon as={FiSettings} />}
              >
                Настройки
              </MenuItem>
              <MenuItem 
                icon={<Icon as={FiLogOut} />} 
                onClick={handleLogout}
              >
                Выйти
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      <Flex flex={1}>
        {/* Sidebar (desktop) */}
        {!isMobile && (
          <Box
            as="aside"
            w="250px"
            bg={sidebarBg}
            shadow="md"
            py={6}
            px={3}
            borderRightWidth="1px"
            borderColor={borderColor}
            position="sticky"
            top="73px"
            h="calc(100vh - 73px)"
            overflowY="auto"
          >
            <VStack spacing={1} align="stretch">
              {menuItems.map((item) => (
                <Button
                  key={item.index}
                  leftIcon={<Icon as={item.icon} boxSize={5} />}
                  variant="ghost"
                  justifyContent="flex-start"
                  py={3}
                  px={4}
                  borderRadius="md"
                  fontWeight="medium"
                  onClick={() => setActiveTab(item.index)}
                  bg={activeTab === item.index ? activeBg : 'transparent'}
                  color={activeTab === item.index ? activeColor : 'inherit'}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                >
                  {item.label}
                </Button>
              ))}
              
              <Divider my={6} />
              
              <Button
                leftIcon={<Icon as={FiLogOut} boxSize={5} />}
                variant="ghost"
                justifyContent="flex-start"
                py={3}
                px={4}
                borderRadius="md"
                fontWeight="medium"
                onClick={handleLogout}
                color={useColorModeValue('red.500', 'red.300')}
                _hover={{ bg: useColorModeValue('red.50', 'red.900'), color: useColorModeValue('red.700', 'red.200') }}
              >
                Выйти
              </Button>
            </VStack>
          </Box>
        )}

        {/* Mobile menu */}
        <Drawer isOpen={isMobileMenuOpen} placement="left" onClose={onMobileMenuClose}>
          <DrawerOverlay />
          <DrawerContent maxW="250px">
            <DrawerHeader borderBottomWidth="1px" px={4} py={6}>
              <Flex align="center" justify="space-between">
                <Heading size="md" color="brand.500">Dental Lab</Heading>
                <DrawerCloseButton position="static" />
              </Flex>
            </DrawerHeader>
            <DrawerBody p={0}>
              <VStack spacing={1} align="stretch" py={4}>
                {menuItems.map((item) => (
                  <Button
                    key={item.index}
                    leftIcon={<Icon as={item.icon} boxSize={5} />}
                    variant="ghost"
                    justifyContent="flex-start"
                    py={3}
                    px={4}
                    borderRadius="0"
                    fontWeight="medium"
                    onClick={() => {
                      setActiveTab(item.index);
                      onMobileMenuClose();
                    }}
                    bg={activeTab === item.index ? activeBg : 'transparent'}
                    color={activeTab === item.index ? activeColor : 'inherit'}
                    _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                  >
                    {item.label}
                  </Button>
                ))}
                
                <Divider my={6} />
                
                <Button
                  leftIcon={<Icon as={FiLogOut} boxSize={5} />}
                  variant="ghost"
                  justifyContent="flex-start"
                  py={3}
                  px={4}
                  borderRadius="0"
                  fontWeight="medium"
                  onClick={handleLogout}
                  color={useColorModeValue('red.500', 'red.300')}
                  _hover={{ bg: useColorModeValue('red.50', 'red.900'), color: useColorModeValue('red.700', 'red.200') }}
                >
                  Выйти
                </Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Main content */}
        <Box flex={1} p={{ base: 4, md: 6 }} maxW="100%">
          <Box maxW="1600px" mx="auto">
            {/* Conditional rendering based on active tab */}
            {activeTab === 0 && (
              <DashboardPanel isAdmin={isAdmin} setActiveTab={setActiveTab} />
            )}
            
            {/* Admin Panels */}
            {isAdmin ? (
              <>
                {activeTab === 1 && <ClinicsPanel />}
                {activeTab === 2 && <ProductsPanel />}
                {activeTab === 3 && <OrdersPanel isAdmin={true} />}
              </>
            ) : (
              <>
                {/* Clinic Panels */}
                {activeTab === 1 && <PriceListPanel />}
                {activeTab === 2 && <OrdersPanel isAdmin={false} setActiveTab={setActiveTab} />}
                {activeTab === 3 && <CreateOrderPanel setActiveTab={setActiveTab} />}
              </>
            )}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

// Dashboard Panel Component
const DashboardPanel = ({ isAdmin, setActiveTab }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalSpent: 0,
    recentOrders: [],
  });
  const [unpaidOrders, setUnpaidOrders] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState('');
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setErrorMessage('');
        
        // Get all orders
        const ordersRes = await API.get('/orders');
        
        // Get pending orders
        const pendingRes = await API.get('/orders/unpaid');
        
        // Calculate summary statistics
        const totalOrders = ordersRes.data.length;
        const pendingOrders = pendingRes.data.length;
        
        // Calculate total amount of paid orders
        const paidOrders = ordersRes.data.filter(order => order.status === 'paid');
        const totalSpent = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        
        // Recent orders (last 5)
        const recentOrders = ordersRes.data.slice(0, 5);
        
        setStats({
          totalOrders,
          pendingOrders,
          totalSpent,
          recentOrders
        });
        
        setUnpaidOrders(pendingRes.data);
        
        // If admin, fetch clinics
        if (isAdmin) {
          const clinicsRes = await API.get('/clinics');
          setClinics(clinicsRes.data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setErrorMessage('Ошибка загрузки данных: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [isAdmin]);
  
  const handleMarkAsPaid = async (orderId) => {
    try {
      setErrorMessage('');
      await API.post(`/orders/${orderId}/pay`);
      
      // Update orders lists
      setUnpaidOrders(unpaidOrders.filter(order => order._id !== orderId));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingOrders: prev.pendingOrders - 1
      }));
    } catch (err) {
      console.error('Error marking order as paid:', err);
      setErrorMessage('Ошибка при оплате заказа: ' + (err.response?.data?.message || err.message));
    }
  };

  const goToAllOrders = () => {
    // Navigate to Orders tab (index 3 for admin, 1 for clinic)
    const tabIndex = isAdmin ? 3 : 1;
    setActiveTab(tabIndex);
  };
  
  const filteredOrders = selectedClinic 
    ? unpaidOrders.filter(order => order.clinicId._id === selectedClinic)
    : unpaidOrders;
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const highlightBg = useColorModeValue('brand.50', 'brand.900');
  const accentColor = useColorModeValue('brand.500', 'brand.200');
  
  if (loading && stats.recentOrders.length === 0) {
    return (
      <Center h="200px">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    );
  }
  
  return (
    <Box>
      {errorMessage && (
        <Box mb={6} p={4} borderRadius="md" bg="red.100" color="red.800">
          <Flex align="center">
            <Icon as={FiAlertCircle} mr={2} />
            <Text fontWeight="medium">{errorMessage}</Text>
          </Flex>
        </Box>
      )}
      
      {isAdmin ? (
        // Admin Dashboard
        <Box>
          <Flex 
            mb={8} 
            p={6} 
            borderRadius="xl" 
            bg={highlightBg} 
            color="brand.500"
            direction={{ base: 'column', md: 'row' }}
            align="center"
            justify="space-between"
            boxShadow="sm"
          >
            <Box>
              <Heading size="lg" mb={2}>Панель администратора</Heading>
              <Text fontSize="md" opacity={0.8}>Управление клиниками, товарами и заказами</Text>
            </Box>
            <HStack spacing={4} mt={{ base: 4, md: 0 }}>
              <Button 
                leftIcon={<Icon as={FiUser} />} 
                colorScheme="brand" 
                variant="outline"
                onClick={() => setActiveTab(1)}
                size="lg"
                fontWeight="normal"
              >
                Клиники
              </Button>
              <Button 
                leftIcon={<Icon as={FiPackage} />} 
                colorScheme="brand" 
                variant="outline"
                onClick={() => setActiveTab(2)}
                size="lg"
                fontWeight="normal"
              >
                Товары
              </Button>
            </HStack>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
            <StatCard 
              title="Всего заказов" 
              value={stats.totalOrders}
              icon={FiShoppingCart}
              accentColor="brand.500"
              onClick={goToAllOrders}
            />
            <StatCard 
              title="Неоплаченных заказов" 
              value={stats.pendingOrders}
              icon={FiAlertCircle}
              accentColor="orange.500"
              onClick={goToAllOrders}
            />
            <StatCard 
              title="Общая сумма оплаченных" 
              value={`₽${stats.totalSpent.toLocaleString()}`}
              icon={FiDollarSign}
              accentColor="green.500"
            />
          </SimpleGrid>
          
          <Card 
            bg={cardBg} 
            boxShadow="sm" 
            borderRadius="xl" 
            overflow="hidden"
            borderWidth="1px"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
          >
            <CardHeader pb={2} bg={useColorModeValue('gray.50', 'gray.800')} borderBottomWidth="1px">
              <Flex justify="space-between" align="center">
                <Heading size="md">
                  <Flex align="center">
                    <Icon as={FiAlertCircle} color="orange.500" mr={2} />
                    Неоплаченные заказы
                  </Flex>
                </Heading>
                
                <Select 
                  placeholder="Все клиники" 
                  value={selectedClinic} 
                  onChange={e => setSelectedClinic(e.target.value)}
                  width="250px"
                  bg={cardBg}
                  icon={<Icon as={FiUser} color="gray.500" />}
                >
                  {clinics.map(clinic => (
                    <option key={clinic._id} value={clinic._id}>{clinic.name}</option>
                  ))}
                </Select>
              </Flex>
            </CardHeader>
            <CardBody p={0}>
              {loading ? (
                <Center py={8}>
                  <Spinner size="lg" color="brand.500" thickness="4px" />
                </Center>
              ) : filteredOrders.length > 0 ? (
                <Table variant="simple">
                  <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
                    <Tr>
                      <Th>№ заказа</Th>
                      <Th>Клиника</Th>
                      <Th>Пациент</Th>
                      <Th>Дата</Th>
                      <Th>Срок сдачи</Th>
                      <Th isNumeric>Сумма</Th>
                      <Th width="100px">Действия</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredOrders.map((order, index) => (
                      <Tr 
                        key={order._id} 
                        bg={index % 2 === 0 ? 'transparent' : useColorModeValue('gray.50', 'gray.800')}
                        _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                        transition="background 0.2s"
                      >
                        <Td fontWeight="medium">#{order.orderNumber}</Td>
                        <Td>{order.clinicId?.name || '-'}</Td>
                        <Td>{order.patientName || '-'}</Td>
                        <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
                        <Td>{order.deadline ? new Date(order.deadline).toLocaleDateString() : '-'}</Td>
                        <Td isNumeric fontWeight="bold">₽{order.totalAmount.toLocaleString()}</Td>
                        <Td>
                          <Button 
                            size="sm" 
                            colorScheme="green"
                            leftIcon={<FiCheck />}
                            onClick={() => handleMarkAsPaid(order._id)}
                            boxShadow="sm"
                            _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
                          >
                            Оплачен
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <Center py={10}>
                  <VStack spacing={3}>
                    <Box
                      p={3}
                      borderRadius="full"
                      bg={useColorModeValue('green.50', 'green.900')}
                      color={useColorModeValue('green.500', 'green.200')}
                    >
                      <Icon as={FiCheck} fontSize="4xl" />
                    </Box>
                    <Text fontSize="lg" fontWeight="medium" color="gray.500">Все заказы оплачены</Text>
                    <Text fontSize="sm" color="gray.400">
                      На данный момент нет неоплаченных заказов
                    </Text>
                  </VStack>
                </Center>
              )}
              
              {filteredOrders.length > 0 && (
                <Flex 
                  justifyContent="center" 
                  py={4}
                  borderTopWidth="1px"
                  borderColor={useColorModeValue('gray.200', 'gray.700')}
                >
                  <Button 
                    colorScheme="brand" 
                    variant="outline"
                    onClick={goToAllOrders}
                    leftIcon={<FiShoppingCart />}
                    boxShadow="sm"
                    _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
                  >
                    Все заказы
                  </Button>
                </Flex>
              )}
            </CardBody>
          </Card>
        </Box>
      ) : (
        // Clinic dashboard
        <Card bg={cardBg} boxShadow="sm" borderRadius="lg">
          <CardHeader pb={2}>
            <Heading size="md">Последние заказы</Heading>
          </CardHeader>
          <CardBody>
            {loading ? (
              <Center py={8}>
                <Spinner size="lg" color="brand.500" thickness="4px" />
              </Center>
            ) : stats.recentOrders.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>№ заказа</Th>
                    <Th>Пациент</Th>
                    <Th>Дата</Th>
                    <Th isNumeric>Сумма</Th>
                    <Th>Статус</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {stats.recentOrders.map(order => (
                    <Tr key={order._id}>
                      <Td fontWeight="medium">#{order.orderNumber}</Td>
                      <Td>{order.patientName || '-'}</Td>
                      <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
                      <Td isNumeric>₽{order.totalAmount.toLocaleString()}</Td>
                      <Td>
                        <Badge colorScheme={getStatusColorScheme(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Center py={8}>
                <Text color="gray.500">Заказы не найдены</Text>
              </Center>
            )}
            
            <HStack spacing={4} justifyContent="center" mt={4}>
              <Button 
                colorScheme="brand" 
                variant="outline"
                onClick={goToAllOrders}
                leftIcon={<FiShoppingCart />}
              >
                Все заказы
              </Button>
              
              <Button 
                colorScheme="brand"
                onClick={() => setActiveTab(2)} // Navigate to Create Order tab
                leftIcon={<FiPlus />}
              >
                Создать заказ
              </Button>
            </HStack>
          </CardBody>
        </Card>
      )}
    </Box>
  );
};

// Clinics Panel Component (Admin only)
const ClinicsPanel = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [newClinic, setNewClinic] = useState({ 
    name: '', 
    contact: { phone: '', email: '' },
    username: '',
    password: ''
  });
  
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await API.get('/clinics');
        setClinics(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching clinics:', err);
        setErrorMessage('Ошибка загрузки клиник: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };
    
    fetchClinics();
  }, []);
  
  const handleAddClinic = async () => {
    // Form validation logic would go here
    // Close modal for this example
    onClose();
  };
  
  const filteredClinics = clinics.filter(
    clinic => clinic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const highlightBg = useColorModeValue('brand.50', 'brand.900');
  
  if (loading) {
    return (
      <Center h="200px">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    );
  }
  
  return (
    <Box>
      <Flex 
        p={6} 
        mb={6} 
        borderRadius="xl" 
        bg={highlightBg}
        justify="space-between" 
        align="center"
        boxShadow="sm"
      >
        <Box>
          <Heading size="md" color="brand.600">Управление клиниками</Heading>
          <Text color="brand.500" mt={1}>Всего клиник: {clinics.length}</Text>
        </Box>
        <Button 
          leftIcon={<FiPlus />} 
          colorScheme="brand" 
          onClick={onOpen}
          size="lg"
        >
          Добавить клинику
        </Button>
      </Flex>
      
      {errorMessage && (
        <Box mb={6} p={4} borderRadius="md" bg="red.100" color="red.800">
          <Flex align="center">
            <Icon as={FiAlertCircle} mr={2} />
            <Text fontWeight="medium">{errorMessage}</Text>
          </Flex>
        </Box>
      )}
      
      {successMessage && (
        <Box mb={6} p={4} borderRadius="md" bg="green.100" color="green.800">
          <Flex align="center">
            <Icon as={FiCheck} mr={2} />
            <Text fontWeight="medium">{successMessage}</Text>
          </Flex>
        </Box>
      )}
      
      <InputGroup mb={4} maxW="500px">
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Поиск клиники по названию..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          bg={cardBg}
          boxShadow="sm"
          borderRadius="md"
        />
      </InputGroup>
      
      <Card 
        bg={cardBg} 
        boxShadow="md" 
        borderRadius="xl" 
        overflow="hidden"
        borderWidth="1px"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        {filteredClinics.length > 0 ? (
          <Table variant="simple">
            <Thead bg={useColorModeValue('gray.50', 'gray.800')} borderBottomWidth="1px">
              <Tr>
                <Th>Название</Th>
                <Th>Контакты</Th>
                <Th width="120px">Действия</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredClinics.map((clinic, index) => (
                <Tr 
                  key={clinic._id} 
                  bg={index % 2 === 0 ? 'transparent' : useColorModeValue('gray.50', 'gray.800')}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                  transition="background 0.2s"
                >
                  <Td fontWeight="medium">
                    <Flex align="center">
                      <Avatar 
                        size="sm" 
                        name={clinic.name} 
                        bg="brand.500" 
                        color="white" 
                        mr={3}
                      />
                      {clinic.name}
                    </Flex>
                  </Td>
                  <Td>
                    <Box>
                      {clinic.contact?.phone && (
                        <Flex align="center" mb={1}>
                          <Icon as={FiPhone} color="gray.500" mr={2} />
                          <Text>{clinic.contact.phone}</Text>
                        </Flex>
                      )}
                      {clinic.contact?.email && (
                        <Flex align="center">
                          <Icon as={FiMail} color="gray.500" mr={2} />
                          <Text>{clinic.contact.email}</Text>
                        </Flex>
                      )}
                      {!clinic.contact?.phone && !clinic.contact?.email && (
                        <Text color="gray.500">Контактная информация отсутствует</Text>
                      )}
                    </Box>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<FiEdit />}
                        aria-label="Редактировать"
                        size="sm"
                        colorScheme="blue"
                        borderRadius="md"
                        boxShadow="sm"
                      />
                      <IconButton
                        icon={<FiTrash2 />}
                        aria-label="Удалить"
                        size="sm"
                        colorScheme="red"
                        borderRadius="md"
                        boxShadow="sm"
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Center py={10}>
            <VStack spacing={3}>
              <Icon as={FiUser} fontSize="4xl" color="gray.400" />
              <Text color="gray.500" fontWeight="medium">Клиники не найдены</Text>
              <Text fontSize="sm" color="gray.400">
                {searchTerm ? 'Измените параметры поиска' : 'Добавьте клинику, нажав кнопку выше'}
              </Text>
              <Button 
                mt={2}
                leftIcon={<FiPlus />} 
                colorScheme="brand" 
                onClick={onOpen}
                size="sm"
              >
                Добавить клинику
              </Button>
            </VStack>
          </Center>
        )}
      </Card>
      
      {/* Add Clinic Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent borderRadius="xl">
          <ModalHeader bg={useColorModeValue('gray.50', 'gray.800')} borderBottomWidth="1px" borderTopRadius="xl">
            <Flex align="center">
              <Icon as={FiPlus} mr={2} />
              Добавить клинику
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <VStack spacing={6} align="stretch">
              <Box>
                <Heading size="xs" mb={4} color="gray.500">Информация о клинике</Heading>
                <FormControl isRequired>
                  <FormLabel>Название клиники</FormLabel>
                  <Input 
                    placeholder="Введите название" 
                    value={newClinic.name}
                    onChange={(e) => setNewClinic({...newClinic, name: e.target.value})}
                    boxShadow="sm"
                  />
                </FormControl>
              </Box>
              
              <Box>
                <Heading size="xs" mb={4} color="gray.500">Контактная информация</Heading>
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl>
                    <FormLabel>Телефон</FormLabel>
                    <Input 
                      placeholder="Введите телефон" 
                      value={newClinic.contact.phone}
                      onChange={(e) => setNewClinic({
                        ...newClinic, 
                        contact: {...newClinic.contact, phone: e.target.value}
                      })}
                      boxShadow="sm"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input 
                      placeholder="Введите email" 
                      value={newClinic.contact.email}
                      onChange={(e) => setNewClinic({
                        ...newClinic, 
                        contact: {...newClinic.contact, email: e.target.value}
                      })}
                      boxShadow="sm"
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>
              
              <Box>
                <Heading size="xs" mb={4} color="gray.500">Данные для входа</Heading>
                <FormControl isRequired>
                  <FormLabel>Имя пользователя</FormLabel>
                  <Input 
                    placeholder="Введите имя пользователя" 
                    value={newClinic.username}
                    onChange={(e) => setNewClinic({...newClinic, username: e.target.value})}
                    boxShadow="sm"
                  />
                </FormControl>
                <FormControl isRequired mt={4}>
                  <FormLabel>Пароль</FormLabel>
                  <Input 
                    type="password" 
                    placeholder="Введите пароль" 
                    value={newClinic.password}
                    onChange={(e) => setNewClinic({...newClinic, password: e.target.value})}
                    boxShadow="sm"
                  />
                </FormControl>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter bg={useColorModeValue('gray.50', 'gray.800')} borderTopWidth="1px" borderBottomRadius="xl">
            <Button variant="outline" mr={3} onClick={onClose}>
              Отмена
            </Button>
            <Button 
              colorScheme="brand" 
              onClick={handleAddClinic}
              leftIcon={<FiPlus />}
            >
              Создать клинику
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// Products Panel Component (Admin only)
const ProductsPanel = () => {
  const [products, setProducts] = useState([]);
  const [prices, setPrices] = useState({});
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPrice, setEditingPrice] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newProduct, setNewProduct] = useState({ name: '', code: '', description: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch products
        const productsRes = await API.get('/products/all');
        setProducts(productsRes.data);
        
        // Fetch clinics
        const clinicsRes = await API.get('/clinics');
        setClinics(clinicsRes.data);
        
        if (clinicsRes.data.length > 0) {
          setSelectedClinic(clinicsRes.data[0]._id);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setErrorMessage('Ошибка загрузки товаров: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  useEffect(() => {
    const fetchPrices = async () => {
      if (!selectedClinic) return;
      
      try {
        setLoading(true);
        const res = await API.get('/prices', { params: { clinicId: selectedClinic } });
        
        // Convert to map for easier access
        const priceMap = {};
        res.data.forEach(price => {
          priceMap[price.product._id] = { 
            _id: price._id, 
            price: price.price 
          };
        });
        
        setPrices(priceMap);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching prices:', err);
        setErrorMessage('Ошибка загрузки цен: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };
    
    if (selectedClinic) {
      fetchPrices();
    }
  }, [selectedClinic]);
  
  const handleEditPrice = (productId, currentPrice) => {
    setEditingPrice(productId);
    setNewPrice(currentPrice || '');
  };
  
  const handleSavePrice = async (productId) => {
    if (!newPrice || isNaN(parseFloat(newPrice)) || parseFloat(newPrice) < 0) {
      setErrorMessage('Введите корректную цену');
      return;
    }
    
    setSaveLoading(true);
    setErrorMessage('');
    
    try {
      const currentPrice = prices[productId];
      
      if (currentPrice && currentPrice._id) {
        // Update existing price
        await API.put(`/prices/${currentPrice._id}`, {
          price: parseFloat(newPrice)
        });
      } else {
        // Create new price
        const res = await API.post('/prices', {
          clinicId: selectedClinic,
          productId,
          price: parseFloat(newPrice)
        });
        
        // Update prices map with the new price entry
        setPrices(prev => ({
          ...prev,
          [productId]: { _id: res.data._id, price: parseFloat(newPrice) }
        }));
      }
      
      // Update local state
      setPrices(prev => ({
        ...prev,
        [productId]: { ...prev[productId], price: parseFloat(newPrice) }
      }));
      
      setEditingPrice(null);
      setNewPrice('');
      
      // Show success message
      setSuccessMessage('Цена успешно обновлена');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving price:', err);
      setErrorMessage('Ошибка сохранения цены: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaveLoading(false);
    }
  };
  
  const cancelEditing = () => {
    setEditingPrice(null);
    setNewPrice('');
    setErrorMessage('');
  };

  const handleAddProduct = async () => {
    try {
      if (!newProduct.name || !newProduct.code) {
        setErrorMessage('Введите название и код товара');
        return;
      }

      const res = await API.post('/products', newProduct);
      setProducts([...products, res.data]);
      setNewProduct({ name: '', code: '', description: '' });
      onClose();
      setSuccessMessage('Товар успешно добавлен');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error adding product:', err);
      setErrorMessage('Ошибка добавления товара: ' + (err.response?.data?.message || err.message));
    }
  };
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.code && product.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const highlightBg = useColorModeValue('brand.50', 'brand.900');
  const selectedRowBg = useColorModeValue('blue.50', 'blue.900');
  
  if (loading && products.length === 0) {
    return (
      <Center h="200px">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    );
  }
  
  return (
    <Box>
      <Flex 
        p={6} 
        mb={6} 
        borderRadius="xl" 
        bg={highlightBg}
        justify="space-between" 
        align="center"
        boxShadow="sm"
      >
        <Box>
          <Heading size="md" color="brand.600">Управление товарами и ценами</Heading>
          <Text color="brand.500" mt={1}>Всего товаров: {products.length}</Text>
        </Box>
        <Button 
          leftIcon={<FiPlus />} 
          colorScheme="brand" 
          onClick={onOpen}
          size="lg"
        >
          Добавить товар
        </Button>
      </Flex>
      
      {errorMessage && (
        <Box mb={6} p={4} borderRadius="md" bg="red.100" color="red.800">
          <Flex align="center">
            <Icon as={FiAlertCircle} mr={2} />
            <Text fontWeight="medium">{errorMessage}</Text>
          </Flex>
        </Box>
      )}
      
      {successMessage && (
        <Box mb={6} p={4} borderRadius="md" bg="green.100" color="green.800">
          <Flex align="center">
            <Icon as={FiCheck} mr={2} />
            <Text fontWeight="medium">{successMessage}</Text>
          </Flex>
        </Box>
      )}
      
      <Flex 
        justify="space-between" 
        align={{ base: "stretch", md: "center" }} 
        mb={6}
        gap={4}
        direction={{ base: "column", md: "row" }}
      >
        <Box 
          p={4} 
          borderRadius="lg" 
          bg={cardBg} 
          boxShadow="md"
          borderWidth="1px"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          flex="1"
        >
          <Text mb={2} fontWeight="medium">Выберите клинику для управления ценами:</Text>
          <Select 
            placeholder="Выберите клинику" 
            value={selectedClinic} 
            onChange={e => setSelectedClinic(e.target.value)}
            bg={useColorModeValue('white', 'gray.800')}
            borderRadius="md"
            boxShadow="sm"
            size="lg"
            icon={<Icon as={FiUser} color="gray.500" />}
          >
            {clinics.map(clinic => (
              <option key={clinic._id} value={clinic._id}>{clinic.name}</option>
            ))}
          </Select>
        </Box>
        
        <Box flex="2">
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Поиск товара по названию или коду..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              bg={cardBg}
              boxShadow="md"
              borderRadius="md"
              borderWidth="1px"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            />
          </InputGroup>
        </Box>
      </Flex>
      
      {loading ? (
        <Center py={8}>
          <Spinner size="lg" color="brand.500" thickness="4px" />
        </Center>
      ) : (
        <Card 
          bg={cardBg} 
          boxShadow="md" 
          borderRadius="xl" 
          overflow="hidden"
          borderWidth="1px"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
          {filteredProducts.length > 0 ? (
            <Table variant="simple">
              <Thead bg={useColorModeValue('gray.50', 'gray.800')} borderBottomWidth="1px">
                <Tr>
                  <Th>Код</Th>
                  <Th>Название</Th>
                  <Th isNumeric>Цена</Th>
                  <Th width="120px">Действия</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredProducts.map((product, index) => (
                  <Tr 
                    key={product._id} 
                    bg={editingPrice === product._id 
                      ? selectedRowBg 
                      : index % 2 === 0 ? 'transparent' : useColorModeValue('gray.50', 'gray.800')
                    }
                    _hover={editingPrice !== product._id ? { bg: useColorModeValue('gray.100', 'gray.700') } : {}}
                    transition="background 0.2s"
                  >
                    <Td fontWeight="medium">{product.code}</Td>
                    <Td>{product.name}</Td>
                    <Td isNumeric>
                      {editingPrice === product._id ? (
                        <InputGroup size="sm" maxW="150px" ml="auto">
                          <InputLeftElement pointerEvents="none">
                            <Text color="gray.500">₽</Text>
                          </InputLeftElement>
                          <Input 
                            type="number" 
                            value={newPrice} 
                            onChange={e => setNewPrice(e.target.value)}
                            autoFocus
                            onKeyPress={e => e.key === 'Enter' && handleSavePrice(product._id)}
                            bg={useColorModeValue('white', 'gray.700')}
                            borderColor={useColorModeValue('blue.300', 'blue.500')}
                            boxShadow="sm"
                          />
                        </InputGroup>
                      ) : (
                        <Badge 
                          colorScheme={prices[product._id] ? "green" : "gray"}
                          fontSize="md" 
                          py={1} 
                          px={3}
                          borderRadius="md"
                        >
                          {prices[product._id] ? `₽${prices[product._id].price.toLocaleString()}` : 'Не указана'}
                        </Badge>
                      )}
                    </Td>
                    <Td>
                      {editingPrice === product._id ? (
                        <HStack spacing={1}>
                          <IconButton
                            icon={<FiCheck />}
                            aria-label="Сохранить"
                            size="sm"
                            colorScheme="green"
                            isLoading={saveLoading}
                            onClick={() => handleSavePrice(product._id)}
                            boxShadow="sm"
                          />
                          <IconButton
                            icon={<FiX />}
                            aria-label="Отменить"
                            size="sm"
                            colorScheme="red"
                            onClick={cancelEditing}
                            boxShadow="sm"
                          />
                        </HStack>
                      ) : (
                        <Button
                          leftIcon={<FiEdit />}
                          aria-label="Редактировать цену"
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleEditPrice(product._id, prices[product._id]?.price || '')}
                          boxShadow="sm"
                        >
                          Цена
                        </Button>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Center py={10}>
              <VStack spacing={3}>
                <Icon as={FiPackage} fontSize="4xl" color="gray.400" />
                <Text fontSize="lg" fontWeight="medium" color="gray.500">Товары не найдены</Text>
                <Text fontSize="sm" color="gray.400">
                  {searchTerm ? 'Попробуйте изменить параметры поиска' : 'Добавьте товары, нажав кнопку выше'}
                </Text>
                {searchTerm && (
                  <Button 
                    mt={2}
                    leftIcon={<FiX />} 
                    onClick={() => setSearchTerm('')}
                    size="sm"
                    variant="outline"
                  >
                    Очистить поиск
                  </Button>
                )}
              </VStack>
            </Center>
          )}
        </Card>
      )}

      {/* Add Product Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent borderRadius="xl">
          <ModalHeader bg={useColorModeValue('gray.50', 'gray.800')} borderBottomWidth="1px" borderTopRadius="xl">
            <Flex align="center">
              <Icon as={FiPackage} mr={2} />
              Добавить товар
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontWeight="medium">Название товара</FormLabel>
                <Input 
                  placeholder="Введите название" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  size="lg"
                  boxShadow="sm"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontWeight="medium">Код товара</FormLabel>
                <Input 
                  placeholder="Введите код" 
                  value={newProduct.code}
                  onChange={(e) => setNewProduct({...newProduct, code: e.target.value})}
                  size="lg"
                  boxShadow="sm"
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="medium">Описание</FormLabel>
                <Input 
                  placeholder="Введите описание" 
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  size="lg"
                  boxShadow="sm"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter bg={useColorModeValue('gray.50', 'gray.800')} borderTopWidth="1px" borderBottomRadius="xl">
            <Button variant="outline" mr={3} onClick={onClose}>
              Отмена
            </Button>
            <Button 
              colorScheme="brand" 
              onClick={handleAddProduct}
              leftIcon={<FiPlus />}
              size="lg"
            >
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// Orders Panel Component
const OrdersPanel = ({ isAdmin, setActiveTab }) => {
  const [orders, setOrders] = useState([]);
  const [unpaidOrders, setUnpaidOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('orderNumber'); // 'orderNumber' or 'patientName'
  const [selectedClinic, setSelectedClinic] = useState('');
  const [clinics, setClinics] = useState([]);
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'unpaid'
  const [orderDetails, setOrderDetails] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setErrorMessage('');
        
        // Fetch all orders
        const ordersRes = await API.get('/orders');
        setOrders(ordersRes.data);
        
        // Fetch unpaid orders
        const unpaidRes = await API.get('/orders/unpaid');
        setUnpaidOrders(unpaidRes.data);
        
        // If admin, fetch clinics
        if (isAdmin) {
          const clinicsRes = await API.get('/clinics');
          setClinics(clinicsRes.data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setErrorMessage('Ошибка загрузки заказов: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isAdmin]);
  
  const handleSearch = async () => {
    if (!searchTerm) return;
    
    try {
      setLoading(true);
      setErrorMessage('');
      let res;
      
      if (searchType === 'patientName') {
        // Search by patient name
        const params = { name: searchTerm };
        if (isAdmin && selectedClinic) {
          params.clinicId = selectedClinic;
        }
        
        res = await API.get('/orders/search/patient', { params });
      } else {
        // Search by order number
        res = await API.get('/orders/search', { params: { term: searchTerm } });
      }
      
      setOrders(res.data);
      setViewMode('all');
      setLoading(false);
    } catch (err) {
      console.error('Error searching orders:', err);
      setErrorMessage('Ошибка поиска: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };
  
  const handleMarkAsPaid = async (orderId) => {
    try {
      setErrorMessage('');
      await API.post(`/orders/${orderId}/pay`);
      
      // Success message
      setSuccessMessage('Заказ отмечен как оплаченный');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Update orders lists
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: 'paid', paymentDate: new Date() } : order
      ));
      
      setUnpaidOrders(unpaidOrders.filter(order => order._id !== orderId));
    } catch (err) {
      console.error('Error marking order as paid:', err);
      setErrorMessage('Ошибка при оплате заказа: ' + (err.response?.data?.message || err.message));
    }
  };
  
  const resetSearch = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const res = await API.get('/orders');
      setOrders(res.data);
      setSearchTerm('');
      setViewMode('all');
      setLoading(false);
    } catch (err) {
      console.error('Error resetting search:', err);
      setErrorMessage('Ошибка: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };
  
  const viewOrderDetails = (order) => {
    setOrderDetails(order);
    onOpen();
  };
  
  // Get the current list based on view mode
  const currentList = viewMode === 'unpaid' ? unpaidOrders : orders;
  
  // Apply filters
  const filteredOrders = currentList
    .filter(order => statusFilter ? order.status === statusFilter : true)
    .filter(order => {
      if (selectedClinic && isAdmin) {
        return order.clinicId._id === selectedClinic;
      }
      return true;
    });
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const highlightBg = useColorModeValue('brand.50', 'brand.900');
  
  if (loading && orders.length === 0 && unpaidOrders.length === 0) {
    return (
      <Center h="200px">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    );
  }
  
  return (
    <Box>
      <Flex 
        p={6} 
        mb={6} 
        borderRadius="xl" 
        bg={highlightBg}
        direction={{ base: 'column', md: 'row' }}
        justify="space-between" 
        align={{ base: 'stretch', md: 'center' }}
        boxShadow="sm"
        gap={4}
      >
        <Box>
          <Heading size="md" color="brand.600">Управление заказами</Heading>
          <Text color="brand.500" mt={1}>Всего заказов: {orders.length} | Неоплаченных: {unpaidOrders.length}</Text>
        </Box>
        
        {!isAdmin && setActiveTab && (
          <Button 
            leftIcon={<FiPlus />} 
            colorScheme="brand"
            size="lg"
            onClick={() => setActiveTab(3)}
          >
            Создать заказ
          </Button>
        )}
      </Flex>
      
      {errorMessage && (
        <Box mb={6} p={4} borderRadius="md" bg="red.100" color="red.800">
          <Flex align="center">
            <Icon as={FiAlertCircle} mr={2} />
            <Text fontWeight="medium">{errorMessage}</Text>
          </Flex>
        </Box>
      )}
      
      {successMessage && (
        <Box mb={6} p={4} borderRadius="md" bg="green.100" color="green.800">
          <Flex align="center">
            <Icon as={FiCheck} mr={2} />
            <Text fontWeight="medium">{successMessage}</Text>
          </Flex>
        </Box>
      )}
      
      <Card 
        mb={6} 
        bg={cardBg} 
        boxShadow="md" 
        borderRadius="xl" 
        overflow="hidden"
        borderWidth="1px"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <CardHeader pb={4} bg={useColorModeValue('gray.50', 'gray.800')} borderBottomWidth="1px">
          <Heading size="sm" mb={4}>Поиск и фильтрация</Heading>
          
          <Flex wrap="wrap" gap={4}>
            <HStack spacing={2} flex="1" minW={{ base: "100%", md: "auto" }}>
              <Select 
                value={searchType}
                onChange={e => setSearchType(e.target.value)}
                maxWidth="150px"
                borderRadius="md"
                boxShadow="sm"
              >
                <option value="orderNumber">№ заказа</option>
                <option value="patientName">ФИО пациента</option>
              </Select>
              
              <InputGroup flex="1">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder={searchType === 'patientName' ? "Введите ФИО пациента..." : "Введите номер заказа..."}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSearch()}
                  borderRadius="md"
                  boxShadow="sm"
                />
              </InputGroup>
              
              <Button 
                onClick={handleSearch} 
                isDisabled={!searchTerm}
                colorScheme="blue"
                leftIcon={<FiSearch />}
                boxShadow="sm"
              >
                Найти
              </Button>
              
              {searchTerm && (
                <Button 
                  variant="outline" 
                  onClick={resetSearch}
                  leftIcon={<FiX />}
                  boxShadow="sm"
                >
                  Сбросить
                </Button>
              )}
            </HStack>
            
            {isAdmin && (
              <Select 
                placeholder="Все клиники" 
                value={selectedClinic} 
                onChange={e => setSelectedClinic(e.target.value)}
                maxWidth="200px"
                borderRadius="md"
                boxShadow="sm"
              >
                {clinics.map(clinic => (
                  <option key={clinic._id} value={clinic._id}>{clinic.name}</option>
                ))}
              </Select>
            )}
            
            <Select 
              placeholder="Все статусы" 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              maxWidth="200px"
              borderRadius="md"
              boxShadow="sm"
            >
              <option value="pending">Не оплачен</option>
              <option value="paid">Оплачен</option>
              <option value="cancelled">Отменен</option>
            </Select>
          </Flex>
        </CardHeader>
        
        <CardBody p={0}>
          <Flex 
            justify="center" 
            borderBottomWidth="1px" 
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            bg={useColorModeValue('gray.50', 'gray.800')}
            py={2}
          >
            <Button 
              variant={viewMode === 'all' ? 'solid' : 'ghost'} 
              colorScheme="brand"
              onClick={() => setViewMode('all')}
              mx={2}
              leftIcon={<FiShoppingCart />}
              size="sm"
            >
              Все заказы ({orders.length})
            </Button>
            
            <Button 
              variant={viewMode === 'unpaid' ? 'solid' : 'ghost'} 
              colorScheme="orange"
              onClick={() => setViewMode('unpaid')}
              mx={2}
              leftIcon={<FiAlertCircle />}
              size="sm"
            >
              Неоплаченные ({unpaidOrders.length})
            </Button>
          </Flex>
          
          {loading ? (
            <Center py={10}>
              <Spinner size="lg" color="brand.500" thickness="4px" />
            </Center>
          ) : (
            filteredOrders.length > 0 ? (
              <Table variant="simple">
                <Thead bg={useColorModeValue('gray.50', 'gray.800')} position="sticky" top={0} zIndex={1}>
                  <Tr>
                    <Th>№ заказа</Th>
                    {isAdmin && <Th>Клиника</Th>}
                    <Th>Пациент</Th>
                    <Th>Дата</Th>
                    <Th>Срок сдачи</Th>
                    <Th isNumeric>Сумма</Th>
                    <Th>Статус</Th>
                    <Th width="120px">Действия</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredOrders.map((order, index) => (
                    <Tr 
                      key={order._id}
                      bg={index % 2 === 0 ? 'transparent' : useColorModeValue('gray.50', 'gray.800')}
                      _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                      transition="background 0.2s"
                    >
                      <Td fontWeight="medium">
                        <HStack spacing={1}>
                          <Text>#{order.orderNumber}</Text>
                          {order.status === 'pending' && (
                            <Badge colorScheme="orange" variant="outline">!</Badge>
                          )}
                        </HStack>
                      </Td>
                      {isAdmin && <Td>{order.clinicId?.name || '-'}</Td>}
                      <Td>{order.patientName || '-'}</Td>
                      <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
                      <Td>
                        {order.deadline ? (
                          <HStack>
                            <Icon 
                              as={FiClock} 
                              color={
                                new Date(order.deadline) < new Date() && order.status === 'pending'
                                  ? 'red.500'
                                  : 'gray.500'
                              }
                            />
                            <Text>{new Date(order.deadline).toLocaleDateString()}</Text>
                          </HStack>
                        ) : '-'}
                      </Td>
                      <Td isNumeric fontWeight="bold">₽{order.totalAmount.toLocaleString()}</Td>
                      <Td>
                        <Badge 
                          colorScheme={getStatusColorScheme(order.status)}
                          px={2}
                          py={1}
                          borderRadius="md"
                          fontSize="sm"
                        >
                          {getStatusText(order.status)}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          {isAdmin && order.status === 'pending' && (
                            <Button
                              leftIcon={<FiCheck />}
                              aria-label="Отметить как оплаченный"
                              size="sm"
                              colorScheme="green"
                              onClick={() => handleMarkAsPaid(order._id)}
                              boxShadow="sm"
                            >
                              Оплатить
                            </Button>
                          )}
                          <IconButton
                            icon={<FiEye />}
                            aria-label="Детали"
                            size="sm"
                            colorScheme="blue"
                            onClick={() => viewOrderDetails(order)}
                            boxShadow="sm"
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Center py={10}>
                <VStack spacing={3}>
                  <Icon as={FiShoppingCart} fontSize="4xl" color="gray.400" />
                  <Text color="gray.500" fontWeight="medium">Заказы не найдены</Text>
                  <Text fontSize="sm" color="gray.400">
                    {searchTerm ? 'Попробуйте изменить параметры поиска' : 'Нет заказов по заданным параметрам'}
                  </Text>
                  {searchTerm && (
                    <Button 
                      mt={2}
                      leftIcon={<FiX />} 
                      onClick={resetSearch}
                      size="sm"
                      variant="outline"
                    >
                      Сбросить фильтры
                    </Button>
                  )}
                </VStack>
              </Center>
            )
          )}
        </CardBody>
      </Card>

      {/* Order Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent borderRadius="xl">
          <ModalHeader 
            bg={useColorModeValue('gray.50', 'gray.800')} 
            borderBottomWidth="1px" 
            borderTopRadius="xl"
          >
            <Flex align="center" justify="space-between">
              <HStack>
                <Icon as={FiShoppingCart} mr={2} />
                <Text>Заказ #{orderDetails?.orderNumber}</Text>
                {orderDetails && (
                  <Badge 
                    ml={2} 
                    colorScheme={getStatusColorScheme(orderDetails.status)}
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    {getStatusText(orderDetails.status)}
                  </Badge>
                )}
              </HStack>
              
              {orderDetails && orderDetails.status === 'pending' && isAdmin && (
                <Button 
                  size="sm"
                  colorScheme="green" 
                  leftIcon={<FiCheck />}
                  onClick={() => {
                    handleMarkAsPaid(orderDetails._id);
                    onClose();
                  }}
                >
                  Отметить как оплаченный
                </Button>
              )}
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6}>
            {orderDetails && (
              <>
                <SimpleGrid 
                  columns={{ base: 1, md: 2 }} 
                  spacing={6} 
                  mb={6}
                  p={4}
                  bg={useColorModeValue('gray.50', 'gray.800')}
                  borderRadius="md"
                >
                  <Box>
                    <Text fontWeight="bold" color="gray.500" fontSize="sm" mb={1}>Пациент:</Text>
                    <Text fontSize="lg">{orderDetails.patientName}</Text>
                  </Box>
                  {isAdmin && (
                    <Box>
                      <Text fontWeight="bold" color="gray.500" fontSize="sm" mb={1}>Клиника:</Text>
                      <Text fontSize="lg">{orderDetails.clinicId?.name || '-'}</Text>
                    </Box>
                  )}
                  <Box>
                    <Text fontWeight="bold" color="gray.500" fontSize="sm" mb={1}>Дата создания:</Text>
                    <Text fontSize="lg">{new Date(orderDetails.createdAt).toLocaleDateString()}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color="gray.500" fontSize="sm" mb={1}>Срок сдачи:</Text>
                    <Text fontSize="lg">{orderDetails.deadline ? new Date(orderDetails.deadline).toLocaleDateString() : '-'}</Text>
                  </Box>
                  {orderDetails.status === 'paid' && (
                    <Box>
                      <Text fontWeight="bold" color="gray.500" fontSize="sm" mb={1}>Дата оплаты:</Text>
                      <Text fontSize="lg" color="green.500">{orderDetails.paymentDate ? new Date(orderDetails.paymentDate).toLocaleDateString() : '-'}</Text>
                    </Box>
                  )}
                </SimpleGrid>

                <Box mb={6}>
                  <Flex align="center" mb={4}>
                    <Icon as={FiPackage} mr={2} />
                    <Heading size="sm">Товары и услуги</Heading>
                  </Flex>
                  
                  <Card 
                    variant="outline" 
                    borderRadius="md" 
                    overflow="hidden"
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                  >
                    <Table variant="simple" size="sm">
                      <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
                        <Tr>
                          <Th>Название</Th>
                          <Th>Кол-во</Th>
                          <Th>Цвет</Th>
                          <Th isNumeric>Цена</Th>
                          <Th isNumeric>Сумма</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {orderDetails.items.map((item, index) => (
                          <Tr key={index}>
                            <Td fontWeight="medium">{item.product?.name || 'Товар не найден'}</Td>
                            <Td>{item.quantity}</Td>
                            <Td>{item.color || '-'}</Td>
                            <Td isNumeric>₽{item.price.toLocaleString()}</Td>
                            <Td isNumeric fontWeight="bold">₽{(item.price * item.quantity).toLocaleString()}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                      <Tfoot bg={useColorModeValue('gray.50', 'gray.800')}>
                        <Tr>
                          <Th colSpan={4} textAlign="right">Итого:</Th>
                          <Th isNumeric fontSize="lg">₽{orderDetails.totalAmount.toLocaleString()}</Th>
                        </Tr>
                      </Tfoot>
                    </Table>
                  </Card>
                </Box>

                {orderDetails.notes && (
                  <Box p={4} borderRadius="md" bg={useColorModeValue('yellow.50', 'yellow.900')} borderWidth="1px" borderColor={useColorModeValue('yellow.200', 'yellow.700')}>
                    <Flex align="center" mb={2}>
                      <Icon as={FiMessageSquare} color={useColorModeValue('yellow.500', 'yellow.300')} mr={2} />
                      <Text fontWeight="bold" color={useColorModeValue('yellow.700', 'yellow.300')}>Примечания:</Text>
                    </Flex>
                    <Text>{orderDetails.notes}</Text>
                  </Box>
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter 
            bg={useColorModeValue('gray.50', 'gray.800')} 
            borderTopWidth="1px" 
            borderBottomRadius="xl"
          >
            <Button variant="ghost" onClick={onClose} leftIcon={<FiX />}>Закрыть</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// Price List Panel Component (Clinic only)
const PriceListPanel = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await API.get('/prices');
        setPrices(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching prices:', err);
        setLoading(false);
      }
    };
    
    fetchPrices();
  }, []);
  
  const filteredPrices = prices.filter(
    price => price.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const cardBg = useColorModeValue('white', 'gray.700');
  
  if (loading) {
    return (
      <Center h="200px">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    );
  }
  
  return (
    <Box>
      <Heading size="md" mb={4}>Прайс-лист</Heading>
      
      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Поиск товара..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </InputGroup>
      
      <Card bg={cardBg} boxShadow="sm" borderRadius="lg" overflow="hidden">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Название</Th>
              <Th isNumeric>Цена</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredPrices.map(price => (
              <Tr key={price._id}>
                <Td fontWeight="medium">{price.product.name}</Td>
                <Td isNumeric fontWeight="bold">₽{price.price.toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </Box>
  );
};

// Create Order Panel Component (Clinic only)
const CreateOrderPanel = ({ setActiveTab }) => {
  const [prices, setPrices] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);
  
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const res = await API.get('/prices');
        setPrices(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching prices:', err);
        setErrorMessage('Ошибка загрузки прайс-листа: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };
    
    // Set default deadline to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);
    setDeadline(tomorrow.toISOString().split('T')[0]);
    
    fetchPrices();
  }, []);
  
  const addItem = (price) => {
    const existingItem = selectedItems.find(item => item.priceId === price._id);
    
    if (existingItem) {
      setSelectedItems(
        selectedItems.map(item => 
          item.priceId === price._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          priceId: price._id,
          productId: price.product._id,
          productName: price.product.name,
          price: price.price,
          quantity: 1,
          color: ''
        }
      ]);
    }
  };
  
  const removeItem = (priceId) => {
    setSelectedItems(selectedItems.filter(item => item.priceId !== priceId));
  };
  
  const updateQuantity = (priceId, quantity) => {
    if (quantity < 1) return;
    
    setSelectedItems(
      selectedItems.map(item => 
        item.priceId === priceId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const updateColor = (priceId, color) => {
    setSelectedItems(
      selectedItems.map(item => 
        item.priceId === priceId 
          ? { ...item, color }
          : item
      )
    );
  };
  
  const handleSubmit = async () => {
    // Validation
    if (selectedItems.length === 0) {
      setErrorMessage('Добавьте хотя бы один товар');
      return;
    }
    
    if (!patientName.trim()) {
      setErrorMessage('Введите ФИО пациента');
      return;
    }
    
    if (!deadline) {
      setErrorMessage('Укажите срок сдачи работы');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Transform items
      const orderItems = selectedItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        color: item.color || ''  // Обеспечиваем, что color всегда будет строкой
      }));
      
      // Создаем объект заказа
      const orderData = {
        patientName: patientName.trim(),
        deadline,
        items: orderItems,
        notes: notes.trim()
      };
      
      console.log('Отправляем данные заказа:', orderData);
      
      const response = await API.post('/orders', orderData);
      
      console.log('Ответ сервера:', response.data);
      
      setCreatedOrder(response.data);
      
      // Reset form
      setSelectedItems([]);
      setPatientName('');
      setDeadline('');
      setNotes('');
      setSuccessMessage(`Заказ #${response.data.orderNumber} успешно создан`);
      
      // Clear success message and navigate to orders tab after 2 seconds
      setTimeout(() => {
        setSuccessMessage('');
        setActiveTab(2); // Изменено с 1 на 2, так как это вкладка с заказами для клиники
      }, 2000);
    } catch (err) {
      console.error('Error creating order:', err);
      
      // Детальный вывод ошибки
      if (err.response) {
        // Ошибка с сервера с ответом
        console.error('Response error data:', err.response.data);
        console.error('Response status:', err.response.status);
        setErrorMessage(`Ошибка при создании заказа: ${err.response.data.message || 'Ошибка сервера'}`);
      } else if (err.request) {
        // Запрос был сделан, но нет ответа
        console.error('Request was made but no response:', err.request);
        setErrorMessage('Ошибка сети: сервер не отвечает');
      } else {
        // Что-то случилось при настройке запроса
        setErrorMessage('Ошибка при создании заказа: ' + err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const filteredPrices = prices.filter(
    price => price.product && price.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalAmount = selectedItems.reduce(
    (total, item) => total + (item.price * item.quantity), 
    0
  );
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  if (loading && prices.length === 0) {
    return (
      <Center h="200px">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    );
  }
  
  return (
    <Box>
      <Heading size="md" mb={6}>Создание заказа</Heading>
      
      {successMessage && (
        <Box mb={6} p={4} borderRadius="md" bg="green.100" color="green.800">
          <Flex alignItems="center">
            <Icon as={FiCheck} mr={2} />
            <Text fontWeight="medium">{successMessage}</Text>
            <Spacer />
            <Button 
              size="sm" 
              colorScheme="green" 
              variant="outline"
              onClick={() => setActiveTab(1)}
            >
              К заказам
            </Button>
          </Flex>
        </Box>
      )}
      
      {errorMessage && (
        <Box mb={6} p={4} borderRadius="md" bg="red.100" color="red.800">
          {errorMessage}
        </Box>
      )}
      
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6}>
        <Box>
          <Card bg={cardBg} boxShadow="sm" borderRadius="lg" mb={4}>
            <CardHeader pb={2}>
              <Heading size="sm">Данные заказа</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>ФИО пациента</FormLabel>
                  <Input 
                    placeholder="Введите ФИО пациента" 
                    value={patientName} 
                    onChange={e => setPatientName(e.target.value)}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Срок сдачи</FormLabel>
                  <Input 
                    type="date" 
                    value={deadline} 
                    onChange={e => setDeadline(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Примечания</FormLabel>
                  <Input 
                    placeholder="Дополнительная информация" 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)}
                  />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>
          
          <Card bg={cardBg} boxShadow="sm" borderRadius="lg" mb={4}>
            <CardHeader pb={2}>
              <Heading size="sm">Товары и услуги</Heading>
            </CardHeader>
            <CardBody>
              <InputGroup mb={4}>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Поиск товара..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              
              {loading ? (
                <Center py={4}>
                  <Spinner size="md" color="brand.500" thickness="4px" />
                </Center>
              ) : filteredPrices.length > 0 ? (
                <Box maxH="400px" overflowY="auto">
                  <Table variant="simple" size="sm">
                    <Thead position="sticky" top={0} bg={cardBg} zIndex={1}>
                      <Tr>
                        <Th>Название</Th>
                        <Th isNumeric>Цена</Th>
                        <Th width="80px"></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredPrices.map(price => (
                        <Tr key={price._id}>
                          <Td>{price.product.name}</Td>
                          <Td isNumeric>₽{price.price.toLocaleString()}</Td>
                          <Td>
                            <IconButton
                              icon={<FiPlus />}
                              aria-label="Добавить"
                              size="xs"
                              colorScheme="brand"
                              onClick={() => addItem(price)}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              ) : (
                <Center py={8}>
                  <VStack>
                    <Icon as={FiPackage} fontSize="4xl" color="gray.400" />
                    <Text color="gray.500">Товары не найдены</Text>
                    <Text fontSize="sm" color="gray.400">
                      {searchTerm ? 'Попробуйте изменить параметры поиска' : 'Список товаров пуст'}
                    </Text>
                  </VStack>
                </Center>
              )}
            </CardBody>
          </Card>
        </Box>
        
        <Box>
          <Card bg={cardBg} boxShadow="sm" borderRadius="lg" mb={4}>
            <CardHeader pb={2}>
              <Heading size="sm">Корзина</Heading>
            </CardHeader>
            <CardBody>
              {selectedItems.length > 0 ? (
                <>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Название</Th>
                        <Th>Кол-во</Th>
                        <Th>Цвет</Th>
                        <Th isNumeric>Цена</Th>
                        <Th isNumeric>Сумма</Th>
                        <Th width="40px"></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {selectedItems.map(item => (
                        <Tr key={item.priceId}>
                          <Td>{item.productName}</Td>
                          <Td>
                            <HStack maxW="100px">
                              <IconButton
                                icon={<Icon as={FiTrash2} />}
                                aria-label="Уменьшить"
                                size="xs"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => updateQuantity(item.priceId, item.quantity - 1)}
                              />
                              <Text textAlign="center" w="30px">{item.quantity}</Text>
                              <IconButton
                                icon={<FiPlus />}
                                aria-label="Увеличить"
                                size="xs"
                                variant="ghost"
                                colorScheme="brand"
                                onClick={() => updateQuantity(item.priceId, item.quantity + 1)}
                              />
                            </HStack>
                          </Td>
                          <Td>
                            <Input 
                              placeholder="Цвет"
                              size="sm"
                              value={item.color || ''}
                              onChange={e => updateColor(item.priceId, e.target.value)}
                            />
                          </Td>
                          <Td isNumeric>₽{item.price.toLocaleString()}</Td>
                          <Td isNumeric>₽{(item.price * item.quantity).toLocaleString()}</Td>
                          <Td>
                            <IconButton
                              icon={<FiTrash2 />}
                              aria-label="Удалить"
                              size="xs"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => removeItem(item.priceId)}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  
                  <Divider my={4} />
                  
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="bold">Итого:</Text>
                    <Text fontWeight="bold" fontSize="xl">₽{totalAmount.toLocaleString()}</Text>
                  </Flex>
                  
                  <Button 
                    colorScheme="brand" 
                    mt={4} 
                    width="full"
                    disabled={selectedItems.length === 0 || isSubmitting}
                    isLoading={isSubmitting}
                    onClick={handleSubmit}
                  >
                    Оформить заказ
                  </Button>
                </>
              ) : (
                <Center py={8}>
                  <VStack>
                    <Icon as={FiShoppingCart} fontSize="4xl" color="gray.400" />
                    <Text color="gray.500">Корзина пуста</Text>
                    <Text fontSize="sm" color="gray.400">
                      Добавьте товары из списка слева
                    </Text>
                  </VStack>
                </Center>
              )}
            </CardBody>
          </Card>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, accentColor, onClick }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');
  
  return (
    <Card 
      bg={cardBg} 
      boxShadow="md" 
      borderRadius="xl"
      cursor={onClick ? "pointer" : "default"}
      transition="all 0.2s"
      _hover={onClick ? { 
        bg: hoverBg, 
        transform: 'translateY(-5px)', 
        boxShadow: 'lg' 
      } : {}}
      onClick={onClick}
      overflow="hidden"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <CardBody p={6}>
        <Flex justify="space-between" align="center">
          <Box>
            <Stat>
              <StatLabel 
                fontSize="md" 
                fontWeight="medium" 
                color="gray.500"
                mb={2}
              >
                {title}
              </StatLabel>
              <StatNumber 
                fontSize="3xl" 
                fontWeight="bold"
                lineHeight="1"
              >
                {value}
              </StatNumber>
            </Stat>
          </Box>
          <Flex
            flexShrink={0}
            alignItems="center"
            justifyContent="center"
            borderRadius="full"
            bg={`${accentColor}15`}
            color={accentColor}
            boxSize={16}
            boxShadow="md"
          >
            <Icon as={icon} boxSize={8} />
          </Flex>
        </Flex>
        
        {onClick && (
          <Flex 
            mt={4} 
            pt={4} 
            borderTopWidth="1px" 
            borderColor={useColorModeValue('gray.100', 'gray.700')}
            justifyContent="flex-end"
            color={accentColor}
            fontWeight="medium"
            alignItems="center"
          >
            <Text>Подробнее</Text>
            <Icon as={FiArrowRight} ml={1} />
          </Flex>
        )}
      </CardBody>
    </Card>
  );
};

// Helper functions
const getStatusText = (status) => {
  switch (status) {
    case 'pending': return 'Не оплачен';
    case 'paid': return 'Оплачен';
    case 'cancelled': return 'Отменен';
    default: return status;
  }
};

const getStatusColorScheme = (status) => {
  switch (status) {
    case 'pending': return 'orange';
    case 'paid': return 'green';
    case 'cancelled': return 'red';
    default: return 'gray';
  }
};

const getPluralForm = (count) => {
  // Russian plural forms for "item"
  if (count % 10 === 1 && count % 100 !== 11) {
    return 'товар';
  } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return 'товара';
  } else {
    return 'товаров';
  }
};

export default Dashboard;