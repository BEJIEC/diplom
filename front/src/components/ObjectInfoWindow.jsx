import React from 'react';
import { inject, observer } from 'mobx-react';
import { DialogContent, DialogTitle, Container, Button, List, ListItem, ListItemText,
    Divider, ButtonGroup, IconButton, DialogContentText } from '@material-ui/core';
import { Close, Edit, Delete, Search } from '@material-ui/icons';

import CreateChangeMapObject from './CreateChangeMapObject';
import { Reason_Array, Urgency_Array } from '../stores/contracts/MilBase';

class ObjectInfoWindow extends React.PureComponent {

    constructor() {
        super();

        this.onCloseClicked = this.onCloseClicked.bind(this);
        this.onEditClicked = this.onEditClicked.bind(this);
        this.onDeleteClicked = this.onDeleteClicked.bind(this);
    }

    onEditClicked() {
        const { objectType, object, appStore } = this.props;

        appStore.setDialogComponent(<CreateChangeMapObject
            object={object}
            objectType={objectType}
        />)
    }

    onDeleteClicked() {
        const { object: { id }, objectType, appStore } = this.props;

        appStore.removeMilObject(objectType, id);
    }

    onCloseClicked() {
        this.props.appStore.removeDialogComponent();
    }

    uiSwitch(objectType) {
        const { object } = this.props;

        switch(objectType) {
            case 'base' : return <>

                <Container>
                    <span>Причина: {Reason_Array[object.reason]}</span>
                </Container>

                <Container>
                    <span>Терміновість: {Urgency_Array[object.urgency]}</span>
                </Container>

                <Container>
                    <span>Бойова частина: {object.type === 'combat' ? 'Так' : 'Ні'}</span>
                </Container>

                {object.mustBeEquipment.length > 0 && <>
                    
                    <Container>
                        <DialogTitle>Обладнання по штату</DialogTitle>
                    </Container>

                    <List style={{ height: '100px', overflow: 'auto' }}>
                        <ListItem>
                            <ListItemText>Назва</ListItemText>
                            <ListItemText>Кількість</ListItemText>
                        </ListItem>

                        <Divider/>
                        
                        {object.mustBeEquipment.map(unit => <>
                            <ListItem key={unit.id}>
                                <ListItemText>{unit.name}</ListItemText>
                                <ListItemText>{unit.quantity}</ListItemText>
                            </ListItem>
                        </>)}
                    </List>
                    
                    <Container>
                        <DialogTitle>Наявне обладнання</DialogTitle>
                    </Container>

                    <List style={{ height: '100px', overflow: 'auto' }}>
                        <ListItem>
                            <ListItemText>Назва</ListItemText>
                            <ListItemText>Кількість</ListItemText>
                        </ListItem>

                        <Divider/>

                        {object.availability.map(unit => <>
                            <ListItem key={unit.id}>
                                <ListItemText>{unit.name}</ListItemText>
                                <ListItemText>{unit.quantity}</ListItemText>
                            </ListItem>
                        </>)}
                    </List>


                    {object.lackEquipment.length > 0 && <>
                        <Container>
                            <DialogTitle>Нестача обладнання</DialogTitle>
                        </Container>

                        <List style={{ height: '100px', overflow: 'auto' }}>
                            <ListItem>
                                <ListItemText>Назва</ListItemText>
                                <ListItemText>Нестача</ListItemText>
                            </ListItem>

                            <Divider/>

                            {object.lackEquipment.map(unit => <>
                                <ListItem key={unit.id}>
                                    <ListItemText>{unit.name}</ListItemText>
                                    <ListItemText>{unit.quantity}</ListItemText>
                                </ListItem>
                            </>)}
                        </List>

                    </>}
                    
                </>}
                
            </>;
            default : return <>
                {object.availability.length > 0 && <>
                    
                    <Container>
                        <DialogTitle>Наявне обладнання</DialogTitle>
                    </Container>

                    <List style={{ height: '100px', overflow: 'auto' }}>
                        <ListItem>
                            <ListItemText>Назва</ListItemText>
                            <ListItemText>Кількість</ListItemText>
                        </ListItem>

                        <Divider/>
                        
                        {object.availability.map(unit => <>
                            <ListItem key={unit.id}>
                                <ListItemText>{unit.name}</ListItemText>
                                <ListItemText>{unit.quantity}</ListItemText>
                            </ListItem>
                        </>)}
                    </List>
                    
                </>}
            </>;
        }
    }

    render() {
        const { object, appStore, objectType } = this.props;

        return <DialogContent>

            <Container style={{ display:'flex', justifyContent: 'space-between' }}>

                <DialogTitle>{(objectType === 'base' ? 'В/ч: ' : 'Склад: ') + object.name}</DialogTitle>

                <ButtonGroup size={'small'}>

                    {objectType === 'base' && <IconButton 
                        color={'primary'}
                        onClick={() => appStore.openWarehousesSideBar(object.id)}
                    ><Search/></IconButton>}
                    
                    <IconButton 
                        color={'primary'}
                        onClick={this.onEditClicked}
                    ><Edit/></IconButton>
                    <IconButton 
                        color={'secondary'}
                        onClick={this.onDeleteClicked}
                    ><Delete/></IconButton>
                    <IconButton onClick={this.onCloseClicked}><Close/></IconButton>
                </ButtonGroup>
                
            </Container>


            {this.uiSwitch(objectType)}

        </DialogContent>
    }

}

export default inject('appStore')(observer(ObjectInfoWindow));
