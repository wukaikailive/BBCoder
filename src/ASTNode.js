export const ASTType = {
  root: "Root",
  string: "String",
  label: "Label"
};

export default class ASTNode {
  constructor(type) {
    this.type = type;
  }
}

export class ASTString extends ASTNode {
  constructor(name,value) {
    super(ASTType.string);
    this.name = name;
    this.value = value
  }
}

export class ASTLabel extends ASTNode {
  constructor(name, label, value) {
    super(ASTType.label);
    this.name = name;
    this.label = label
    this.value = value
    this.children = []
    this.isClose = true
    this.fullLabel = label
    if(value){
      this.fullLabel = label + '=' + value
    }
  }
  
  setClose(close){
    this.isClose = close
  }

  push(node){
    this.children.push(node)
  }
}

export class AST extends ASTNode {
  constructor() {
    super(ASTType.root);
    this.body = [];
  }
}
