import Realm, { BSON } from 'realm';

export class User extends Realm.Object {
  static schema = {
    name: 'User',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      firstName: 'string',
      lastName: 'string',
      email: 'string',
      password: 'string',
      DOB: 'string',
    },
  };
}
