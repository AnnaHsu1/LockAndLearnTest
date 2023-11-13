import Realm, { BSON } from 'realm';

export class Child extends Realm.Object {
  static schema = {
    name: 'Child',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      firstName: 'string',
      lastName: 'string',
      grade: 'string',
      parentId: 'string',
    },
  };
}
