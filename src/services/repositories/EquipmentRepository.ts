// MINE SMART AI - Equipment Repository

import { BaseRepository } from "./BaseRepository";
import { Equipment } from "../../types/equipmentTypes";
import { INITIAL_EQUIPMENT_MASTER } from "../../data/equipmentData";

export class EquipmentRepository extends BaseRepository<Equipment> {
  constructor() {
    super("equipment_master", INITIAL_EQUIPMENT_MASTER);
  }

  public getAllUnits(): Equipment[] {
    return this.mockFallbackData;
  }

  public getEquipmentByType(type: string): Equipment[] {
    const list = this.mockFallbackData;
    if (type === "ALL") return list;
    return list.filter((eq) => eq.equipmentType.toLowerCase() === type.toLowerCase());
  }

  public getEquipmentByStatus(status: string): Equipment[] {
    const list = this.mockFallbackData;
    if (status === "ALL") return list;
    return list.filter((eq) => eq.status.toLowerCase() === status.toLowerCase());
  }

  public addUnit(unit: Equipment): Equipment {
    this.mockFallbackData.unshift(unit);
    return unit;
  }

  public updateUnit(id: string, updates: Partial<Equipment>): Equipment | null {
    const idx = this.mockFallbackData.findIndex((e) => e.id === id || e.equipmentId === id);
    if (idx !== -1) {
      this.mockFallbackData[idx] = { ...this.mockFallbackData[idx], ...updates, updatedAt: new Date().toISOString() };
      return this.mockFallbackData[idx];
    }
    return null;
  }
}

export const equipmentRepository = new EquipmentRepository();
