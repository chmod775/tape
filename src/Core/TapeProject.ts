import { TapeFile } from "./Structure/TapeFile";
import { TapeScope } from "./TapeScope";

class TapeProject {
  public scope: TapeScope;
  public files: TapeFile[];

  constructor(files: TapeFile[]) {
    this.files = files;
  }

  Build() {

  }
}

export { TapeProject as TapeProject };