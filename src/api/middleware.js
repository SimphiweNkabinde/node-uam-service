import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors.js';
import permissionController from './permissions/controller.js';

export default {

    auth: async(ctx, next) => {

        const authString = ctx.headers.authorization;
        const serviceKey = ctx.headers['x-api-key'];

        if (!authString || !serviceKey) return new UnauthorizedError('invalid or missing credentials');

        try {
            const userToken = authString.split(' ')[0].toLowerCase() === 'bearer' ? authString.split(' ')[1] : null;
            const user = jwt.verify(userToken, process.env.JWT_SECRET);
            ctx.state.user = user;

            const service = await permissionController.findService({ api_key: serviceKey });

            if (!service) return new UnauthorizedError('invalid or missing credentials');

            ctx.state.service = service;

            return next();
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            return new UnauthorizedError('invalid or missing credentials');
        }
    },
};
