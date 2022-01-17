import React, { Fragment } from 'react';
import { useNavigate } from "react-router-dom";
import styled from '../../assets/styles/layout.module.scss'
import { Box, SwipeableDrawer, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Menu, VerifiedUser, PersonAdd, Home } from '@mui/icons-material';

export default function Layout({ children }) {
    const navigate = useNavigate();

    const [state, setState] = React.useState({
        left: false
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    return (
        <Fragment>
            <div>
                {['left'].map((anchor) => (
                    <Fragment key={anchor}>
                        <Button onClick={toggleDrawer(anchor, true)}><Menu /></Button>
                        <SwipeableDrawer
                            anchor={anchor}
                            open={state[anchor]}
                            onClose={toggleDrawer(anchor, false)}
                            onOpen={toggleDrawer(anchor, true)}
                        >
                            <Box
                                sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
                                role="presentation"
                                onClick={toggleDrawer(anchor, false)}
                                onKeyDown={toggleDrawer(anchor, false)}
                            >
                                <List>
                                    <ListItem button key={'text'} onClick={() => navigate('/')}>
                                        <ListItemIcon>
                                            <Home />
                                        </ListItemIcon>
                                        <ListItemText primary={'Home'} />
                                    </ListItem>
                                    <ListItem button key={'text'} onClick={() => navigate('/cadastro')}>
                                        <ListItemIcon>
                                            <PersonAdd />
                                        </ListItemIcon>
                                        <ListItemText primary={'Cadastro'} />
                                    </ListItem>
                                    <ListItem button key={'text'} onClick={() => navigate('/permissoes')}>
                                        <ListItemIcon>
                                            <VerifiedUser />
                                        </ListItemIcon>
                                        <ListItemText primary={'Permissões'} />
                                    </ListItem>
                                </List>
                            </Box>
                        </SwipeableDrawer>
                    </Fragment>
                ))
                }
            </div >
            <div className={styled.mainContent}>
                {children}
            </div>
        </Fragment>
    )
}