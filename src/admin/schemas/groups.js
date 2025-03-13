import { number, object, string } from 'yup';

const create = object({
    name: string().trim().lowercase().required(),
    description: string().trim().required(),
});

const update = object({
    name: string().trim().lowercase(),
    description: string().trim(),
});

const assignUser = object({
    userId: number().min(1).required(),
    groupId: number().min(1).required(),
});

export default { create, update, assignUser };
