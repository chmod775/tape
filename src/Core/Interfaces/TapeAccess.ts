import { TapeDefinition } from "../Structure/TapeDefinition";

interface TapeAccess {
  Access(name: String): TapeDefinition;
}

export { TapeAccess as TapeAccess };
