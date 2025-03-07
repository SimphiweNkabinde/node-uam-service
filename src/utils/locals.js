import { object, string } from 'yup';
export default {
    entities: [
        {
            name: {
                singular: 'user',
                plural: 'users',
            },
            path: '/admin/entity/users',
            active: true,
            tableFields: ['id', 'username', 'email'],
            displayField: 'username',
            relations: [
                {
                    type: 'many-to-many',
                    entityName: { singular: 'permission', plural: 'permissions' },
                    displayField: 'name',
                },
            ],
            forms: {
                read: {
                    allowed: true,
                    fields: [
                        'username',
                        'email',
                        'permissions.name',
                    ],
                },
                create: { allowed: false },
            },
        },
        {
            name: {
                singular: 'service',
                plural: 'services',
            },
            path: '/admin/entity/services',
            active: true,
            tableFields: ['id', 'name'],
            displayField: 'name',
            relations: [
                {
                    type: 'one-to-many',
                    entityName: { plural: 'permissions', singular: 'permission' },
                    displayField: 'name',
                },
            ],
            forms: {
                read: {
                    allowed: true,
                    fields: [
                        'name',
                        'api_key',
                        'description',
                        'permissions.name',
                    ],
                },
                create: {
                    allowed: true,
                    fields: [
                        'name',
                        'description',
                    ],
                    schema: object({
                        name: string().trim().lowercase().min().required(),
                        description: string().trim().required(),
                    }),
                },
            },
        },
        {
            name: {
                singular: 'permission',
                plural: 'permissions',
            },
            path: '/admin/entity/permissions',
            active: true,
            tableFields: ['id', 'name', 'description'],
            displayField: 'name',
            relations: [
                {
                    type: 'many-to-one',
                    entityName: { plural: 'services', singular: 'service' },
                    displayField: 'name',
                },
            ],
            forms: {
                read: {
                    allowed: true,
                    fields: [
                        'name',
                        'description',
                        'service.name',
                    ],
                },
                create: {
                    allowed: true,
                    fields: [
                        'name',
                        'description',
                    ],
                    schema: object({
                        name: string().trim().lowercase().required(),
                        description: string().trim().required(),
                    }),
                },
            },
        },
    ],
    helpers: {
        formattedDate: (dateString) => {
            const date = new Date(dateString);
            const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} ${date.toLocaleTimeString()}`;
        },
    },
};
