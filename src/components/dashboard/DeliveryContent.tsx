'use client';

import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import { 
  Search, 
  Download, 
  Calendar,
  MoreVertical,
  Truck,
  Package,
} from 'lucide-react';
import { useState, useId } from 'react';
import BreadcrumbsNav from '../common/BreadcrumbsNav';

interface DeliveryItem {
  id: string;
  productName: string;
  image: string;
  sku: string;
  stock: number;
  price: number;
  status: 'processed' | 'sent' | 'finished' | 'cancelled' | 'returned' | 'failed';
  orderId: string;
  customer: string;
}

const statusColors = {
  processed: { bg: '#fef3c7', text: '#92400e', label: 'Processed' },
  sent: { bg: '#dbeafe', text: '#1d4ed8', label: 'Sent' },
  finished: { bg: '#d1fae5', text: '#047857', label: 'Finished' },
  cancelled: { bg: '#fee2e2', text: '#dc2626', label: 'Cancelled' },
  returned: { bg: '#fde68a', text: '#d97706', label: 'Return' },
  failed: { bg: '#fecaca', text: '#991b1b', label: 'Delivery Failed' },
};

const mockData: DeliveryItem[] = [
  {
    id: '1',
    productName: 'Wireless Bluetooth Headphones',
    image: '/api/placeholder/48/48',
    sku: 'WBH-001',
    stock: 25,
    price: 79.99,
    status: 'sent',
    orderId: 'ORD-2024-001',
    customer: 'John Doe',
  },
  {
    id: '2',
    productName: 'Gaming Mechanical Keyboard',
    image: '/api/placeholder/48/48',
    sku: 'GMK-002',
    stock: 12,
    price: 149.99,
    status: 'processed',
    orderId: 'ORD-2024-002',
    customer: 'Jane Smith',
  },
  {
    id: '3',
    productName: 'Smart Watch Series 5',
    image: '/api/placeholder/48/48',
    sku: 'SW5-003',
    stock: 8,
    price: 299.99,
    status: 'finished',
    orderId: 'ORD-2024-003',
    customer: 'Mike Johnson',
  },
  {
    id: '4',
    productName: 'Wireless Mouse Pro',
    image: '/api/placeholder/48/48',
    sku: 'WMP-004',
    stock: 45,
    price: 59.99,
    status: 'failed',
    orderId: 'ORD-2024-004',
    customer: 'Sarah Wilson',
  },
  {
    id: '5',
    productName: 'USB-C Hub 7-in-1',
    image: '/api/placeholder/48/48',
    sku: 'UCH-005',
    stock: 33,
    price: 39.99,
    status: 'cancelled',
    orderId: 'ORD-2024-005',
    customer: 'Tom Brown',
  },
];

const tabLabels = [
  'All',
  'Not yet paid',
  'Processed',
  'Sent',
  'Finished',
  'Cancellation',
  'Return',
  'Delivery Failed'
];

export default function DeliveryContent() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const searchFieldId = useId();

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Delivery', href: '/delivery', icon: Truck },
    { label: 'My Delivery', badge: '5' },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 2, md: 3 }, maxWidth: '100%' }}>
      {/* Breadcrumbs */}
      <BreadcrumbsNav items={breadcrumbItems} />

      {/* Page Title */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          color: '#1e293b', 
          mb: 1,
        }}>
          My Delivery
        </Typography>
        <Typography variant="body1" sx={{ 
          color: 'text.secondary',
        }}>
          Track and manage your delivery orders
        </Typography>
      </Box>

      {/* Top Actions */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        flexWrap: 'wrap',
        gap: 2,
      }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1 }}>
          <TextField
            id={searchFieldId}
            placeholder="Search deliveries..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color="#64748b" />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: 300,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                borderRadius: 0,
              },
            }}
          />
          <Button
            variant="outlined"
            startIcon={<Calendar size={16} />}
            sx={{
              textTransform: 'none',
              borderColor: '#d1d5db',
              color: '#374151',
              borderRadius: 0,
            }}
          >
            Date Range
          </Button>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Download size={16} />}
          sx={{
            backgroundColor: '#3b82f6',
            textTransform: 'none',
            borderRadius: 0,
            '&:hover': {
              backgroundColor: '#2563eb',
            },
          }}
        >
          Export
        </Button>
      </Box>

      {/* Status Tabs */}
      <Paper sx={{ mb: 3, overflow: 'hidden', borderRadius: 0 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: '#e5e7eb',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              color: '#64748b',
              '&.Mui-selected': {
                color: '#3b82f6',
                fontWeight: 600,
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#3b82f6',
            },
          }}
        >
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
      </Paper>

      {/* Delivery Table */}
      <Paper sx={{ overflow: 'hidden', borderRadius: 0 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>SKU</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockData.map((item) => (
                <TableRow 
                  key={item.id}
                  sx={{ 
                    '&:hover': { backgroundColor: '#f8fafc' },
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={item.image}
                        sx={{ width: 48, height: 48, borderRadius: 2 }}
                        variant="rounded"
                      />
                      <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                        {item.productName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {item.sku}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '0.875rem' }}>
                      {item.stock}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                      ${item.price}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusColors[item.status].label}
                      size="small"
                      sx={{
                        backgroundColor: statusColors[item.status].bg,
                        color: statusColors[item.status].text,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {item.orderId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '0.875rem' }}>
                      {item.customer}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" sx={{ color: '#64748b' }}>
                      <MoreVertical size={16} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}