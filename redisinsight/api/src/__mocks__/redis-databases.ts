// import {
//   ConnectionType,
//   DatabaseInstanceEntity,
//   HostingProvider,
// } from 'src/modules/core/models/database-instance.entity';
// import { mockCaCertEntity, mockClientCertEntity } from './certificates';
//
// export const mockStandaloneDatabaseEntity: DatabaseInstanceEntity = {
//   id: 'a77b23c1-7816-4ea4-b61f-d37795a0f805',
//   host: 'localhost',
//   port: 6379,
//   db: 0,
//   name: 'redis-database',
//   nameFromProvider: null,
//   username: null,
//   password: null,
//   tls: true,
//   verifyServerCert: true,
//   caCert: mockCaCertEntity,
//   clientCert: mockClientCertEntity,
//   lastConnection: null,
//   connectionType: ConnectionType.STANDALONE,
//   sentinelMasterName: null,
//   sentinelMasterUsername: null,
//   sentinelMasterPassword: null,
//   nodes: null,
//   provider: HostingProvider.LOCALHOST,
//   modules: '[]',
//   encryption: null,
//   tlsServername: 'server-name',
// };
//
// export const mockOSSClusterDatabaseEntity: DatabaseInstanceEntity = {
//   id: '3a41f8ea-a36a-11eb-bcbc-0242ac130002',
//   host: 'localhost',
//   port: 7001,
//   db: null,
//   name: 'oss-cluster',
//   nameFromProvider: null,
//   username: null,
//   password: null,
//   tls: true,
//   verifyServerCert: true,
//   caCert: mockCaCertEntity,
//   clientCert: mockClientCertEntity,
//   lastConnection: null,
//   connectionType: ConnectionType.CLUSTER,
//   sentinelMasterName: null,
//   sentinelMasterUsername: null,
//   sentinelMasterPassword: null,
//   nodes: '[{"host":"localhost","port":7001},{"host":"localhost","port":7002}]',
//   provider: HostingProvider.LOCALHOST,
//   modules: '[]',
//   encryption: null,
// };
//
// export const mockSentinelDatabaseEntity: DatabaseInstanceEntity = {
//   id: 'a77b23c1-7816-4ea4-b61f-d37795a0f805',
//   host: 'localhost',
//   port: 26379,
//   db: 0,
//   name: 'sentinel-database',
//   nameFromProvider: null,
//   username: null,
//   password: null,
//   tls: true,
//   verifyServerCert: true,
//   caCert: mockCaCertEntity,
//   clientCert: mockClientCertEntity,
//   lastConnection: null,
//   connectionType: ConnectionType.SENTINEL,
//   sentinelMasterName: 'master-group',
//   sentinelMasterUsername: null,
//   sentinelMasterPassword: null,
//   nodes: '[{"host":"localhost","port":5001}]',
//   provider: HostingProvider.LOCALHOST,
//   modules: '[]',
//   encryption: null,
// };
//
// export const mockDatabasesProvider = () => ({
//   exists: jest.fn(),
//   getAll: jest.fn(),
//   getOneById: jest.fn(),
//   update: jest.fn(),
//   patch: jest.fn(),
//   save: jest.fn(),
// });
