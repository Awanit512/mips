export type NodeType =
  'DIRECTIVE' |
  'DATA'      |
  'LABEL'     |
  'OPERATION' |
  'IMMEDIATE' |
  'OFFSET'    |
  'REGISTER'  |
  'ADDRESS'   |
  'TRANSFORMED'

export class Node {
  public type: NodeType
  public children: Node[] = []

  constructor(type: NodeType) {
    this.type = type
  }

  public add(node: Node) {
    this.children.push(node)
  }
}

export class DirectiveNode extends Node {
  public directiveType: 'data' | 'text'

  constructor(directiveType: 'data' | 'text') {
    super('DIRECTIVE')

    this.directiveType = directiveType
  }
}

export class DataNode extends Node {
  public dataDirective: string
  public values: string[]

  constructor(dataDirective: string, values: string[]) {
    super('DATA')

    this.dataDirective = dataDirective
    this.values = values
  }
}

export class LabelNode extends Node {
  public name: string

  constructor(name: string) {
    super('LABEL')

    this.name = name
  }
}

export class RegisterNode extends Node {
  public name: string

  constructor(name: string) {
    super('REGISTER')

    this.name = name
  }
}

export class ImmediateNode extends Node {
  public value: string

  constructor(value: string) {
    super('IMMEDIATE')

    this.value = value
  }
}

export class OffsetNode extends Node {
  public offset: string
  public register: string

  constructor(offset: string, register: string) {
    super('OFFSET')

    this.offset = offset
    this.register = register
  }
}

export class AddressNode extends Node {
  public label: string

  constructor(label: string) {
    super('ADDRESS')

    this.label = label
  }
}

export type ArgumentNode =
  RegisterNode  |
  ImmediateNode |
  OffsetNode    |
  AddressNode

export class OperationNode extends Node {
  public name: string
  public args: ArgumentNode[]

  constructor(name: string, args: ArgumentNode[]) {
    super('OPERATION')

    this.name = name
    this.args = args
  }
}

export class Root {
  public data: DirectiveNode
  public text: DirectiveNode

  constructor() {
    this.data = new DirectiveNode('data')
    this.text = new DirectiveNode('text')
  }
}

// Psuedo-instructions will get replaced by these
export class TranformedNode extends Node {
  constructor(operations: OperationNode[]) {
    super('TRANSFORMED')

    this.children = operations
  }
}