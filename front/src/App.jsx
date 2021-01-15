import React from 'react';
import { inject, observer } from 'mobx-react';
import { Dialog } from '@material-ui/core';

import Map from './components/Map';
import AppLayout from './components/AppLayout';
import Header from './components/Header';
import SideBarWithPriority from './components/SideBarWithPriority';
import SideBarWithWarehouses from './components/SideBarWithWarehouses';

function App({ appStore }) {

	return (
        <AppLayout>

            <Header/>
            <Map/>

            <Dialog 
                style={{ minWidth: '640px' }}
                open={appStore.isDialogComponentPresent}
                onBackdropClick={appStore.removeDialogComponent}
            >
                {appStore.dialogComponent}
            </Dialog>

            <SideBarWithPriority/>
            <SideBarWithWarehouses/>

        </AppLayout>
    );
}

export default inject('appStore')(observer(App));
