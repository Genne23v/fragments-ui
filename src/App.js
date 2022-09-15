import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

function App() {
    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position='static'>
                    <Toolbar>
                        <Typography
                            variant='h6'
                            component='div'
                            sx={{ flexGrow: 1 }}>
                            Fragments UI
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
            <Container maxWidth='sm'>
                <Box
                    sx={{
                      marginTop: 8, 
                      display: "flex",
                      flexDirection: "column",
                      alignItems: 'center',
                        width: 600,
                        height: 300,
                    }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockIcon />
                    </Avatar>
                    <Typography component='h1' variant='h5'>
                        Log In
                    </Typography>
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        id='email'
                        label='Email Address'
                        name='email'
                        autoComplete='email'
                        autoFocus
                        variant='standard'
                    />
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        name='password'
                        label='Password'
                        type='password'
                        id='password'
                        autoComplete='current-password'
                        variant='standard'
                    />
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        sx={{ mt: 3, mb: 2 }}>
                        <LoginIcon />&nbsp;&nbsp;&nbsp;&nbsp;Log In
                    </Button>
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        sx={{ mt: 1, mb: 2 }}>
                        <LogoutIcon />&nbsp;&nbsp;Log Out
                    </Button>
                </Box>
            </Container>
        </>
    );
}

export default App;
