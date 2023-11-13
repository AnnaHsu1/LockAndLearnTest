import { createRealmContext } from '@realm/react';
import User from './schemas/RealmProviders/UserSchema';
import Child from './schemas/RealmProviders/ChildSchema';

realmConfig = {
  schemas: [User, Child],
};

export const { RealmProvider, useRealm, useObject, useQuery } = createRealmContext(realmConfig);
