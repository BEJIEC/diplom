import React from 'react';
import { inject, observer } from 'mobx-react';
import { AppBar, Toolbar, Switch, FormControlLabel, Button } from '@material-ui/core';
import { Settings, Assessment } from '@material-ui/icons';

import SettingsComponent from './Settings';

class Header extends React.Component {

    constructor() {
        super();

        this.onSettingsClick = this.onSettingsClick.bind(this);
    }

    onSettingsClick() {
        this.props.appStore.setDialogComponent(<SettingsComponent/>);
    }

    render() {
        return <AppBar position={'relative'}>
            <Toolbar>
                <Button onClick={this.onSettingsClick}>
                    <Settings 
                        fontSize={'large'}
                        color={'secondary'}
                    />
                </Button>
                <Button onClick={this.props.appStore.openPrioritySideBar}>
                    <Assessment 
                        fontSize={'large'}
                        color={'secondary'}
                    />
                </Button>
            </Toolbar>
        </AppBar>;
    }

}

export default inject('appStore')(observer(Header));
