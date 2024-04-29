import '@passageidentity/passage-elements/passage-user';

jest.mock('@passageidentity/passage-elements/passage-user', () => {
  const originalModule = jest.requireActual('@passageidentity/passage-elements/passage-user');

  return {
    __esModule: true,
    ...originalModule,
    PassageUser: jest.fn(() => {}) ,
    PassageUserInfo:  jest.fn(() => {}) ,
  };
});