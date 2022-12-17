class Code {
  lines: Code.Line[] = [];

  constructor(singleLine?: String, indent?: Number) {
    if (singleLine != undefined)
      this.AddString(indent, singleLine);
  }

  AddString(indent: Number, ...lines: String[]) {
    for (let l of lines)
      this.lines.push(new Code.Line(l, indent));
  }

  AddCode(indent: Number, code: Code) {
    for (let l of code.lines)
      this.lines.push(new Code.Line(l.Content(), indent));
  }

  Content() {
    return this.lines.map(l => l.Content()).join('\n');
  }
}

namespace Code {
  export class Line {
    content: String;
    indent: Number;

    constructor(content: String, indent?: Number) {
      this.content = content;
      this.indent = indent ?? 0;
    }

    Content() {
      return ' '.repeat(+this.indent) + this.content;
    }
  }
}

export = Code;