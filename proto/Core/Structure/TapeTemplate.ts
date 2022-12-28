import { TapeStatement } from "./TapeStatement";
import { TapeCode } from "../TapeCode";
import { TapeGenerator } from "../TapeGenerator";
import { TapeStructure } from "../TapeStructure";

abstract class TapeTemplate extends TapeStructure {
  public generators: { [language: string]: TapeStatement.Block } = {};

  $Generate(generator: TapeGenerator) : TapeCode {
    let template = this.generators[generator.Name as string];
    if (!template) throw `Undefined template for language generator ${generator.Name}`;

    return template.$Generate(generator);
  }
}

export { TapeTemplate as TapeTemplate };
