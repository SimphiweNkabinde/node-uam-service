import Router from 'koa-router';
const router = new Router();
import { register as registerSchema, login as loginSchema } from './schemas.js';
import { ApplicationError, ValidationError } from '../../utils/errors.js';
import authController from './controller.js';
import jwt from 'jsonwebtoken';


const basepath = '/api/auth';

router.post(`${basepath}/:provider/register`, async(ctx) => {

    if (ctx.params.provider === 'local') {

        // validation
        let strippedBody;
        try {
            await registerSchema.validate(ctx.request.body, { stripUnknown: true, abortEarly: false })
                .then((value) => strippedBody = value);
        } catch (error) {
            return new ValidationError(
                error.message,
                error.inner.map(({ path, message }) => ({ path, message })),
            );
        }

        // create user
        try {
            const user = await authController.findOneByEmail(strippedBody.email);

            if (user) {
                const detail = 'email already in use';
                return new ValidationError(detail, [{ path: 'email', detail }]);
            }
            const { id, username, email, createdAt } = await authController.register(strippedBody);
            const token = jwt.sign({ id, username, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            ctx.status = 201;
            ctx.body = { data: { id, username, email, createdAt, token } };

        } catch (error) {
            console.log(error);
            return new ApplicationError();
        }

    }

});

router.post(`${basepath}/:provider`, async(ctx) => {
    if (ctx.params.provider === 'local') {
        // validation
        let strippedBody;
        try {
            await loginSchema.validate(ctx.request.body, { stripUnknown: true, abortEarly: false })
                .then((value) => strippedBody = value);
        } catch (error) {
            return new ValidationError(
                error.message,
                error.inner.map(({ path, message }) => ({ path, message })),
            );
        }

        try {
            const user = await authController.findOneByEmail(strippedBody.email);
            if (!user) return new ValidationError('Invalid email or password');

            const { id, username, email, createdAt, updatedAt, password } = user;

            const validPassword = await authController.validatePassword(strippedBody.password, password);
            if (!validPassword) return new ValidationError('Invalid email or password');

            const token = jwt.sign({ id, username, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            ctx.status = 200;
            ctx.body = { data: { id, username, email, createdAt, updatedAt, token } };
        } catch (error) {
            console.log(error);
            return new ApplicationError();
        }
    }
});

export default router;
