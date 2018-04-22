import React from 'react';
import {Button} from 'react-bootstrap'
import {Row} from 'react-bootstrap'
import {Col} from 'react-bootstrap'

import style from '../../sass/style.scss';

export class ToDoItem extends React.Component {


    render() {
        return (<Row className={"show-grid task "+(this.props.status==="done"?"done":"active") } >
            <Col xs={12} md={8}>
                 <p>{this.props.value}</p>
            </Col>
            <Col xs={12} md={4}>
                <Button bsStyle="success" onClick={() => this.props.done()} disabled={this.props.status==="done"}>Done</Button>
                <Button onClick={() => this.props.delete()}>Remove</Button>
            </Col>
        </Row>)
    }

}

