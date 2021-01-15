import React from 'react';
import { makeObservable, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { SwipeableDrawer, Container, Button, Card, CardContent, Typography, DialogTitle, CircularProgress  } from '@material-ui/core';
import { Close, GpsFixed } from '@material-ui/icons';

function BackdropMock() {
    return <div style={{ width: '0' }}></div>
}

class SideBarWithWarehouses extends React.PureComponent {

    get isInfosPresent() {
        return this.props.appStore.closestWarehouses !== null;
    }

    render() {
        const { appStore } = this.props;

        return <SwipeableDrawer
            open={appStore.sideBarWithWarehousesOpened}
            anchor={'right'}
            BackdropComponent={BackdropMock}
            style={{ width: 0 }}
        >
            {this.isInfosPresent ? <Container>
                <Container style={{ display: 'flex' }}>
                    <DialogTitle style={{ maxWidth: '300px' }}>Найближчі склади для повної укомплектації</DialogTitle>
                    <Button
                        onClick={appStore.closeWarehousesSideBar}
                    ><Close/></Button>
                </Container>
                {appStore.closestWarehouses.length > 0 ? appStore.closestWarehouses.map(warehouse => <Container style={{ margin: '20px 0' }}>
                    <Card key={warehouse.id}>
                        <CardContent>
                            <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography>{warehouse.name}</Typography>
                                <Button onClick={() => appStore.moveTo(warehouse.id, 'warehouse')}><GpsFixed/></Button>
                            </Container>
                            <Container>
                                <Typography>{warehouse.duration.text}</Typography>
                            </Container>
                        </CardContent>
                    </Card>
                </Container>) : <Container>
                    <DialogTitle style={{ maxWidth: '300px' }}>Частина повністю укомплектована або немає складів для її забезпечення</DialogTitle>
                </Container>}
            </Container> : <Container style={{ width: '300px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress color={'primary'}/>
            </Container>}
            
        </SwipeableDrawer>
    }

}

export default inject('appStore')(observer(SideBarWithWarehouses));
