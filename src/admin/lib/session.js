import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET; // Change this to a secure, environment-based key
const TOKEN_EXPIRY = '1h'; // Set token expiration time
const SESSION_NAME = 'uam.sess';


export default {
/**
 * Create a session and store it in cookies
 * @param {import('koa').Context} ctx Koa context
 * @param {Object} user payload
 */
    create: (ctx, user) => {
        const token = jwt.sign(user, SECRET_KEY, { expiresIn: TOKEN_EXPIRY });
        ctx.cookies.set(SESSION_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: true,
            maxAge: 3600000,
        });
    },

    /**
 * Decrypt and verify the session token from cookies
 * @param {import('koa').Context} ctx Koa context
 * @returns {object|null} Decoded token data if valid, otherwise null
 */
    get: (ctx) => {
        const token = ctx.cookies.get(SESSION_NAME);
        if (!token) return null;

        try {
            return jwt.verify(token, SECRET_KEY);
        } catch (error) {
            console.log(error.message);
            return null;
        }
    },

    /**
 * Destroy the session by clearing the cookie
 * @param {import('koa').Context} ctx - Koa context
 */
    destroy: (ctx) => {
        ctx.cookies.set(SESSION_NAME, null, { maxAge: 0 });
    },
};
