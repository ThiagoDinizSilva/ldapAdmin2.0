import styled from "styled-components";
const Card = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-family: "PT Serif", serif;
    margin: 4em;
    width: 190px;
    height: 230px;
    background-color: #ffffff9e;
    border: none;
    outline: none;
    border-radius: 5px;
    box-shadow: 0px 0px 25px 2px #0b0d6829;
    transition: ease-in-out 0.3s;
    &:hover {
        background-color: #303157;
        color: #fff;
        box-shadow: 0px 0px 45px -3px #2d2fa123;
    }
`;

export default Card;