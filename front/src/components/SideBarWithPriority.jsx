import React from 'react';
import { inject, observer } from 'mobx-react';
import { SwipeableDrawer, Container, Button, Card, CardContent, Typography, DialogTitle } from '@material-ui/core';
import { GpsFixed } from '@material-ui/icons';

class SideBarWithPriority extends React.PureComponent {

    chooseColor(priority) {
        switch (priority) {
            case 4 : return 'red';
            case 3 : return 'orange';
            case 2 : return 'orange';
            case 1 : return 'yellow';
            default : return 'white';
        }
    }

    render() {
        const { appStore } = this.props;

        return <SwipeableDrawer
            open={appStore.sideBarWithPriorityOpened}
            anchor={'right'}
            onBackdropClick={appStore.closePrioritySideBar}
        >
            <DialogTitle style={{ maxWidth: '300px' }}>Пріоритет потреби забезпечення частин</DialogTitle>
            {appStore.prioritizedBases.length > 0 ? appStore.prioritizedBases.map(base => <Container style={{ margin: '20px 0' }}>
                    <Card 
                        style={{ backgroundColor: this.chooseColor(base.priority) }}
                        key={base.id}
                    >
                        <CardContent style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography>{base.name}</Typography>
                            <Button onClick={() => appStore.moveTo(base.id, 'base')}><GpsFixed/></Button>
                        </CardContent>
                        
                    </Card>
                </Container>) : <Container>
                    <Typography>Наразі немає військових частин, для створення клікніть по карті</Typography>
                </Container>}
        </SwipeableDrawer>
    }

}

export default inject('appStore')(observer(SideBarWithPriority));
