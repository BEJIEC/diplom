import { makeObservable, observable, action, computed } from 'mobx';
import MilBase from './contracts/MilBase';
import MilWarehouse from './contracts/MilWarehouse';
import Settings from './contracts/Settings';

class AppStore {

    map = null;
    googleMapsApi = null;

    settings = new Settings();

    dialogComponent = null;

    allMilBases = [];
    allMilWarehouses = [];
    prioritizedBases = [];

    constructor() {
        makeObservable(this, {
            settings: observable,
            dialogComponent: observable,
            allMilBases: observable,
            allMilWarehouses: observable,
            prioritizedBases: observable,

            isDialogComponentPresent: computed,

            setDialogComponent: action,
            removeDialogComponent: action.bound,
            saveSettings: action.bound,
            addMilObject: action,
            updateMilObject: action,
            removeMilObject: action,
        });
    }

    get isDialogComponentPresent() {
        return this.dialogComponent !== null;
    }

    setDialogComponent(component) {
        this.dialogComponent = component;
    }

    removeDialogComponent() {
        this.dialogComponent = null;
    }

    saveSettings(newSettings) {
        this.settings = new Settings(newSettings);
    }

    addMilObject(objectType, milObject, onMarkerClickCallback) {
        let marker = new this.googleMapsApi.Marker({
          position: milObject.region,
          map: this.map,
          title: milObject.name,
        });

        let newMilObject = null;

        if (objectType === 'base') {
            newMilObject = new MilBase(milObject);

            this.allMilBases.push(newMilObject);

            marker.addListener('click', () => onMarkerClickCallback(objectType, this.allMilBases.find(base => base.id === newMilObject.id)));

        } else {
            newMilObject = new MilWarehouse(milObject);

            this.allMilWarehouses.push(newMilObject);

            marker.addListener('click', () => onMarkerClickCallback(objectType, this.allMilWarehouses.find(warehouse => warehouse.id === newMilObject.id)));

        }

        newMilObject.marker = marker;

    }

    updateMilObject(objectType, milObjectID, milObject) {
        console.log(objectType)
        console.log(milObjectID)
        console.log(milObject)
        console.log(this.allMilBases)
        objectType === 'base' ? this.allMilBases[this.allMilBases.findIndex(base => base.id === milObjectID)] = new MilBase(milObject) : 
            this.allMilWarehouses[this.allMilWarehouses.findIndex(warehouse => warehouse.id === milObjectID)] = new MilWarehouse(milObject);
    }

    removeMilObject(objectType, milObjectID) {
        if (objectType === 'base') {
            this.allMilBases.find(base => milObjectID === base.id).marker.setMap(null);
            this.allMilBases = this.allMilBases.filter(base => base.id !== milObjectID)
        } else {
            this.allMilWarehouses.find(warehouse => milObjectID === warehouse.id).marker.setMap(null);
            this.allMilWarehouses = this.allMilWarehouses.filter(warehouse => warehouse.id !== milObjectID);
        }

        this.removeDialogComponent();
    }

}

export default AppStore;
