import { makeObservable, observable, action, computed } from 'mobx';

import MilBase from './contracts/MilBase';
import MilWarehouse from './contracts/MilWarehouse';
import Settings from './contracts/Settings';
import { getWarTime, getEquipment, setWarTime, setEquipment,
    getBases, getWarehouses, createBase, createWarehouse, 
    updateBase, updateWarehouse, deleteBase, deleteWarehouse,
    getPriority, getSupply } from '../api/api';

class AppStore {

    map = null;
    googleMapsApi = null;

    settings = new Settings();

    dialogComponent = null;

    allMilBases = [];
    allMilWarehouses = [];

    sideBarWithWarehousesOpened = false;
    closestWarehouses = null;

    sideBarWithPriorityOpened = false;
    prioritizedBases = [];

    constructor() {
        makeObservable(this, {
            settings: observable,
            dialogComponent: observable,
            allMilBases: observable,
            allMilWarehouses: observable,
            prioritizedBases: observable,
            closestWarehouses: observable,
            sideBarWithPriorityOpened: observable,
            sideBarWithWarehousesOpened: observable,

            isDialogComponentPresent: computed,

            setDialogComponent: action,
            getSettings: action,
            getMilObjects: action,
            removeDialogComponent: action.bound,
            saveSettings: action.bound,
            openPrioritySideBar: action.bound,
            closePrioritySideBar: action.bound,
            openWarehousesSideBar: action.bound,
            closeWarehousesSideBar: action.bound,
            addMilObject: action,
            updateMilObject: action,
            removeMilObject: action,
        });
    }

    get isDialogComponentPresent() {
        return this.dialogComponent !== null;
    }

    async getSettings() {
        let isWarState = (await getWarTime()).wartime;
        let equipmentsBase = await getEquipment();

        this.settings = new Settings({
            isWarState,
            equipmentsBase
        })
    }

    async saveSettings(newSettings) {
        this.settings = new Settings(newSettings);
        await setWarTime(this.settings.isWarState);
        await setEquipment(this.settings.equipmentsBase);
    }

    async getMilObjects() {
        this.allMilBases = (await getBases()).map(base => new MilBase(base));
        this.allMilWarehouses = (await getWarehouses()).map(warehouse => new MilWarehouse(warehouse));
    }

    async getPrioritizedBases() {
        this.prioritizedBases = (await getPriority()).sort((a, b) => b.priority > a.priority ? 1 : b.priority < a.priority ? -1 : 0);
    }

    async getSupply(baseID) {
        this.closestWarehouses = await getSupply(baseID);
    }

    setDialogComponent(component) {
        this.dialogComponent = component;
    }

    removeDialogComponent() {
        this.dialogComponent = null;
    }

    addMilObject(objectType, milObject, onMarkerClickCallback) {
        let marker = new this.googleMapsApi.Marker({
            position: milObject.region,
            map: this.map,
            title: milObject.name,
            label: milObject.type ? 'В' : 'С'
        });

        let newMilObject = null;

        if (objectType === 'base') {
            newMilObject = new MilBase(milObject);

            this.allMilBases.push(newMilObject);

            createBase(milObject.toServerContract());

            marker.addListener('click', () => onMarkerClickCallback(objectType, this.allMilBases.find(base => base.id === newMilObject.id)));

        } else {
            newMilObject = new MilWarehouse(milObject);

            this.allMilWarehouses.push(newMilObject);

            createWarehouse(milObject.toServerContract());

            marker.addListener('click', () => onMarkerClickCallback(objectType, this.allMilWarehouses.find(warehouse => warehouse.id === newMilObject.id)));

        }

        newMilObject.marker = marker;

    }

    updateMilObject(objectType, milObjectID, milObject) {
        if (objectType === 'base') {
            this.allMilBases[this.allMilBases.findIndex(base => base.id === milObjectID)] = new MilBase(milObject)
            updateBase(milObject.id, milObject.toServerContract());
        } else {
            this.allMilWarehouses[this.allMilWarehouses.findIndex(warehouse => warehouse.id === milObjectID)] = new MilWarehouse(milObject);
            updateWarehouse(milObject.id, milObject.toServerContract());
        }
    }

    removeMilObject(objectType, milObjectID) {
        if (objectType === 'base') {
            this.allMilBases.find(base => milObjectID === base.id).marker.setMap(null);
            this.allMilBases = this.allMilBases.filter(base => base.id !== milObjectID)
            deleteBase(milObjectID);
        } else {
            this.allMilWarehouses.find(warehouse => milObjectID === warehouse.id).marker.setMap(null);
            this.allMilWarehouses = this.allMilWarehouses.filter(warehouse => warehouse.id !== milObjectID);
            deleteWarehouse(milObjectID);
        }

        this.removeDialogComponent();
    }

    moveTo(objectID, objectType) {
        objectType === 'base' ? this.map.panTo(this.allMilBases.find(base => base.id === objectID).region) :
            this.map.panTo(this.allMilWarehouses.find(warehouse => warehouse.id === objectID).region);
    }

    drawAllMarkersForObjects(objects, onMarkerClickCallback) {
        objects.forEach(object => {
            let marker = new this.googleMapsApi.Marker({
                position: object.region,
                map: this.map,
                title: object.name,
                label: object.type ? 'В' : 'С'
            });

            if (object.type) {
                marker.addListener('click', () => onMarkerClickCallback('base', this.allMilBases.find(base => base.id === object.id)))
            } else {
                marker.addListener('click', () => onMarkerClickCallback('warehouse', this.allMilWarehouses.find(warehouse => warehouse.id === object.id)))
            }

            object.marker = marker;
        })
    }

    removeAllMarkers() {
        this.allMilBases.concat(this.allMilWarehouses).forEach(object => object.marker.setMap(null));
    }

    openPrioritySideBar() {
        this.sideBarWithPriorityOpened = true;
        this.getPrioritizedBases();
    }

    closePrioritySideBar() {
        this.sideBarWithPriorityOpened = false;
    }

    openWarehousesSideBar(baseID) {
        this.closestWarehouses = null;
        this.sideBarWithWarehousesOpened = true;
        this.getSupply(baseID);
    }

    closeWarehousesSideBar() {
        this.sideBarWithWarehousesOpened = false;
        this.closestWarehouses = null;
    }

}

export default AppStore;
