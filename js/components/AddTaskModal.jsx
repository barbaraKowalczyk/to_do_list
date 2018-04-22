import React from 'react';
import {Modal} from 'react-bootstrap';
import {Radio} from 'react-bootstrap'
import {Button} from 'react-bootstrap'
import {FormGroup} from 'react-bootstrap'
import {FormControl} from 'react-bootstrap'

export class AddTaskModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false,
            name:"",
            when:"todayTasks"
        };
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }


    handleNameChange = (e) => {
        if ( typeof this.props.onClick === 'function' ){
            const name = e.target.value.replace(/\d/g,
                '');
            this.setState({name:name})
        }
    }


    handleWhenChange = (event) => {
        this.setState({when: event.target.value});
    };

    handleNewTaskAdd = (e) => {
        if ( typeof this.props.onClick === 'function' ){
            const name = e.target.value.replace(/\d/g,
                '');
            this.props.onClick(this.state.name, this.state.when);
        }
    }

    handleNewTaskAndClose = (e) => {
        this.handleNewTaskAdd(e);
        this.setState({ show: false })
    }
    render() {

        return (
            <div>

                <Button bsStyle="primary" onClick={this.handleShow}>
                    Add task
                </Button>

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Dodaj zadanie</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <FormGroup controlId="formInlineName">
                                <FormControl type="text" placeholder="wpisz zadanie" value={this.state.name} onChange={this.handleNameChange} />
                            </FormGroup>
                            <FormGroup>
                                    Kiedy zrobisz zadanie? <b>{this.state.value}</b>
                                    <Radio
                                        label='Dziś'
                                        name='radioGroup'
                                        value='todayTasks'
                                        checked={this.state.when === 'todayTasks'}
                                        onChange={this.handleWhenChange}
                                    > Dziś </Radio>
                                    <Radio
                                        label='Jutro'
                                        name='radioGroup'
                                        value='tomorrowTasks'
                                        checked={this.state.when === 'tomorrowTasks'}
                                        onChange={this.handleWhenChange}
                                    > Jutro </Radio>
                                <Radio
                                    label='Jutro'
                                    name='radioGroup'
                                    value='someDayTasks'
                                    checked={this.state.when === 'someDayTasks'}
                                    onChange={this.handleWhenChange}
                                > Kiedyś </Radio>
                            </FormGroup>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleNewTaskAdd}>dodaj</Button>
                        <Button onClick={this.handleNewTaskAndClose}>dodaj i zamknij</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

}



