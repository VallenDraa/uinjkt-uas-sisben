import { HardwareIdInput } from "../types/hardware-id-input.types";

export const HARDWARE_ID_KEY = "hardwareId" as const;

export const DEFAULT_HARDWARE_ID_INPUT: HardwareIdInput = {
  hardwareId: "",
};
