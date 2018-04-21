import React from 'react';
import fetch from 'isomorphic-fetch'
import style from '../../sass/style.scss';

import {Panel} from 'react-bootstrap';
import {Grid} from 'react-bootstrap';
import {Row} from 'react-bootstrap';
import {Col} from 'react-bootstrap'
import {Navbar} from 'react-bootstrap';
import {Nav} from 'react-bootstrap';
import {NavItem} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import {AddTaskModal} from "./AddTaskModal";




import  {ToDoItem} from './ToDoItem';


export class Todolist extends React.Component {
    api ="http://localhost:3000/tasks" ;

    constructor(props, context) {
        super(props, context);
        this.state = {
            open: true,
            tasks:[],
            ids:0,
        };
    }

// Operations on array of tasks
    getMaxProperty(arrayOfObjects, property) {
        const arrayOfValues = arrayOfObjects.map(obj => obj[property]);
        return Math.max(...arrayOfValues);
    }
     sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key];
            var y = b[key];

            if (typeof x == "string")
            {
                x = (""+x).toLowerCase();
            }
            if (typeof y == "string")
            {
                y = (""+y).toLowerCase();
            }

            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

// Update db and state of the task's list
    getTasks(){
        fetch(this.api,{
            method:'get',}
        )
            .then(r => r.json())
            .then( data => {
                console.log(data);
                this.sortByKey(data,"status");
                this.setState({tasks:data});

            });
    }

    assignId(){
        let lastId=this.state.ids;
        let newId=lastId+11;

        this.setState(()=>{
            return {ids:newId}});

        return newId;
    }

    addTask = (name) => {
        let id = this.assignId();
        let date = new Date();
        date.getDate();

        let task = {
            id: id,
            name: name,
            status:"active",
            date:date
        }

        fetch(this.api, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            withCredentials: true,
            body: JSON.stringify(task),
        })
            .then(resp => {
                resp.json()
                if (resp.ok) {
                    this.getTasks();
                }
            })
    }


    deleteTask(id) {
        var url = this.api+"/"+id;
        fetch(url, {
                method: 'DELETE',
            })
            .then( resp => {
                resp.json()
                if(resp.ok){
                    this.getTasks();
                }
            })
    }

    removeAllDone(){
        for(var i =  this.state.tasks.length-1; i >=0; i--) {
            if(this.state.tasks[i].status === "done") {
               this.deleteTask(this.state.tasks[i].id);
            }
        }
    }

    doneTask(id){
        var index = this.state.tasks.map(function(task) {return task.id;}).indexOf(id);

        let task = this.state.tasks[index];
        task.status = "done"
        var url = this.api+"/"+id;
        fetch(url, {
            method: 'PUT',
            headers: {"Content-Type": "application/json"},
            withCredentials: true,
            body: JSON.stringify(task),

        })
            .then( resp => {
                resp.json()
                if(resp.ok){
                    this.getTasks();
                }
            })
    }

// Get initial state of the list
    componentWillMount() {
        this.getTasks();
        let tasks=this.state.tasks;
        const newId = this.getMaxProperty(tasks,"status")+1;
        this.setState(()=>{
            return {ids:newId}});
    }

// Render elements of the list
    renderTask(i) {
        return (
            <ToDoItem
                value={this.state.tasks[i].name} status={this.state.tasks[i].status}
                delete={() => this.deleteTask(this.state.tasks[i].id)}
                done={()=>this.doneTask(this.state.tasks[i].id)}
            />
        );
    }

    render() {
        return (

            <Grid>
                <Row className="show-grid">
                    <Col xs={12}>

                        <Navbar>
                            <Navbar.Header>
                                <h1>To do list</h1>
                            </Navbar.Header>
                            <Nav>
                                <NavItem>
                                    <AddTaskModal onClick={this.addTask}/>

                                </NavItem>
                                <NavItem>
                                    <Button onClick={()=>this.removeAllDone()}>Remove all done tasks</Button>
                                </NavItem>
                            </Nav>
                        </Navbar>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Panel id="collapsible-panel-example-2" defaultExpanded>
                            <Panel.Heading>
                                <Panel.Title toggle>
                                    Zadania na dziś
                                </Panel.Title>
                            </Panel.Heading>
                            <Panel.Collapse>
                                <Panel.Body>
                                    {this.state.tasks.map((el, i) => this.renderTask(i))}
                                </Panel.Body>
                            </Panel.Collapse>
                        </Panel>
                        <Panel id="collapsible-panel-example-2" defaultExpanded>
                            <Panel.Heading>
                                <Panel.Title toggle>
                                    Zadania na jutro
                                </Panel.Title>
                            </Panel.Heading>
                            <Panel.Collapse>
                                <Panel.Body>
                                    <ToDoItem></ToDoItem>
                                    <ToDoItem></ToDoItem>
                                    <ToDoItem></ToDoItem>
                                    <ToDoItem></ToDoItem>
                                    <ToDoItem></ToDoItem>
                                    <ToDoItem></ToDoItem>
                                    <ToDoItem></ToDoItem>

                                </Panel.Body>
                            </Panel.Collapse>
                        </Panel>
                        <Panel id="collapsible-panel-example-2" defaultExpanded>
                            <Panel.Heading>
                                <Panel.Title toggle>
                                    Zadania na kiedyś
                                </Panel.Title>
                            </Panel.Heading>
                            <Panel.Collapse>
                                <Panel.Body>
                                    <ToDoItem></ToDoItem>
                                    <ToDoItem></ToDoItem>
                                    <ToDoItem></ToDoItem>
                                    <ToDoItem></ToDoItem>
                                    <ToDoItem></ToDoItem>
                                    <ToDoItem></ToDoItem>
                                    <ToDoItem></ToDoItem>

                                </Panel.Body>
                            </Panel.Collapse>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

