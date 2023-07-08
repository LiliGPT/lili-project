export interface GitFileChange {
  path: string;
  status: 'modified' | 'deleted' | 'created';
}

