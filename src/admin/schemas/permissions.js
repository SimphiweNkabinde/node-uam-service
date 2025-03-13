import { number, object, string } from 'yup';

const create = object({
    name: string().trim().lowercase().required(),
    description: string().trim().required(),
    serviceId: number().min(1).required(),
});

export default { create };
