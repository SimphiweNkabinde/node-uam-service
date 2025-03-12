import { object, string } from 'yup';

const create = object({
    name: string().trim().lowercase().required(),
    description: string().trim().required(),
});

export default { create };
