import React, { Fragment } from 'react';
import { useNavigate } from "react-router-dom";
import '../../assets/styles/layout.scss';
import { Box, SwipeableDrawer, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Menu, VerifiedUser, PersonAdd, Home, Logout, Person } from '@mui/icons-material';
import { useAuth } from '../../context/auth';

export const Layout: React.FC = ({ children }) => {
    const navigate = useNavigate();
    const context = useAuth();

    const [state, setState] = React.useState({
        left: false
    });

    const toggleDrawer = () => (event: any) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, left: !state.left });
    };

    return (
        <Fragment>
            <div className='header'>
                <Fragment key={'anchor'}>
                    <Button onClick={toggleDrawer()}><Menu /></Button>
                    <SwipeableDrawer
                        open={state.left}
                        onClose={toggleDrawer()}
                        onOpen={toggleDrawer()}
                    >
                        <Box
                            sx={{ width: 250 }}
                            role="presentation"
                            onClick={toggleDrawer()}
                            onKeyDown={toggleDrawer()}
                        >
                            <List>
                                <ListItem button key={'Home'} onClick={() => navigate('/')}>
                                    <ListItemIcon>
                                        <Home />
                                    </ListItemIcon>
                                    <ListItemText primary={'Home'} />
                                </ListItem>
                                <ListItem button key={'cadastro'} onClick={() => navigate('/cadastro')}>
                                    <ListItemIcon>
                                        <PersonAdd />
                                    </ListItemIcon>
                                    <ListItemText primary={'Cadastro'} />
                                </ListItem>
                                <ListItem button key={'usuarios'} onClick={() => navigate('/usuarios')}>
                                    <ListItemIcon>
                                        <Person />
                                    </ListItemIcon>
                                    <ListItemText primary={'Usuarios'} />
                                </ListItem>
                                <ListItem button key={'permissoes'} onClick={() => navigate('/grupos')}>
                                    <ListItemIcon>
                                        <VerifiedUser />
                                    </ListItemIcon>
                                    <ListItemText primary={'Grupos'} />
                                </ListItem>
                            </List>
                        </Box>
                        <div className='lastMenuItem'>
                            <ListItem button key={'Logout'} onClick={() => context.Logout()}>
                                <ListItemIcon>
                                    <Logout />
                                </ListItemIcon>
                                <ListItemText primary={'Logout'} />
                            </ListItem>
                        </div>
                    </SwipeableDrawer>
                </Fragment>
            </div >
            <div className='mainContent'>
                {children}
            </div>
        </Fragment>
    )
}