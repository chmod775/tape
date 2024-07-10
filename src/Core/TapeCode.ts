import { TapeScope } from "./TapeScope";
import { TapeStructure } from "./TapeStructure";

class Code {
  private _source: TapeStructure;
  public get source(): TapeStructure {
    return this._source;
  }

  private _parts: Code.Part[] = [];
  public get parts(): ReadonlyArray<Code.Part> {
    return this._parts;
  }

  constructor(source: TapeStructure, content?: Code | Code.Content, indent: Number = 0) {
    this._source = source;
    if (content != undefined) {
      if (content instanceof Code)
        this.AddCode(indent, content as Code);
      else
        this.AddContent(indent, content.template, ...content.placeholders);
    }
  }

  AddContent(indent: Number, template: String, ...placeholders: (Code | ReadonlyArray<Code>)[]) {
    let content = new Code.Content(template, placeholders);
    this._parts.push(new Code.Part(content, indent));
  }

  AddCode(indent: Number, code: Code): void {
    this._parts.push(new Code.Part(code, indent));
  }

  Content(indent: Number = 0): String[] {
    let ret: String[] = [];
    this._parts.map(l => l.Content(indent)).forEach(l => ret.push(...l));
    return ret;
  }

  ToSource(): String {
    let lines = this.Content();
    return lines.join('\n');
  }

  Create(parentScope: TapeScope): (Boolean | String)[] {
    let ret: (Boolean | String)[] = [];

    ret.push(...this._source.$Create(parentScope));
    console.log(this._source.constructor.name, ret);

    for (let l of this._parts)
      ret.push(...l.Create(this._source.scope));

    return ret;
  }
}

namespace Code {
  export class Content {
    private _template: String;
    public get template(): String {
      return this._template;
    }

    private _placeholders: (Code | ReadonlyArray<Code>)[] = [];
    public get placeholders(): ReadonlyArray<(Code | ReadonlyArray<Code>)> {
      return this._placeholders;
    }

    constructor(template: String, placeholders: (Code | ReadonlyArray<Code>)[] = []) {
      this._template = template;
      this._placeholders = placeholders;
    }

    Content(): String {
      let reg : RegExp = /\$(\D*)(\d+)/g;
      let ret = this._template.replace(reg, (substring: string, ...args: any[]): string => {
        let separator = args[0];
        let index = args[1];

        let isJoined = separator.length > 0;
        if (isJoined)
          return (this._placeholders[index] as Code[]).map(p => p.Content()[0]).join(separator) as string;

        return (this._placeholders[index] as Code).Content()[0] as string
      });
      return ret;
    }

    Create(parentScope: TapeScope): (Boolean | String)[] {
      let ret: (Boolean | String)[] = [];
      for (let p of this._placeholders) {
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
    private _indent: Number;
    public get indent(): Number {
      return this._indent;
    }

    private _content?: Content;
    public get content(): Content | undefined {
      return this._content;
    }

    private _code?: Code;
    public get code(): Code | undefined {
      return this._code;
    }

    constructor(item: Content | Code, indent?: Number) {
      if (item instanceof Code)
        this._code = item as Code;
      else
        this._content = item as Content;
      
      if (!this._code && !this._content) throw `Content must be defined ${typeof item} '${item}'`;
      
      this._indent = indent ?? 0;
    }

    Create(parentScope: TapeScope): (Boolean | String)[] {
      let ret: (Boolean | String)[] = [];
      if (this._code)
        ret.push(...this._code.Create(parentScope));
      if (this._content)
        ret.push(...this._content.Create(parentScope));
      return ret;
    }

    Content(indent: Number): String[] {
      let ret: String[] = [];
      if (this._content) {
        ret.push(' '.repeat(+this._indent) + this._content.Content());
      } else {
        let codeLines = this._code.Content(this._indent).map(l => ' '.repeat(+this._indent) + l);
        ret.push(...codeLines);
      }

      ret = ret.filter(l => l.trim().length > 0); // Clear empty lines

      return ret;
    }
  }
}

export { Code as TapeCode };