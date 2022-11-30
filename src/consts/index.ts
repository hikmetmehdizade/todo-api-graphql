export { AuthCookies, CookiesToken } from './cookies';
export { DecoratorKeys } from './decorators-key';

export { SubscriptionTriggers } from './subscription-triggers';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ?? '123';
const PUB_SUB = 'PUB_SUB';

export { JWT_SECRET_KEY, PUB_SUB };
