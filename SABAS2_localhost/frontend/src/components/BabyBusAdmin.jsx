// import React, { useState, useEffect } from 'react';
// import { styled } from '@mui/material/styles';
// import {
//   Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton,
//   ListItem, ListItemButton, ListItemIcon, ListItemText, Card, CardContent,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
//   Button, Avatar, Chip
// } from '@mui/material';
// import React, { useState, useEffect } from 'react';
// import { styled } from '@mui/material/styles';
// import {
//   Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton,
//   ListItem, ListItemButton, ListItemIcon, ListItemText, Card, CardContent,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
//   Button, Avatar, Chip
// } from '@mui/material';
// import {
//   Menu as MenuIcon, Dashboard as DashboardIcon, People as PeopleIcon,
//   DirectionsBus as BusIcon, Person as PersonIcon, Add as AddIcon,
//   Edit as EditIcon, Delete as DeleteIcon, ChevronLeft as ChevronLeftIcon
// } from '@mui/icons-material';
// import BusManagement from './Dashboard';

// // Styled components for custom theming
// const drawerWidth = 240;

// const AppBarStyled = styled(AppBar)(({ theme }) => ({
//   backgroundColor: '#181E2A',
//   color: '#FFFFFF',
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(['width', 'margin'], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   '& .MuiToolbar-root': {
//     justifyContent: 'space-between',
//   },
// }));

// const DrawerStyled = styled(Drawer)(({ theme }) => ({
//   width: drawerWidth,
//   flexShrink: 0,
//   whiteSpace: 'nowrap',
//   boxSizing: 'border-box',
//   '& .MuiDrawer-paper': {
//     backgroundColor: '#1E293B',
//     color: '#FFFFFF',
//     width: drawerWidth,
//     boxSizing: 'border-box',
//     border: 'none',
//   },
// }));

// const Main = styled('main')(({ theme }) => ({
//   flexGrow: 1,
//   padding: theme.spacing(3),
//   backgroundColor: '#181E2A',
//   minHeight: '100vh',
//   overflow: 'auto',
// }));

// const StatsCard = styled(Card)(({ theme }) => ({
//   backgroundColor: '#1E293B',
//   color: '#FFFFFF',
//   borderRadius: '12px',
//   boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
//   transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
//   '&:hover': {
//     transform: 'translateY(-4px)',
//     boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
//   },
// }));

// const PrimaryButton = styled(Button)(({ theme }) => ({
//   backgroundColor: '#FFB300',
//   color: '#181E2A',
//   borderRadius: '8px',
//   textTransform: 'none',
//   fontWeight: '600',
//   padding: '8px 16px',
//   '&:hover': {
//     backgroundColor: '#FFA000',
//     boxShadow: '0 4px 12px rgba(255, 179, 0, 0.3)',
//   },
// }));

// const SecondaryButton = styled(Button)(({ theme }) => ({
//   backgroundColor: '#6C63FF',
//   color: '#FFFFFF',
//   borderRadius: '8px',
//   textTransform: 'none',
//   fontWeight: '500',
//   padding: '6px 12px',
//   margin: '0 4px',
//   '&:hover': {
//     backgroundColor: '#5951E8',
//     boxShadow: '0 4px 12px rgba(108, 99, 255, 0.3)',
//   },
// }));

// // Dummy data
// const driversData = [
//   { id: 1, name: 'Rajesh Kumar', phone: '+91 9876543210', status: 'Active' },
//   { id: 2, name: 'Suresh Patel', phone: '+91 8765432109', status: 'Active' },
//   { id: 3, name: 'Mohammed Khan', phone: '+91 7654321098', status: 'Inactive' },
//   { id: 4, name: 'Vikram Singh', phone: '+91 6543210987', status: 'Active' },
//   { id: 5, name: 'Anil Sharma', phone: '+91 9432109876', status: 'Active' },
// ];

// const studentsData = [
//   { id: 1, name: 'Aarav Mehta', driver: 'Rajesh Kumar', attendance: 'Present' },
//   { id: 2, name: 'Diya Patel', driver: 'Suresh Patel', attendance: 'Present' },
//   { id: 3, name: 'Arjun Singh', driver: 'Mohammed Khan', attendance: 'Absent' },
//   { id: 4, name: 'Ananya Gupta', driver: 'Vikram Singh', attendance: 'Present' },
//   { id: 5, name: 'Isha Reddy', driver: 'Anil Sharma', attendance: 'Late' },
// ];

// const BabyBusAdmin = () => {
//   const [open, setOpen] = useState(false);
//   const [currentView, setCurrentView] = useState('dashboard');
//   const [drivers, setDrivers] = useState(driversData);
//   const [students, setStudents] = useState(studentsData);

//   const toggleDrawer = () => {
//     setOpen(!open);
//   };

//   const handleMenuItemClick = (view) => {
//     setCurrentView(view);
//   };

//   const handleDeleteDriver = (id) => {
//     setDrivers(drivers.filter(driver => driver.id !== id));
//   };

//   const handleDeleteStudent = (id) => {
//     setStudents(students.filter(student => student.id !== id));
//   };

//   const renderDashboard = () => (
//     <Box>
//       <Typography variant="h4" gutterBottom sx={{ color: '#FFFFFF', mb: 3 }}>
//         Dashboard Overview
//       </Typography>
      
//       {/* Stats Cards */}
//       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
//         <StatsCard sx={{ minWidth: 200, flexGrow: 1 }}>
//           <CardContent>
//             <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//               <BusIcon sx={{ color: '#FFB300', mr: 1 }} />
//               <Typography variant="h6" component="div">
//                 Total Drivers
//               </Typography>
//             </Box>
//             <Typography variant="h4" sx={{ color: '#FFB300' }}>
//               {drivers.length}
//             </Typography>
//           </CardContent>
//         </StatsCard>
        
//         <StatsCard sx={{ minWidth: 200, flexGrow: 1 }}>
//           <CardContent>
//             <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//               <PeopleIcon sx={{ color: '#6C63FF', mr: 1 }} />
//               <Typography variant="h6" component="div">
//                 Total Students
//               </Typography>
//             </Box>
//             <Typography variant="h4" sx={{ color: '#6C63FF' }}>
//               {students.length}
//             </Typography>
//           </CardContent>
//         </StatsCard>
        
//         <StatsCard sx={{ minWidth: 200, flexGrow: 1 }}>
//           <CardContent>
//             <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//               <PersonIcon sx={{ color: '#4CAF50', mr: 1 }} />
//               <Typography variant="h6" component="div">
//                 Active Routes
//               </Typography>
//             </Box>
//             <Typography variant="h4" sx={{ color: '#4CAF50' }}>
//               8
//             </Typography>
//           </CardContent>
//         </StatsCard>
//       </Box>
      
//       <Typography variant="h5" sx={{ color: '#FFFFFF', mb: 2, mt: 4 }}>
//         Recent Activity
//       </Typography>
//       <Typography variant="body1" sx={{ color: '#B0B0B0' }}>
//         Welcome to BabyBus Admin Dashboard. Use the sidebar to navigate between different management sections.
//       </Typography>
//     </Box>
//   );

//   const renderDriversPanel = () => (
//     <Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" sx={{ color: '#FFFFFF' }}>
//           Manage Drivers
//         </Typography>
//         <PrimaryButton startIcon={<AddIcon />}>
//           Add Driver
//         </PrimaryButton>
//       </Box>
      
//       <TableContainer component={Paper} sx={{ backgroundColor: '#1E293B', borderRadius: '12px' }}>
//         <Table sx={{ minWidth: 650 }} aria-label="drivers table">
//           <TableHead>
//             <TableRow>
//               <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Name</TableCell>
//               <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Phone</TableCell>
//               <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Status</TableCell>
//               <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {drivers.map((driver) => (
//               <TableRow key={driver.id}>
//                 <TableCell sx={{ color: '#FFFFFF' }}>{driver.name}</TableCell>
//                 <TableCell sx={{ color: '#B0B0B0' }}>{driver.phone}</TableCell>
//                 <TableCell>
//                   <Chip 
//                     label={driver.status} 
//                     color={driver.status === 'Active' ? 'success' : 'default'}
//                     sx={{ 
//                       backgroundColor: driver.status === 'Active' ? '#4CAF50' : '#757575',
//                       color: '#FFFFFF'
//                     }}
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <SecondaryButton size="small" startIcon={<EditIcon />}>
//                     Edit
//                   </SecondaryButton>
//                   <Button 
//                     variant="outlined" 
//                     size="small" 
//                     startIcon={<DeleteIcon />}
//                     onClick={() => handleDeleteDriver(driver.id)}
//                     sx={{ 
//                       color: '#F44336', 
//                       borderColor: '#F44336',
//                       '&:hover': {
//                         backgroundColor: 'rgba(244, 67, 54, 0.1)',
//                         borderColor: '#F44336'
//                       }
//                     }}
//                   >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );

//   const renderStudentsPanel = () => (
//     <Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" sx={{ color: '#FFFFFF' }}>
//           Manage Students
//         </Typography>
//         <PrimaryButton startIcon={<AddIcon />}>
//           Add Student
//         </PrimaryButton>
//       </Box>
      
//       <TableContainer component={Paper} sx={{ backgroundColor: '#1E293B', borderRadius: '12px' }}>
//         <Table sx={{ minWidth: 650 }} aria-label="students table">
//           <TableHead>
//             <TableRow>
//               <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Name</TableCell>
//               <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Driver</TableCell>
//               <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Attendance</TableCell>
//               <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {students.map((student) => (
//               <TableRow key={student.id}>
//                 <TableCell sx={{ color: '#FFFFFF' }}>{student.name}</TableCell>
//                 <TableCell sx={{ color: '#B0B0B0' }}>{student.driver}</TableCell>
//                 <TableCell>
//                   <Chip 
//                     label={student.attendance} 
//                     color={
//                       student.attendance === 'Present' ? 'success' : 
//                       student.attendance === 'Absent' ? 'error' : 'warning'
//                     }
//                     sx={{ 
//                       backgroundColor: 
//                         student.attendance === 'Present' ? '#4CAF50' : 
//                         student.attendance === 'Absent' ? '#F44336' : '#FF9800',
//                       color: '#FFFFFF'
//                     }}
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <SecondaryButton size="small" startIcon={<EditIcon />}>
//                     Edit
//                   </SecondaryButton>
//                   <Button 
//                     variant="outlined" 
//                     size="small" 
//                     startIcon={<DeleteIcon />}
//                     onClick={() => handleDeleteStudent(student.id)}
//                     sx={{ 
//                       color: '#F44336', 
//                       borderColor: '#F44336',
//                       '&:hover': {
//                         backgroundColor: 'rgba(244, 67, 54, 0.1)',
//                         borderColor: '#F44336'
//                       }
//                     }}
//                   >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );

//   return (
//     <Box sx={{ display: 'flex', backgroundColor: '#181E2A', minHeight: '100vh' }}>
//       <AppBarStyled position="fixed" open={open}>
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             onClick={toggleDrawer}
//             edge="start"
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
//             BabyBus Admin
//           </Typography>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <Avatar sx={{ bgcolor: '#6C63FF', mr: 1 }}>
//               <PersonIcon />
//             </Avatar>
//             <Typography variant="body1">Abhishek Tiwari</Typography>
//           </Box>
//         </Toolbar>
//       </AppBarStyled>
      
//       <DrawerStyled variant="permanent" open={open}>
//         <Toolbar />
//         <Box sx={{ overflow: 'auto', mt: 2 }}>
//           <List>
//             {[
//               { text: 'Dashboard', icon: <DashboardIcon />, view: 'dashboard' },
//               { text: 'Manage Drivers', icon: <PersonIcon />, view: 'drivers' },
//               { text: 'Manage Students', icon: <PeopleIcon />, view: 'students' },
//               { text: 'Manage Parents', icon: <PeopleIcon />, view: 'parents' },
//               { text: 'Manage Buses', icon: <BusIcon />, view: 'buses' },
//             ].map((item) => (
//               <ListItem key={item.text} disablePadding>
//                 <ListItemButton
//                   selected={currentView === item.view}
//                   onClick={() => handleMenuItemClick(item.view)}
//                   sx={{
//                     my: 0.5,
//                     mx: 1,
//                     borderRadius: '8px',
//                     '&.Mui-selected': {
//                       backgroundColor: '#FFB300',
//                       color: '#181E2A',
//                       '&:hover': {
//                         backgroundColor: '#FFA000',
//                       },
//                     },
//                     '&:hover': {
//                       backgroundColor: '#6C63FF',
//                     },
//                   }}
//                 >
//                   <ListItemIcon sx={{ color: currentView === item.view ? '#181E2A' : 'inherit' }}>
//                     {item.icon}
//                   </ListItemIcon>
//                   <ListItemText primary={item.text} />
//                 </ListItemButton>
//               </ListItem>
//             ))}
//           </List>
//         </Box>
//       </DrawerStyled>
      
//       <Main>
//         <Toolbar />
//         {currentView === 'dashboard' && renderDashboard()}
//         {currentView === 'drivers' && renderDriversPanel()}
//         {currentView === 'students' && renderStudentsPanel()}
//         {currentView === 'parents' && renderParentsPanel()}
//         {currentView === 'buses' && <BusManagement />}
//       </Main>
//     </Box>
//   );
// };

// export default BabyBusAdmin;