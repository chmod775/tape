import { TapeScope } from "./TapeScope";
import { TapeStructure } from "./TapeStructure";

class Code {
  source: TapeStructure;
  lines: Code.Line[] = [];

  constructor(source: TapeStructure, content?: String | Code, indent: Number = 0) {
    this.source = source;
    if (content != undefined) {
      if (content instanceof Code)
        this.AddCode(indent, content as Code);
      else if (content instanceof Code.Content)
        this.AddContent(indent, content.template, ...content.placeholders);
      else
        this.AddString(indent, content as String);
    }
  }

  AddString(indent: Number, ...lines: String[]): void {
    for (let l of lines) {
      let content = new Code.Content(l);
      this.lines.push(new Code.Line(content, indent));
    }
  }

  AddContent(indent: Number, template: String, ...placeholders: Code[]) {
    let content = new Code.Content(template, placeholders);
    this.lines.push(new Code.Line(content, indent));
  }

  AddCode(indent: Number, code: Code): void {
    this.lines.push(new Code.Line(code, indent));
  }

  Content(indent: Number = 0): String {
    return this.lines.map(l => ' '.repeat(+indent) + l.Content()).join('\n');
  }

  Create(parentScope: TapeScope): (Boolean | String)[] {
    let ret: (Boolean | String)[] = [];

    ret.push(...this.source.Create(parentScope));
    console.log(this.source.constructor.name, ret);

    for (let l of this.lines)
      ret.push(...l.Create(this.source.scope));


    return ret;
  }
}

namespace Code {
  export class Content {
    template: String;
    placeholders: Code[] = [];

    constructor(template: String, placeholders: Code[] = []) {
      this.template = template;
      this.placeholders = placeholders;
    }

    Content(): String {
      let ret = this.template;

      for (let pIdx in this.placeholders)
        ret = ret.replace(`\$${pIdx}`, this.placeholders[pIdx].Content() as string);

      return ret;
    }

    Create(parentScope: TapeScope): (Boolean | String)[] {
      let ret: (Boolean | String)[] = [];
      for (let p of this.placeholders)
        ret.push(...p.Create(parentScope));
      return ret;
    }
  }

  export class Line {
    indent: Number;
    content?: Content;
    code?: Code;

    constructor(content: Content | Code, indent?: Number) {
      if (content instanceof Code)
        this.code = content as Code;
      else
        this.content = content as Content;
      
      if (!this.code && !this.content) throw `Content must be defined ${typeof content} '${content}'`;
      
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

    Content(): String {
      return ' '.repeat(+this.indent) + (this.content ? this.content.Content() : this.code.Content(this.indent));
    }
  }

}

export { Code as TapeCode };