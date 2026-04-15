import { TapeFile } from "./TapeFile";
import { TapeStructure } from "../TapeStructure";
import { TapeCode } from "../TapeCode";
import { TapeErrors } from "../TapeErrors";
import { TapeGenerator } from "../TapeGenerator";
import { TapeErrorReporter } from "../Interfaces/TapeErrorReporter";
import { TapeScope } from "../TapeScope";

class TapeProject extends TapeStructure implements TapeErrorReporter {
  private _name: String;
  public get name(): String {
    return this._name;
  }
  
  private _files: TapeFile[];
  public get files(): ReadonlyArray<TapeFile> {
    return this._files;
  }

  constructor(name: String, files: TapeFile[]) {
    super();
    this._name = name;
    this._files = files;
  }

  $$ReportError(): String {
    return this.name;
  }

  $Build(parent: TapeStructure): TapeErrors {
    let errors = TapeErrors.Empty(this);

    this.scope = new TapeScope(this);

    for (let file of this._files) {
      let err = file.$Build(this);
      errors.Map(err);
    }
    return errors;
  }
  $Generate(generator: TapeGenerator): TapeCode {
    throw new Error("Method not implemented.");
  }

  Build(): TapeErrors {
    return this.$Build(this);
  }
}

export { TapeProject as TapeProject };