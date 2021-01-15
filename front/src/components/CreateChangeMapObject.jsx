import React from 'react';
import { inject, observer } from 'mobx-react';
import { DialogTitle, DialogContent, Container, RadioGroup, 
    Radio, FormControlLabel, DialogContentText, Divider, Input,
    ListItem, ListItemText, List, ListItemIcon, Button, Select,
    MenuItem, ButtonGroup, Switch } from '@material-ui/core';
import { Add, Cancel } from '@material-ui/icons';
import { action, makeObservable, observable } from 'mobx';

import ObjectInfoWindow from './ObjectInfoWindow';
import MilBase, { Reason_Array, Urgency_Array } from '../stores/contracts/MilBase';
import MilWarehouse from '../stores/contracts/MilWarehouse';
import MilEquipment from '../stores/contracts/MilEquipment';

class CreateChangeMapObject extends React.PureComponent {

    objectType;
    object;
    creatingMode;

    unitName;
    unitQuantity;
    unitID;

    constructor(props) {
        super();

        this.objectType = props.objectType || 'base';
        this.object = this.objectType === 'base' ? new MilBase(props.object) : new MilWarehouse(props.object);

        if (props.latLng) {
            this.object.region = props.latLng;
        }

        this.creatingMode = props.creatingMode || false;
        this.unitName = '';
        this.unitID = props.appStore.settings.equipmentsBase[0]?.id || '';
        this.unitName = props.appStore.settings.equipmentsBase[0]?.name || '';
        this.unitQuantity = 1;

        makeObservable(this, {
            objectType: observable,
            unitName: observable,
            object: observable,
            creatingMode: observable,
            unitQuantity: observable,
            unitID: observable,

            onChangeObjectType: action.bound,
            onChangeReason: action.bound,
            onChangeUrgency: action.bound,
            onChangeUnitName: action.bound,
            onChangeUnitQuantity: action.bound,
            onChangeAvailableUnitQuantity: action.bound,
            onAddUnit: action.bound,
            cancelChanges: action.bound,
            completeChanges: action.bound,
            onChangeObjectName: action.bound,
            onChangeBaseType: action.bound,
            clearComponent: action,

        })
    }

    onChangeObjectName(event) {
        this.object.name = event.target.value;
    }

    onChangeObjectType(event) {
        this.objectType = event.target.value;

        this.object = this.objectType === 'base' ? new MilBase(this.object) : new MilWarehouse(this.object);
    }

    onChangeBaseType() {
        this.object.type = this.object.type === 'combat' ? 'studying' : 'combat';
    }

    onChangeUnitName(event) {
        this.unitName = this.props.appStore.settings.equipmentsBase.find(equipment => equipment.id === event.target.value).name;
        this.unitID = event.target.value;
    }

    onChangeReason(event) {
        this.object.reason = event.target.value;
    }

    onChangeUrgency(event) {
        this.object.urgency = event.target.value;
    }

    onChangeUnitQuantity(event) {
        let newValue = Number(event.target.value);

        if (Number.isNaN(newValue)) return;

        if (newValue < 1) {
            newValue = 1;
        }

        this.unitQuantity = newValue;
    }

    onChangeAvailableUnitQuantity(index, newQuantity) {
        newQuantity = Number(newQuantity);

        if (Number.isNaN(newQuantity)) return;

        if (newQuantity < 1) {
            this.object.availability[index].quantity = 1;
        } else if (newQuantity > this.object.mustBeEquipment[index].quantity) {
            this.object.availability[index].quantity = this.object.mustBeEquipment[index].quantity;
        } else {
            this.object.availability[index].quantity = newQuantity;
        }
    }

    onAddUnit() {
        if (this.objectType === 'base') {
            let newEquip = new MilEquipment({
                name: this.unitName,
                quantity: this.unitQuantity,
                id: this.unitID
            });
            this.object.mustBeEquipment.push(newEquip);
            this.object.availability.push(new MilEquipment(newEquip));
        } else {
            this.object.availability.push(new MilEquipment({
                name: this.unitName,
                quantity: this.unitQuantity,
                id: this.unitID
            }));
        }
    }

    onDeleteUnit(index) {
        if (this.objectType === 'base') {
            this.object.mustBeEquipment.splice(index, 1);
            this.object.availability.splice(index, 1);
        } else {
            this.object.availability.splice(index, 1);
        }
    }

    clearComponent() {
        this.objectType = 'base';
        this.object = null;
        this.creatingMode = false;
        
        this.unitName = '';
        this.unitQuantity = 1;
    }

    cancelChanges() {
        this.props.appStore.removeDialogComponent();
        this.clearComponent();
    }

    completeChanges() {
        const { appStore } = this.props;

        this.creatingMode ? appStore.addMilObject(this.objectType, this.object, (thisObjectType, thisObject) => appStore.setDialogComponent(<ObjectInfoWindow
            object={thisObject}
            objectType={thisObjectType}
        />)) : 
            appStore.updateMilObject(this.objectType, this.object.id, this.object);

        this.cancelChanges();
    }

    uiSwitch(objectType) {

        switch(objectType) {
            case 'base' : return <>

                <Container>
                    <FormControlLabel
                        style={{ marginLeft: '0' }}
                        control={<Switch 
                            onClick={this.onChangeBaseType}
                            checked={this.object.type === 'combat'}
                            value={this.object.type}
                        />}
                        label={'Бойова частина'}
                        labelPlacement={'start'}
                    />
                </Container>

                <Container>
                    <DialogContentText>Причина потреби забезпечення</DialogContentText>

                    <Select
                        fullWidth
                        value={this.object.reason}
                        onChange={this.onChangeReason}
                    >
                        {Reason_Array.map((reason, index) => <MenuItem value={index}>
                            {reason}
                        </MenuItem>)}
                    </Select>
                </Container>

                <Container>
                    <DialogContentText>Терміновість потреби забезпечення</DialogContentText>

                    <Select
                        fullWidth
                        value={this.object.urgency}
                        onChange={this.onChangeUrgency}
                    >
                        {Urgency_Array.map((urgency, index) => <MenuItem value={index}>
                            {urgency}
                        </MenuItem>)}
                    </Select>
                </Container>

                {this.object.mustBeEquipment.length > 0 && <>
                    
                    <Container>
                        <DialogTitle>Обладнання по штату</DialogTitle>
                    </Container>

                    <List style={{ height: '100px', overflow: 'auto' }}>
                        <ListItem>
                            <ListItemText>Назва</ListItemText>
                            <ListItemText>Кількість</ListItemText>
                            <ListItemText>Видалити</ListItemText>
                        </ListItem>

                        <Divider/>
                        
                        {this.object.mustBeEquipment.map((unit, index) => <>
                            <ListItem key={unit.id}>
                                <ListItemText>{unit.name}</ListItemText>
                                <ListItemText>{unit.quantity}</ListItemText>
                                <ListItemIcon 
                                    onClick={() => this.onDeleteUnit(index)}
                                ><Button color={'secondary'}><Cancel/></Button></ListItemIcon>
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

                        {this.object.availability.map(( unit, index ) => <>
                            <ListItem key={unit.id}>
                                <ListItemText>{unit.name}</ListItemText>
                                <Input
                                    value={unit.quantity}
                                    type={'number'}
                                    onChange={(event) => this.onChangeAvailableUnitQuantity(index, event.target.value)}
                                />
                            </ListItem>
                        </>)}
                    </List>

                    
                </>}
                
            </>;
            default : return <>
                {this.object.availability.length > 0 && <>
                    
                    <Container>
                        <DialogTitle>Наявне обладнання</DialogTitle>
                    </Container>

                    <List style={{ height: '100px', overflow: 'auto' }}>
                        <ListItem>
                            <ListItemText>Назва</ListItemText>
                            <ListItemText>Кількість</ListItemText>
                            <ListItemText>Видалити</ListItemText>
                        </ListItem>
                        
                        <Divider/>

                        {this.object.availability.map((unit, index) => <>
                            <ListItem key={unit.id}>
                                <ListItemText>{unit.name}</ListItemText>
                                <ListItemText>{unit.quantity}</ListItemText>
                                <ListItemIcon 
                                    onClick={() => this.onDeleteUnit(index)}
                                ><Button color={'secondary'}><Cancel/></Button></ListItemIcon>
                            </ListItem>
                        </>)}
                    </List>
                    
                </>}
            </>;
        }
    }

    render() {

        const { latLng, creatingMode, appStore } = this.props;

        return this.object !== null ? <DialogContent>

            <DialogTitle>{creatingMode ? 'Створення об\'єкту' : 'Редагування'}</DialogTitle>

            {creatingMode && <Container>
                <DialogContentText>{'Тип об\'єкту'}</DialogContentText>

                <RadioGroup
                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    
                    <FormControlLabel
                        control={<Radio
                            onClick={this.onChangeObjectType}
                        />}
                        value={'base'}
                        label={'В/Ч'}
                        checked={this.objectType === 'base'}
                    />

                    <FormControlLabel
                        control={<Radio
                            onClick={this.onChangeObjectType}
                        />}
                        value={'warehouse'}
                        label={'Склад'}
                        labelPlacement={'Start'}
                        checked={this.objectType === 'warehouse'}
                    />

                </RadioGroup>
            </Container>}

            <Container>
                <Input
                    value={this.object.name}
                    placeholder={'Введіть назву об\'єкту'}
                    fullWidth
                    onChange={this.onChangeObjectName}
                />
            </Container>
            

            {this.uiSwitch(this.objectType)}

            {this.props.appStore.settings.equipmentsBase.length > 0 ?  <>
                <DialogTitle>Додати нове обладнання</DialogTitle>
                    <Container style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                        <Select
                            autoWidth
                            value={this.unitID}
                            onChange={this.onChangeUnitName}
                        >
                            {this.props.appStore.settings.equipmentsBase.map(unit => <MenuItem value={unit.id}>
                                {unit.name}
                            </MenuItem>)}
                        </Select>
                        <Input 
                            value={this.unitQuantity}
                            onChange={this.onChangeUnitQuantity}
                            placeholder={'Введіть назву'}
                            type={'number'}
                        />
                        <Button 
                            color={'primary'}
                            onClick={this.onAddUnit}
                        ><Add/></Button>
                    </Container> 
                </>: <Container>
                    <DialogContentText color={'secondary'}>Для додавання обладнання створіть його у загальних настройках</DialogContentText>
                </Container>}

                <Divider/>

                <ButtonGroup variant={'text'} fullWidth>
                    <Button 
                        color={'secondary'}
                        onClick={this.cancelChanges}
                    >Відмінити</Button>
                    <Button 
                        color={'primary'}
                        onClick={this.completeChanges}
                    >Підтвердити</Button>
                </ButtonGroup>

        </DialogContent> : <></>
    }

}

export default inject('appStore')(observer(CreateChangeMapObject));
