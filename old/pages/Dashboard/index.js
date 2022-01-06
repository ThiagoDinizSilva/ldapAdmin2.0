import React, { Fragment } from 'react';
import "../../assets/scss/dashboard.scss";
import Card from '../../components/Card';
import { AiOutlineIdcard, AiOutlineUser, AiOutlineTeam } from 'react-icons/ai';
import { useHistory } from 'react-router';


function Dashboard() {
    const history = useHistory();
    function handleCard(e) {
        const id = e.target.id
        history.push({
            pathname: id,
        })
    }
    return (
        <main>
            <div className="card-list">
                <Card onClick={handleCard} id='usuarios'>
                    <AiOutlineUser
                        className="card-icon" />
                    <p className="card-text">
                        Usuários
                    </p>
                </Card>
                <Card onClick={handleCard} id='grupos'>
                    <AiOutlineTeam
                        className="card-icon" />
                    <p className="card-text">
                        Grupos
                    </p>
                </Card>
                <Card onClick={handleCard} id='config'>
                    <AiOutlineIdcard
                        className="card-icon" />
                    <p className="card-text">
                        Admin
                    </p>
                </Card>
            </div>
        </main>
    );
};

export default Dashboard;
