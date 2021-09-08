import styled from "styled-components";
export const Input = styled.input`        
        outline: none;
        border: none;
        height:2em;
        padding: 2em 0 0 0;
        width: 100%;
        font-size: 17px;
        border-bottom: 2px solid #b6bdc1;
        transition: all 0.3s;
        ::placeholder{
                color:#b6bdc1;
        }
`;
export const Input2 = styled.input`        
        outline: none;
        border: none;
        height:2em;
        float: left;
        margin-right: 3em;
        padding: 2em 0 0 0;
        width: 18em;
        font-size: 17px;
        border-bottom: 2px solid #b6bdc1;
        transition: all 0.3s;
        ::placeholder{
                color:#b6bdc1;
        }
`;
export const Select1 = styled.select`        
        outline: none;
        border: none;
        height:2.5em;
        width: 100%;
        font-size: 17px;
        font-family: Arial;
        border-bottom: 2px solid #b6bdc1;
        color: #b6bdc1;
        margin: 2em 0 0 0;
        :not(:last-child){
                margin: 2em 2em 0 0;
                
        }
`;