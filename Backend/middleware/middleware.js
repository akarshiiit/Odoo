const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'change_me_access_secret';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'change_me_refresh_secret';
const TOKEN_ISSUER = process.env.JWT_ISSUER || 'my-app';

class AuthError extends Error {
  constructor(message, statusCode = 401, code = 'UNAUTHORIZED') {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

function extractToken(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  if (req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken;
  }

  return null;
}

async function isTokenRevoked() {
  return false;
}

function verifyToken(token, secret) {
  try {
    return jwt.verify(token, secret, { issuer: TOKEN_ISSUER });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AuthError('Access token expired', 401, 'TOKEN_EXPIRED');
    }
    if (err.name === 'JsonWebTokenError') {
      throw new AuthError('Invalid token', 401, 'TOKEN_INVALID');
    }
    throw new AuthError('Token verification failed', 401, 'TOKEN_VERIFICATION_FAILED');
  }
}

function requireAuth(req, res, next) {
  (async () => {
    const token = extractToken(req);

    if (!token) {
      throw new AuthError('No token provided', 401, 'NO_TOKEN');
    }

    const decoded = verifyToken(token, ACCESS_TOKEN_SECRET);

    if (await isTokenRevoked(decoded, token)) {
      throw new AuthError('Token has been revoked', 401, 'TOKEN_REVOKED');
    }

    req.user = decoded;
    req.token = token;
    next();
  })().catch((err) => next(err));
}

function optionalAuth(req, res, next) {
  (async () => {
    const token = extractToken(req);

    if (!token) {
      req.user = null;
      return next();
    }

    try {
      const decoded = verifyToken(token, ACCESS_TOKEN_SECRET);
      if (!(await isTokenRevoked(decoded, token))) {
        req.user = decoded;
        req.token = token;
      } else {
        req.user = null;
      }
    } catch (_err) {
      req.user = null;
    }

    next();
  })().catch((err) => next(err));
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthError('Authentication required', 401, 'NO_AUTH'));
    }

    const userRoles = Array.isArray(req.user.roles)
      ? req.user.roles
      : [req.user.role].filter(Boolean);

    const hasRole = userRoles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      return next(
        new AuthError(
          `Requires one of the following roles: ${allowedRoles.join(', ')}`,
          403,
          'FORBIDDEN_ROLE'
        )
      );
    }

    next();
  };
}

function requirePermission(...requiredPermissions) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthError('Authentication required', 401, 'NO_AUTH'));
    }

    const userPermissions = req.user.permissions || [];

    const hasAll = requiredPermissions.every((perm) => userPermissions.includes(perm));

    if (!hasAll) {
      return next(
        new AuthError(
          `Missing required permission(s): ${requiredPermissions.join(', ')}`,
          403,
          'FORBIDDEN_PERMISSION'
        )
      );
    }

    next();
  };
}

function requireOwnership(getOwnerId) {
  return (req, res, next) => {
    (async () => {
      if (!req.user) {
        throw new AuthError('Authentication required', 401, 'NO_AUTH');
      }

      const userId = req.user.id || req.user.sub;
      const ownerId = await getOwnerId(req);

      const isOwner = String(userId) === String(ownerId);
      const isAdmin = (req.user.roles || [req.user.role]).includes('admin');

      if (!isOwner && !isAdmin) {
        throw new AuthError('You do not own this resource', 403, 'FORBIDDEN_OWNERSHIP');
      }

      next();
    })().catch((err) => next(err));
  };
}

function verifyRefreshToken(req, res, next) {
  (async () => {
    const token = req.body?.refreshToken || req.cookies?.refreshToken;

    if (!token) {
      throw new AuthError('No refresh token provided', 401, 'NO_REFRESH_TOKEN');
    }

    const decoded = verifyToken(token, REFRESH_TOKEN_SECRET);

    if (await isTokenRevoked(decoded, token)) {
      throw new AuthError('Refresh token has been revoked', 401, 'REFRESH_TOKEN_REVOKED');
    }

    req.refreshTokenPayload = decoded;
    next();
  })().catch((err) => next(err));
}

function authErrorHandler(err, req, res, next) {
  if (err instanceof AuthError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }
  next(err);
}

module.exports = {
  requireAuth,
  optionalAuth,
  requireRole,
  requirePermission,
  requireOwnership,
  verifyRefreshToken,
  authErrorHandler,
  extractToken,
  verifyToken,
  AuthError,
};