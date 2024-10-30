export interface TodoInterface {
  id?: number, 
  title: string,
  completed: boolean
}

export interface TodoRepositoryInterface {
  getAll: () => Promise<TodoInterface[]>
  getOne: (id:number) => Promise<TodoInterface>
  insert: (todo: TodoInterface) => Promise<TodoInterface>
  update: (todo: TodoInterface) => Promise<TodoInterface>
  delete: (id: number)=> Promise<void>
}