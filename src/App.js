import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {
    Alert,
    AppBar,
    Box,
    Toolbar,
    Typography,
    TextField,
    Container,
    Button,
    Modal,
    Avatar,
    IconButton,
    Input,
    Paper,
    Divider,
    Link,
    Menu,
    MenuItem,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircle from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactJson from 'react-json-view';
import { Auth, getUser } from './auth';
import {
    deleteFragment,
    getUserFragments,
    postFragment,
    viewFragment,
    convertFragment,
    updateFragment,
} from './api';
import { DropBox } from './DropBox';
import { FileList } from './FileList';
const typeList = ['TXT', 'MD', 'HTML', 'JSON', 'PNG', 'JPG', 'GIF', 'WEBP'];

function App() {
    const [content, setContent] = useState();
    const [droppedFiles, setDroppedFiles] = useState([]);
    const [contentType, setContentType] = useState('');
    const [fragments, setFragments] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [viewContent, setViewContent] = useState(null);
    const [convertType, setConvertType] = useState('');
    const [downloadLink, setDownloadLink] = useState('');
    const [convertError, setConvertError] = useState('');
    const [activeFragmentId, setActiveFragmentId] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
        setDownloadLink('');
    };
    const handleClose = (type) => {
        setAnchorEl(null);
        setConvertType(type);
        setConvertError('');
    };
    const handleViewClose = () => {
        setViewOpen(false);
        setDownloadLink('');
        setConvertError('');
        setConvertType('');
        setActiveFragmentId('');
    };
    const handleUpdateClose = () => setUpdateOpen(false);

    async function init() {
        const userSection = document.querySelector('#user');
        const loginBtn = document.querySelector('#login');
        const logoutBtn = document.querySelector('#logout');

        loginBtn.onclick = () => {
            Auth.federatedSignIn();
        };
        logoutBtn.onclick = () => {
            Auth.signOut();
            setLoggedIn(false);
        };

        const user = await getUser();
        if (!user) {
            return;
        } else {
            setLoggedIn(true);
        }
        const data = await getUserFragments(user);
        setFragments(data.fragments);
        console.log({ user });

        userSection.hidden = false;
        userSection.innerText = user.username;
        loginBtn.disabled = true;
    }

    async function submit(e) {
        e.preventDefault();
        const user = await getUser();

        await postFragment(user, content, contentType);
        setContent(null);
        const data = await getUserFragments(user);
        setFragments(data.fragments);

        setContentType('');
        setDroppedFiles([]);
    }

    function logout() {
        Auth.signOut();
        setLoggedIn(false);
    }

    async function viewClicked(id, type) {
        setViewOpen(true);
        setContentType(type);
        setActiveFragmentId(id);

        const user = await getUser();
        console.log('ACTIVE FRAGMENT ID', activeFragmentId);
        const data = await viewFragment(user, id, type);
        setViewContent(data);
    }

    async function convertClicked(id, type) {
        setDownloadLink('');
        const user = await getUser();
        const blobURL = await convertFragment(user, id, type.toLowerCase());
        if (!blobURL) {
            setConvertError('Invalid conversion request');
            return;
        }
        setDownloadLink(blobURL);
    }

    async function updateClicked(e) {
        setUpdateOpen(true);
        setContentType('');
        const fragmentId = e.target.id.replace('update-', '');
        setActiveFragmentId(fragmentId);
        const user = await getUser();
        const data = await viewFragment(user, activeFragmentId);
        setViewContent(data);
    }

    async function updateContent() {
        const user = await getUser();
        await updateFragment(user, activeFragmentId, content);
        setContent(null);

        const data = await getUserFragments(user);
        setFragments(data.fragments);
        setContentType('');
    }

    async function deleteClicked(id) {
        const user = await getUser();
        await deleteFragment(user, id);
        const data = await getUserFragments(user);
        setFragments(data.fragments);
    }

    const handleFileDrop = useCallback(
        (item) => {
            if (item) {
                const files = item.files;
                setContentType(files[0].type);

                setContent(null);
                const reader = new FileReader();
                reader.onload = () => {
                    const content = reader.result;
                    setContent(content);
                };
                reader.readAsArrayBuffer(files[0]);
                setDroppedFiles(files);
            }
        },
        [setDroppedFiles]
    );

    useEffect(() => {
        init();
    }, []);

    return (
        <Box>
            <AppBar position='static'>
                <Toolbar>
                    <Typography
                        variant='h6'
                        component='div'
                        sx={{ flexGrow: 1 }}>
                        Fragments UI
                    </Typography>
                    <IconButton
                        size='large'
                        aria-label='account of current user'
                        aria-controls='menu-appbar'
                        aria-haspopup='true'
                        color='inherit'
                        onClick={logout}>
                        <AccountCircle />
                    </IconButton>
                    <Typography
                        id='user'
                        variant='body1'
                        component='span'></Typography>
                </Toolbar>
            </AppBar>

            <Container>
                {loggedIn ? (
                    <></>
                ) : (
                    <Container maxWidth='sm'>
                        <Box
                            sx={{
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: 600,
                                height: 300,
                            }}>
                            {/* <Avatar sx={{ m: 1, bgcolor: 'primary.info' }}>
                        <LockIcon />
                    </Avatar>
                    <Typography component='h1' variant='h5'>
                        Log In
                    </Typography> */}
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
                                id='login'
                                type='submit'
                                fullWidth
                                variant='contained'
                                sx={{ mt: 3, mb: 2 }}>
                                <LoginIcon />
                                &nbsp;&nbsp;&nbsp;&nbsp;Log
                                In&nbsp;&nbsp;&nbsp;&nbsp;
                            </Button>
                            <Button
                                id='logout'
                                type='submit'
                                fullWidth
                                variant='contained'
                                sx={{ mt: 1, mb: 2 }}>
                                <LogoutIcon />
                                &nbsp;&nbsp;Log Out
                            </Button>
                        </Box>
                    </Container>
                )}

                {loggedIn ? (
                    <>
                        <Container maxWidth='sm' sx={{ height: 560 }}>
                            <Box
                                sx={{
                                    marginTop: 5,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    width: 600,
                                    height: 300,
                                }}>
                                <Paper
                                    style={{ padding: 20 }}
                                    sx={{ width: 600 }}
                                    variant='elevation'>
                                    <Typography
                                        variant='h5'
                                        align='center'
                                        component='h3'
                                        gutterBottom>
                                        Submit a Text to Fragment Server
                                    </Typography>
                                    <TextField
                                        id='fragment-text'
                                        name='text-box'
                                        type='text'
                                        value={content}
                                        placeholder='Enter a text to submit'
                                        fullWidth
                                        multiline
                                        rows={4}
                                        onChange={(e) =>
                                            setContent(e.target.value)
                                        }
                                    />
                                    <Divider
                                        sx={{ marginTop: 3, marginBottom: 2 }}
                                    />
                                    <Typography
                                        variant='h5'
                                        align='center'
                                        component='h3'
                                        gutterBottom>
                                        Or Drag a File Here to Upload
                                    </Typography>
                                    <DndProvider backend={HTML5Backend}>
                                        <DropBox onDrop={handleFileDrop} />
                                        <FileList files={droppedFiles} />
                                    </DndProvider>
                                    <Button
                                        id='submit'
                                        type='submit'
                                        fullWidth
                                        variant='outlined'
                                        sx={{ mt: 1, mb: 2 }}
                                        onClick={submit}>
                                        &nbsp;&nbsp;&nbsp;&nbsp;Submit
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                    </Button>
                                </Paper>
                            </Box>
                        </Container>

                        <Container maxWidth='lg'>
                            <TableContainer
                                component={Paper}
                                sx={{ width: '100%' }}>
                                <Table aria-label='fragment metadata table'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Created</TableCell>
                                            <TableCell>Updated</TableCell>
                                            <TableCell>Content Type</TableCell>
                                            <TableCell>Size</TableCell>
                                            <TableCell>Modify</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fragments.length > 0 ? (
                                            fragments.map((fragment) => {
                                                return (
                                                    <TableRow
                                                        key={`row-${fragment.id}`}>
                                                        <TableCell>
                                                            {fragment.id}
                                                        </TableCell>
                                                        <TableCell>
                                                            {new Date(
                                                                fragment.created
                                                            ).toISOString()}
                                                        </TableCell>
                                                        <TableCell>
                                                            {new Date(
                                                                fragment.updated
                                                            ).toISOString()}
                                                        </TableCell>
                                                        <TableCell>
                                                            {fragment.type}
                                                        </TableCell>
                                                        <TableCell>
                                                            {fragment.size}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                id={`view-${fragment.id}`}
                                                                onClick={(e) =>
                                                                    viewClicked(
                                                                        e.target.id.replace(
                                                                            'view-',
                                                                            ''
                                                                        ),
                                                                        fragment.type
                                                                    )
                                                                }>
                                                                View
                                                            </Button>
                                                            <Modal
                                                                open={viewOpen}
                                                                onClose={
                                                                    handleViewClose
                                                                }
                                                                aria-labelledby='modal-modal-title'
                                                                aria-describedby='modal-modal-description'>
                                                                <Box
                                                                    sx={{
                                                                        position:
                                                                            'absolute',
                                                                        top: '50%',
                                                                        left: '50%',
                                                                        transform:
                                                                            'translate(-50%, -50%)',
                                                                        width: 660,
                                                                        maxWidth: 900,
                                                                        bgcolor:
                                                                            'background.paper',
                                                                        border: '1px solid darkgray',
                                                                        boxShadow: 24,
                                                                    }}>
                                                                    <Paper
                                                                        sx={{
                                                                            p: 4,
                                                                            display:
                                                                                'flex',
                                                                            flexDirection:
                                                                                'column',
                                                                        }}
                                                                        variant='elevation'>
                                                                        <Typography
                                                                            id='modal-fragment-view-id'
                                                                            variant='h5'
                                                                            component='h2'>
                                                                            Fragment
                                                                            ID
                                                                            -&nbsp;
                                                                            {
                                                                                activeFragmentId
                                                                            }
                                                                        </Typography>
                                                                        <Divider variant='inset' />
                                                                        <Container
                                                                            sx={{
                                                                                p: 3,
                                                                            }}
                                                                            id='view-fragment-content'>
                                                                            <Container
                                                                                sx={{
                                                                                    display:
                                                                                        'flex',
                                                                                    justifyContent:
                                                                                        'space-between',
                                                                                    gap: 2,
                                                                                }}>
                                                                                <Typography variant='h6'>
                                                                                    Convert
                                                                                    to
                                                                                    different
                                                                                    format:
                                                                                </Typography>
                                                                                <Button
                                                                                    id='convert-option-button'
                                                                                    aria-controls={
                                                                                        open
                                                                                            ? 'convert-type-menu'
                                                                                            : undefined
                                                                                    }
                                                                                    aria-haspopup='true'
                                                                                    aria-expanded={
                                                                                        open
                                                                                            ? 'true'
                                                                                            : undefined
                                                                                    }
                                                                                    variant='contained'
                                                                                    disableElevation
                                                                                    onClick={
                                                                                        handleClick
                                                                                    }
                                                                                    endIcon={
                                                                                        <KeyboardArrowDownIcon />
                                                                                    }>
                                                                                    {convertType
                                                                                        ? convertType
                                                                                        : 'Options'}
                                                                                </Button>
                                                                                <Menu
                                                                                    id='convert-type-menu'
                                                                                    MenuListProps={{
                                                                                        'aria-labelledby':
                                                                                            'convert-option-button',
                                                                                    }}
                                                                                    anchorEl={
                                                                                        anchorEl
                                                                                    }
                                                                                    open={
                                                                                        open
                                                                                    }
                                                                                    onClose={
                                                                                        handleClose
                                                                                    }>
                                                                                    {typeList.map(
                                                                                        (
                                                                                            type
                                                                                        ) => {
                                                                                            return (
                                                                                                <MenuItem
                                                                                                    key={
                                                                                                        type
                                                                                                    }
                                                                                                    onClick={() =>
                                                                                                        handleClose(
                                                                                                            type
                                                                                                        )
                                                                                                    }
                                                                                                    disableRipple>
                                                                                                    {
                                                                                                        type
                                                                                                    }
                                                                                                </MenuItem>
                                                                                            );
                                                                                        }
                                                                                    )}
                                                                                </Menu>
                                                                                <Button
                                                                                    variant='contained'
                                                                                    onClick={() =>
                                                                                        convertClicked(
                                                                                            activeFragmentId,
                                                                                            convertType
                                                                                        )
                                                                                    }>
                                                                                    Convert
                                                                                </Button>
                                                                            </Container>
                                                                            <Container
                                                                                sx={{
                                                                                    mt: 2,
                                                                                    py: 2,
                                                                                }}>
                                                                                {contentType.startsWith(
                                                                                    'text'
                                                                                ) ? (
                                                                                    <Typography variant='body1'>
                                                                                        {
                                                                                            viewContent
                                                                                        }
                                                                                    </Typography>
                                                                                ) : contentType.startsWith(
                                                                                      'application'
                                                                                  ) ? (
                                                                                    <ReactJson
                                                                                        src={
                                                                                            viewContent
                                                                                        }
                                                                                    />
                                                                                ) : (
                                                                                    <img
                                                                                        src={
                                                                                            viewContent
                                                                                        }
                                                                                        width='100%'
                                                                                        alt='fragment-content'
                                                                                    />
                                                                                )}
                                                                            </Container>

                                                                            {downloadLink ? (
                                                                                <Container
                                                                                    sx={{
                                                                                        mt: 2,

                                                                                        display:
                                                                                            'flex',
                                                                                        justifyContent:
                                                                                            'space-between',
                                                                                    }}>
                                                                                    <Typography variant='body1'>
                                                                                        Conversion
                                                                                        Complete&nbsp;
                                                                                    </Typography>
                                                                                    <Typography variant='body1'>
                                                                                        <Link
                                                                                            href={
                                                                                                downloadLink
                                                                                            }
                                                                                            download={`${activeFragmentId}.${convertType.toLowerCase()}`}>
                                                                                            {`${activeFragmentId}.${convertType.toLowerCase()}`}
                                                                                        </Link>
                                                                                    </Typography>
                                                                                </Container>
                                                                            ) : (
                                                                                ''
                                                                            )}

                                                                            {convertError ? (
                                                                                <Alert severity='warning'>
                                                                                    Invalid
                                                                                    conversion
                                                                                    type
                                                                                </Alert>
                                                                            ) : (
                                                                                ''
                                                                            )}
                                                                        </Container>
                                                                        <Divider variant='middle' />
                                                                        <Button
                                                                            sx={{
                                                                                mt: 2,
                                                                            }}
                                                                            variant='outlined'
                                                                            onClick={
                                                                                handleViewClose
                                                                            }>
                                                                            Close
                                                                        </Button>
                                                                    </Paper>
                                                                </Box>
                                                            </Modal>
                                                            <Button
                                                                id={`update-${fragment.id}`}
                                                                onClick={(e) =>
                                                                    updateClicked(
                                                                        e
                                                                    )
                                                                }>
                                                                Update
                                                            </Button>
                                                            <Modal
                                                                open={
                                                                    updateOpen
                                                                }
                                                                onClose={
                                                                    handleUpdateClose
                                                                }
                                                                aria-labelledby='modal-modal-title'
                                                                aria-describedby='modal-modal-description'>
                                                                <Box
                                                                    sx={{
                                                                        position:
                                                                            'absolute',
                                                                        top: '50%',
                                                                        left: '50%',
                                                                        transform:
                                                                            'translate(-50%, -50%)',
                                                                        width: 660,
                                                                        bgcolor:
                                                                            'background.paper',
                                                                        border: '2px solid #000',
                                                                        boxShadow: 24,
                                                                    }}>
                                                                    <Paper
                                                                        sx={{
                                                                            p: 4,
                                                                            display:
                                                                                'flex',
                                                                            flexDirection:
                                                                                'column',
                                                                        }}
                                                                        variant='elevation'>
                                                                        <Typography
                                                                            id='modal-fragment-update-id'
                                                                            variant='h5'
                                                                            component='h2'>
                                                                            Fragment
                                                                            ID
                                                                            -&nbsp;
                                                                            {
                                                                                fragment.id
                                                                            }
                                                                        </Typography>
                                                                        <Divider variant='inset' />
                                                                        <Container
                                                                            sx={{
                                                                                p: 3,
                                                                            }}>
                                                                            <Typography
                                                                                variant='h6'
                                                                                align='center'
                                                                                component='h6'
                                                                                gutterBottom>
                                                                                Add
                                                                                new
                                                                                text
                                                                                or
                                                                                file
                                                                                to
                                                                                update
                                                                            </Typography>
                                                                            <TextField
                                                                                id='fragment-update-text'
                                                                                name='text-update-box'
                                                                                type='text'
                                                                                value={
                                                                                    content
                                                                                }
                                                                                placeholder='Enter a text to submit'
                                                                                fullWidth
                                                                                multiline
                                                                                rows={
                                                                                    4
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    setContent(
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                }
                                                                            />
                                                                            <Input
                                                                                sx={{
                                                                                    mt: 2,
                                                                                    width: '100%',
                                                                                }}
                                                                                type='file'
                                                                                accept='.txt, .md, .html, .json, .png, .jpg, .gif, .webp'
                                                                            />
                                                                            <Divider
                                                                                sx={{
                                                                                    marginTop: 3,
                                                                                    marginBottom: 2,
                                                                                }}
                                                                            />
                                                                        </Container>
                                                                        <Container
                                                                            sx={{
                                                                                display:
                                                                                    'flex',
                                                                                justifyContent:
                                                                                    'flex-end',
                                                                            }}>
                                                                            <Button
                                                                                onClick={
                                                                                    updateContent
                                                                                }>
                                                                                Update
                                                                            </Button>
                                                                            <Button
                                                                                onClick={
                                                                                    handleUpdateClose
                                                                                }>
                                                                                Cancel
                                                                            </Button>
                                                                        </Container>
                                                                    </Paper>
                                                                </Box>
                                                            </Modal>
                                                            <Button
                                                                onClick={() =>
                                                                    deleteClicked(
                                                                        fragment.id
                                                                    )
                                                                }>
                                                                Delete
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        ) : (
                                            <TableRow>
                                                <TableCell>
                                                    <Typography
                                                        variant='body1'
                                                        align='center'>
                                                        No fragments for the
                                                        user
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Container>
                    </>
                ) : (
                    <Container />
                )}
            </Container>
        </Box>
    );
}

export default App;
