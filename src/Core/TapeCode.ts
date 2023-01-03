import { TapeScope } from "./TapeScope";
import { TapeStructure } from "./TapeStructure";

class Code {
  source: TapeStructure;
  parts: Code.Part[] = [];

  constructor(source: TapeStructure, content?: Code | Code.Content, indent: Number = 0) {
    this.source = source;
    if (content != undefined) {
      if (content instanceof Code)
        this.AddCode(indent, content as Code);
      else
        this.AddContent(indent, content.template, ...content.placeholders);
    }
  }

  AddContent(indent: Number, template: String, ...placeholders: (Code | Code[])[]) {
    let content = new Code.Content(template, placeholders);
    this.parts.push(new Code.Part(content, indent));
  }

  AddCode(indent: Number, code: Code): void {
    this.parts.push(new Code.Part(code, indent));
  }

  Content(indent: Number = 0): String[] {
    let ret: String[] = [];
    this.parts.map(l => l.Content(indent)).forEach(l => ret.push(...l));
    return ret;
  }

  ToSource(): String {
    let lines = this.Content();
    return lines.join('\n');
  }

  Create(parentScope: TapeScope): (Boolean | String)[] {
    let ret: (Boolean | String)[] = [];

    ret.push(...this.source.$Create(parentScope));
    console.log(this.source.constructor.name, ret);

    for (let l of this.parts)
      ret.push(...l.Create(this.source.scope));

    return ret;
  }
}

namespace Code {
  export class Content {
    template: String;
    placeholders: (Code | Code[])[] = [];

    constructor(template: String, placeholders: (Code | Code[])[] = []) {
      this.template = template;
      this.placeholders = placeholders;
    }

    Content(): String {
      let reg : RegExp = /\$(\D*)(\d+)/g;
      let ret = this.template.replace(reg, (substring: string, ...args: any[]): string => {
        let separator = args[0];
        let index = args[1];

        let isJoined = separator.length > 0;
        if (isJoined)
          return (this.placeholders[index] as Code[]).map(p => p.Content()[0]).join(separator) as string;

        return (this.placeholders[index] as Code).Content()[0] as string
      });
      return ret;
    }

    Create(parentScope: TapeScope): (Boolean | String)[] {
      let ret: (Boolean | String)[] = [];
      for (let p of this.placeholders) {
        if (p instanceof Code)
          ret.push(...p.Create(parentScope));
        else {
          for (let sp of (p as Code[]))
            ret.push(...sp.Create(parentScope));
        }
      }
      return ret;
    }
  }

  export class Part {
    indent: Number;
    content?: Content;
    code?: Code;

    constructor(item: Content | Code, indent?: Number) {
      if (item instanceof Code)
        this.code = item as Code;
      else
        this.content = item as Content;
      
      if (!this.code && !this.content) throw `Content must be defined ${typeof item} '${item}'`;
      
      this.indent = indent ?? 0;
    }

    Create(parentScope: TapeScope): (Boolean | String)[] {
      let ret: (Boolean | String)[] = [];
      if (this.code)
        ret.push(...this.code.Create(parentScope));
      if (this.content)
        ret.push(...this.content.Create(parentScope));
      return ret;
    }

    Content(indent: Number): String[] {
      let ret: String[] = [];
      if (this.content) {
        ret.push(' '.repeat(+this.indent) + this.content.Content());
      } else {
        let codeLines = this.code.Content(this.indent).map(l => ' '.repeat(+this.indent) + l);
        ret.push(...codeLines);
      }

      ret = ret.filter(l => l.trim().length > 0); // Clear empty lines

      return ret;
    }

  }

}

export { Code as TapeCode };