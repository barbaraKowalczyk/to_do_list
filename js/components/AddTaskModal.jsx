import React from 'react';
import {Modal} from 'react-bootstrap';
import {Radio} from 'react-bootstrap'
import {Button} from 'react-bootstrap'
import {FormGroup} from 'react-bootstrap'
import {FormControl} from 'react-bootstrap'
import {ControlLabel} from 'react-bootstrap'

export class AddTaskModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false,
            name:"ssss"
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

    handleNewTaskAdd = (e) => {
        if ( typeof this.props.onClick === 'function' ){
            const name = e.target.value.replace(/\d/g,
                '');
            this.props.onClick(this.state.name);
        }
    }
    render() {

        return (
            <div>

                <Button bsStyle="primary" onClick={this.handleShow}>
                    Add task
                </Button>

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <FormGroup controlId="formInlineName">
                                <ControlLabel>Task name</ControlLabel>
                                <FormControl type="text" placeholder="add task name" value={this.state.name} onChange={this.handleNameChange} />
                            </FormGroup>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleNewTaskAdd}>dodaj</Button>

                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

}



