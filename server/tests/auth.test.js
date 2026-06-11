
// ── Set env vars before anything imports dotenv ──────────────────────────────
process.env.JWT_SECRET = 'test-secret-key';
process.env.DB_NAME    = 'test';
process.env.DB_USER    = 'test';
process.env.DB_PASSWORD = 'test';

// ── Mock Sequelize so no real DB connection is made ──────────────────────────
jest.mock('../config/db', () => ({
  define: jest.fn(() => ({})),
  sync:   jest.fn(() => Promise.resolve()),
}));

// ── Mock all models ───────────────────────────────────────────────────────────
const mockUser = {
  id: 1,
  firstName: 'Test',
  lastName: 'User',
  email: 'test@citc.com',
  passwordHash: '',
  role: 'member',
  isActive: true,
  createdAt: new Date(),
};

jest.mock('../models', () => ({
  User: {
    findOne:  jest.fn(),
    findByPk: jest.fn(),
    create:   jest.fn(),
  },
}));

// ── Mock bcrypt ───────────────────────────────────────────────────────────────
jest.mock('bcrypt', () => ({
  hash:    jest.fn(() => Promise.resolve('hashed_password')),
  compare: jest.fn(),
}));

const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const { User } = require('../models');
const { register, login, getMe } = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');

// ── Helper: fake Express req/res ──────────────────────────────────────────────
function makeRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json   = jest.fn(() => res);
  return res;
}

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/auth/register', () => {

  beforeEach(() => jest.clearAllMocks());

  test('returns 400 if required fields are missing', async () => {
    const req = { body: { firstName: 'Test', email: 'x@y.com', password: 'pass1234' } }; // missing lastName
    const res = makeRes();
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('required') }));
  });

  test('returns 400 if password is under 8 characters', async () => {
    const req = { body: { firstName: 'T', lastName: 'U', email: 'x@y.com', password: 'short' } };
    const res = makeRes();
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('8 characters') }));
  });

  test('returns 409 if email already exists', async () => {
    User.findOne.mockResolvedValue(mockUser);
    const req = { body: { firstName: 'T', lastName: 'U', email: 'test@citc.com', password: 'password123' } };
    const res = makeRes();
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  test('creates user and returns 201 with token on success', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ ...mockUser });
    const req = { body: { firstName: 'Test', lastName: 'User', email: 'new@citc.com', password: 'password123' } };
    const res = makeRes();
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    const payload = res.json.mock.calls[0][0];
    expect(payload).toHaveProperty('token');
    expect(payload.user).toHaveProperty('email', mockUser.email);
    expect(payload.user).not.toHaveProperty('passwordHash'); // never expose hash
  });

  test('always assigns role "member" regardless of what is sent in body', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ ...mockUser, role: 'member' });
    const req = { body: { firstName: 'T', lastName: 'U', email: 'hacker@x.com', password: 'password123', role: 'admin' } };
    const res = makeRes();
    await register(req, res);
    // create should have been called with role: 'member', not 'admin'
    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({ role: 'member' }));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/auth/login', () => {

  beforeEach(() => jest.clearAllMocks());

  test('returns 400 if email or password missing', async () => {
    const req = { body: { email: 'x@y.com' } };
    const res = makeRes();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('returns 401 if user not found', async () => {
    User.findOne.mockResolvedValue(null);
    const req = { body: { email: 'nobody@citc.com', password: 'password123' } };
    const res = makeRes();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('returns 403 if account is deactivated', async () => {
    User.findOne.mockResolvedValue({ ...mockUser, isActive: false });
    const req = { body: { email: 'test@citc.com', password: 'password123' } };
    const res = makeRes();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('returns 401 if password does not match', async () => {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);
    const req = { body: { email: 'test@citc.com', password: 'wrongpassword' } };
    const res = makeRes();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('returns 200 with token on successful login', async () => {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    const req = { body: { email: 'test@citc.com', password: 'password123' } };
    const res = makeRes();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const payload = res.json.mock.calls[0][0];
    expect(payload).toHaveProperty('token');
    expect(payload.user.role).toBe('member');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// MIDDLEWARE — authenticate
// ─────────────────────────────────────────────────────────────────────────────
describe('authenticate middleware', () => {

  test('returns 401 if no Authorization header', () => {
    const req  = { headers: {} };
    const res  = makeRes();
    const next = jest.fn();
    authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 if token is invalid', () => {
    const req  = { headers: { authorization: 'Bearer bad.token.here' } };
    const res  = makeRes();
    const next = jest.fn();
    authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next() and sets req.user on valid token', () => {
    const token = jwt.sign({ id: 1, email: 'test@citc.com', role: 'member' }, process.env.JWT_SECRET);
    const req   = { headers: { authorization: `Bearer ${token}` } };
    const res   = makeRes();
    const next  = jest.fn();
    authenticate(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject({ id: 1, email: 'test@citc.com', role: 'member' });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// MIDDLEWARE — authorize
// ─────────────────────────────────────────────────────────────────────────────
describe('authorize middleware', () => {

  test('returns 403 if user role is not in allowed list', () => {
    const req  = { user: { id: 1, role: 'member' } };
    const res  = makeRes();
    const next = jest.fn();
    authorize('admin')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next() if role is allowed', () => {
    const req  = { user: { id: 99, role: 'admin' } };
    const res  = makeRes();
    const next = jest.fn();
    authorize('admin')(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('member can access member+admin routes', () => {
    const req  = { user: { id: 2, role: 'member' } };
    const res  = makeRes();
    const next = jest.fn();
    authorize('member', 'admin')(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
