import React from 'react';
import ReactDOM from 'react-dom';
import style from '../sass/style.scss';
import {Todolist} from "./components/Todolist";


document.addEventListener('DOMContentLoaded',
    function(){
        ReactDOM.render(
            <Todolist/>,
            document.getElementById('app')
        );
    });