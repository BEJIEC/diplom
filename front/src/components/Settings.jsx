import React from 'react';
import { inject, observer } from 'mobx-react';
import { action, makeObservable, observable } from 'mobx';
import { Switch, FormControlLabel, ButtonGroup, Button, Divider, DialogContent, 
    DialogTitle, CircularProgress, List, ListItem, ListItemIcon, ListItemText, Container, Input } from '@material-ui/core';
import { Cancel, Add } from '@material-ui/icons';

import SettingsContract from '../stores/contracts/Settings';

class SettingsComponent extends React.PureComponent {

    editSettings = null;

    inputValue = '';

    constructor(props) {
        super(props);

        makeObservable(this, {
            editSettings: observable,
            inputValue: observable,

            changeWarState: action.bound,
            onChangeInput: action.bound,
            cancelChanges: action.bound,
            onAddEquipment: action.bound,
            completeChanges: action.bound
        });
    }

    componentDidMount() {
        this.editSettings = new SettingsContract(this.props.appStore.settings);
    }

    componentWillUnmount() {
        this.cancelChanges();
    }

    changeWarState(event) {
        this.editSettings.isWarState = event.target.checked;
    }

    onChangeInput(event) {
        this.inputValue = event.target.value;
    }

    onAddEquipment() {
        if (!this.inputValue) return;
        this.editSettings.addEquipment({ name: this.inputValue });
        this.inputValue = '';
    }

    onDeleteEquipment(id) {
        this.editSettings.removeEquipment(id);
    }

    cancelChanges() {
        this.props.appStore.removeDialogComponent();
        this.editSettings = null;
    }

    completeChanges() {
        this.props.appStore.saveSettings(this.editSettings);

        this.cancelChanges();
    }

    render() {
        const { appStore } = this.props;

        return <>
            {this.editSettings ? <DialogContent>
                <Container>
                    <DialogTitle>Загальні налаштування</DialogTitle>
                </Container>

                <Container>
                    <FormControlLabel
                        control={<Switch 
                            onClick={this.changeWarState}
                            checked={this.editSettings.isWarState}
                        />}
                        label={'Військовий стан'}
                    />
                </Container>
                

                {this.editSettings.equipmentsBase.length > 0 && <>
                    <Divider/>
                    
                    <Container>
                        <DialogTitle>Все доступне обладнання</DialogTitle>
                    </Container>
                    <List style={{ maxHeight: '200px', height: '200px', overflow: 'auto' }}>
                        {this.editSettings.equipmentsBase.map(unit => <>
                            <ListItem key={unit.id}>
                                <ListItemText>{unit.name}</ListItemText>
                                <ListItemIcon 
                                    onClick={() => this.onDeleteEquipment(unit.id)}
                                ><Button color={'secondary'}><Cancel/></Button></ListItemIcon>
                            </ListItem>
                        </>)}
                    </List>
                </>}

                <Divider/>

                <Container>
                    <DialogTitle>Додати нове обладнання</DialogTitle>
                </Container>

                <Container style={{ marginBottom: '10px' }}>
                    <Input 
                        value={this.inputValue}
                        onChange={this.onChangeInput}
                        placeholder={'Введіть назву'}
                    />
                    <Button 
                        color={'primary'}
                        onClick={this.onAddEquipment}
                    ><Add/></Button>
                </Container>

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
            </DialogContent> : <CircularProgress/>}
        </>
    }

}

export default inject('appStore')(observer(SettingsComponent));