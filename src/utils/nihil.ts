import { v4 as uuid } from 'uuid';

export class Nihil {
  static uuid(index = 0) {
    return uuid() + index;
  }

  static string(data: any) {
    return JSON.stringify(data);
  }
  static parse(stringData: string) {
    return JSON.parse(stringData);
  }
}
