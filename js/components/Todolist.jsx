import React from 'react';
import fetch from 'isomorphic-fetch'
import style from '../../sass/style.scss';
import moment from 'moment'

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
    api ="http://localhost:3000" ;

    constructor(props, context) {
        super(props, context);
        this.state = {
            open: true,
            todayTasks:[],
            tomorrowTasks:[],
            someDayTasks:[],
        };
    }

// Operations on array of tasks

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

    checkArray(when){
        let tasks
        if (when==="todayTasks")
        {tasks= this.state.todayTasks}
        else if (when==="tomorrowTasks")
            {tasks=this.state.tomorrowTasks}
            else   {tasks=this.state.someDayTasks}
        return tasks
    }


// Update db and state of the task's list

    getTodayTasks(){
        fetch(this.api+"/todayTasks",{
            method:'get',}
        )
            .then(r => r.json())
            .then( data => {
                this.sortByKey(data,"status");
                this.setState({todayTasks:data});
            });
    }

    getTomorrowTasks(){
        let today = moment().format("DD-MM-YYYY");
        let newToday;

        fetch(this.api+"/tomorrowTasks",{
            method:'get'}
        )
            .then(r => r.json())
            .then( data => {
                this.sortByKey(data, "status");
                // check what tasks are still to do tomorrow
                let tomorrowTasks = data.filter(el => {
                    return el.date !== today
                })
                this.setState({tomorrowTasks: tomorrowTasks});

                // check if there are abt tasks that yesterday were to do tomorrow, so they are today to do today :D
                // if so delete them from Tomorrow Array and add them to today task's list
                newToday = data.filter(el => {
                    return el.date === today
                })
                if (newToday.length>0) {
                    newToday.forEach((el) => {
                        this.moveTasks(el,"todayTasks", "tomorrowTasks")
                    });

                }
            })
    }

    moveTasks(task, when, from){
        this.addTask(task.name,when)
        this.deleteTask(task.id, from)
    }

    getSomeDayTasks(){
        fetch(this.api+"/someDayTasks",{
            method:'get',}
        )
            .then(r => r.json())
            .then( data => {
                this.sortByKey(data,"status");
                this.setState({someDayTasks:data});
            });
    }

    getTasks(){
        this.getSomeDayTasks();
        this.getTomorrowTasks();
        this.getTodayTasks();
    }

    addTask = (name,when) => {
        // set when this task should be done
        let date;
        if (when==="todayTasks"){
            date = moment().format("DD-MM-YYYY")}
        else if (when==="tomorrowTasks"){
            date = moment().add(1, 'd').format("DD-MM-YYYY")}
            else date = "some day"

        let id = moment();

        let task = {
            id: id,
            name: name,
            status:"active",
            date:date
        }

        fetch(this.api+"/"+when, {
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


    deleteTask(id, when) {
        var url = this.api+"/"+when+"/"+id;
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

    removeTasksFromArray(when){
        let tasks = this.checkArray(when)
        for(var i =  tasks.length-1; i >=0; i--) {
            if(tasks[i].status === "done") {
               this.deleteTask(tasks[i].id,when);
            }
        }
    }

    removeAllDone(){
        this.removeTasksFromArray("tomorrowTasks");
        this.removeTasksFromArray("todayTasks");
        this.removeTasksFromArray("someDayTasks");
    }

    doneTask(id,when){
        let tasks=this.checkArray(when)
        var index = tasks.map(function(task) {return task.id;}).indexOf(id);
        let task = tasks[index];
        task.status = "done"
        var url = this.api+"/"+when+"/"+id;
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
    }

// Render elements of the list

    renderTasks(when){
        let tasks = this.checkArray(when)
        if (tasks.length>0) {
        return tasks.map(el => {
            return <ToDoItem
                value={el.name} status={el.status}
                delete={() => this.deleteTask(el.id,when)}
                done={()=>this.doneTask(el.id, when)}
            />
        })} else return <p className="watermark">Wszystko zrobione</p>
    }

    render() {
        return (

            <Grid>
                <Row className="show-grid">
                    <Col xs={12}>

                        <Navbar>
                            <Col xs={12} sm={4} md={2}>
                                <h1>To do list</h1>
                            </Col>
                            <Col xs={12} sm={8} md={10}>
                                <Nav>
                                    <NavItem>
                                        <AddTaskModal onClick={this.addTask}/>
                                    </NavItem>
                                    <NavItem>
                                        <Button onClick={()=>this.removeAllDone()}>Remove done</Button>
                                    </NavItem>
                                </Nav>
                            </Col>
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
                                    {this.renderTasks("todayTasks")}
                                </Panel.Body>
                            </Panel.Collapse>
                        </Panel>
                        <Panel id="collapsible-panel-example-2">
                            <Panel.Heading>
                                <Panel.Title toggle>
                                    Zadania na jutro
                                </Panel.Title>
                            </Panel.Heading>
                            <Panel.Collapse>
                                <Panel.Body>
                                    {this.renderTasks("tomorrowTasks")}
                                </Panel.Body>
                            </Panel.Collapse>
                        </Panel>
                        <Panel id="collapsible-panel-example-2" >
                            <Panel.Heading>
                                <Panel.Title toggle>
                                    Zadania na kiedyś
                                </Panel.Title>
                            </Panel.Heading>
                            <Panel.Collapse>
                                <Panel.Body>
                                    {this.renderTasks("someDayTasks")}
                                </Panel.Body>
                            </Panel.Collapse>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

