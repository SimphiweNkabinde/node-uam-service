import { object, string } from 'yup';

const create = object({
    name: string().trim().lowercase().required(),
    description: string().trim().required(),
});

const update = object({
    name: string().trim().lowercase(),
    description: string().trim(),
});

export default { create, update };
