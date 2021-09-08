import { FaSearch } from 'react-icons/fa';
import React, { Component } from "react";
import "../../assets/scss/navbar.scss";
import Sidenav from '../SideNav';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        alert('Você Digitou: ' + this.state.value);
        event.preventDefault();
    }

    render() {
        return (
            <div className="Navbar">
                <div className="SideNav">
                    <Sidenav />
                </div>
                <form className="SearchBar">
                    <input type="text"
                        placeholder="Search..."
                        value={this.state.value}
                        onChange={this.handleChange}
                    />
                    <FaSearch className="FaSearch" onClick={this.handleSubmit} />

                </form>
                <span />
            </div >
        );
    }
}
export default Navbar;
