import { object, string } from 'yup';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,64}$/;

const register = object({
    username: string().trim().min(2).lowercase().required(),
    email: string().trim().lowercase().email().required(),
    password: string().trim().min(8).max(64).required()
        .matches(passwordRegex, 'requires at least 1 uppercase, 1 lowercase, 1 digit, 1 special character (!@#$%^&*/), length from 8 to 64.'),
});

const login = object({
    email: string().trim().lowercase().required(),
    password: string().trim().required(),
});

export {
    register,
    login,
};
