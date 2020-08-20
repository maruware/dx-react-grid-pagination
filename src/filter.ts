export interface Filter {
  op: 'equal' | 'contains' | 'between' | 'in' | 'null' | 'not_null'
  column: string
  values: any[]
}
