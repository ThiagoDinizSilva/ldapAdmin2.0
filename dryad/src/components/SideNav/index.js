import { HiMenu } from 'react-icons/hi';
import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import "../../assets/scss/sidenav.scss";

class Sidenav extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: false };
    this.className = this.props.className
    this.handleDrawer = this.handleDrawer.bind(this)
  }

  handleDrawer() {
    console.log('2')
    const currentValue = this.state.open
    this.setState({ open: !currentValue })

  }

  render() {
    return (
      <Fragment>
        <HiMenu
          onClick={this.handleDrawer}
          className="button-menu">
        </HiMenu>
        <ul className={`drawer ${this.state.open ? "show" : "hide"}`}>
          <ul className="dropdown">
            <NavLink to='/dashboard'
              className="dropdown__item"
              activeClassName="selected">Home
            </NavLink>
            <NavLink to='/usuarios'
              className="dropdown__item"
              activeClassName="selected">Usuarios
            </NavLink>
            <NavLink to='/grupos'
              className="dropdown__item"
              activeClassName="selected">Grupos
            </NavLink>
            <NavLink to='/config'
              className="dropdown__item"
              activeClassName="selected">Configurações
            </NavLink>
          </ul>
        </ul>

      </Fragment>
    )
  }
}

export default Sidenav;

/*
<li className="dropdown__item">

            <NavLink to='/home'
              className="dropdown__item"
              activeClassName="selected">
              Home
            </NavLink>
            <li className="dropdown__item">
              <span className="dropdown__item-title">Usuarios</span>
              <ul className="dropdown__submenu">
                <NavLink to='/user/register'
                  className="dropdown__submenu-item"
                  activeClassName="selected"
                >Cadastrar</NavLink>
                <NavLink to='/user/import'
                  className="dropdown__submenu-item"
                  activeClassName="selected"
                >Importar</NavLink>
                <NavLink to='/user/search'
                  className="dropdown__submenu-item"
                  activeClassName="selected"
                >Buscar</NavLink>
              </ul>
            </li>
            <NavLink className="dropdown__item" to='/groups' activeClassName="selected">
              Grupos</NavLink> */