import { http } from './http';

export const API_URL = 'http://localhost:8080';

export const WARTIME_URL = `${API_URL}/wartime`;
export const EQUIPMENT_URL = `${API_URL}/milequipment`;
export const BASES_URL = `${API_URL}/milbase`;
export const WAREHOUSES_URL = `${API_URL}/milwarehouse`;

export const PRIORITY_URL = `${API_URL}/logisticscalculation/priority`;
export const SUPPLY_URL = `${API_URL}/logisticscalculation/supply`;

export const getWarTime = async () => await http.get(WARTIME_URL);
export const setWarTime = async (warTimeState) => await http.patch(WARTIME_URL, {
    wartime: warTimeState
});

export const getEquipment = async () => await http.get(EQUIPMENT_URL);
export const setEquipment = async (milEquipment) => await http.post(EQUIPMENT_URL, milEquipment);

export const getBases = async () => await http.get(BASES_URL);
export const createBase = async (milBase) => await http.post(BASES_URL, milBase);
export const updateBase = async (milBaseID, milBase) => await http.put(`${BASES_URL}/${milBaseID}`, milBase);
export const deleteBase = async (milBaseID) => await http.delete(`${BASES_URL}/${milBaseID}`);

export const getWarehouses = async () => await http.get(WAREHOUSES_URL);
export const createWarehouse = async (milWarehouse) => (console.log(milWarehouse),await http.post(WAREHOUSES_URL, milWarehouse));
export const updateWarehouse = async (milWarehouseID, milWarehouse) => await http.put(`${WAREHOUSES_URL}/${milWarehouseID}`, milWarehouse);
export const deleteWarehouse = async (milWarehouseID) => await http.delete(`${WAREHOUSES_URL}/${milWarehouseID}`);

export const getPriority = async () => await http.get(PRIORITY_URL);

export const getSupply = async (base_id) => await http.get(`${SUPPLY_URL}/${base_id}`);
