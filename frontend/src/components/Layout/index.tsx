import React, { Fragment } from 'react';
import { useNavigate } from "react-router-dom";
import styled from '../../assets/styles/layout.module.scss';
import { Box, SwipeableDrawer, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { GitHub, Instagram, LinkedIn, Twitter } from '@mui/icons-material';
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
            <div className={styled.header}>
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
                        <div className={styled.lastMenuItem}>
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
            <div className={styled.mainContent}>
                {children}
            </div>
            <div className={styled.contactInfo}>
                <p> Projeto Dryad LdapAdmin2.0 Desenvolvido por Thiago Diniz </p>
                <div>
                    <p>Entre em contato:</p>
                    <a target="_blank" rel="noreferrer" href="https://www.instagram.com/diniz_dev/"><Instagram /></a>
                    <a target="_blank" rel="noreferrer" href="https://twitter.com/diniz_dev"><Twitter /></a>
                    <a target="_blank" rel="noreferrer" href="https://github.com/ThiagoDinizSilva"><GitHub /></a>
                    <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/thiagodinizsilva/"><LinkedIn /></a>
                </div>
            </div>
        </Fragment>
    )
}