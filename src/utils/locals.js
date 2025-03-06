import { object, string } from 'yup';
export default {
    entities: [
        {
            name: 'users',
            path: '/admin/entity/users',
            active: true,
            tableFields: ['id', 'username', 'email', 'created_at', 'updated_at'],
            displayField: 'username',
            forms: {
                read: {
                    allowed: true,
                    fields: [
                        'username',
                        'email',
                        'created_at',
                        'updated_at',
                    ],
                },
                create: { allowed: false },
            },
        },
        {
            name: 'services',
            path: '/admin/entity/services',
            active: true,
            tableFields: ['id', 'name', 'created_at', 'updated_at'],
            displayField: 'name',
            forms: {
                read: {
                    allowed: true,
                    fields: [
                        'name',
                        'api_key',
                        'description',
                        'created_at',
                        'updated_at',
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
        {
            name: 'permissions',
            path: '/admin/entity/permissions',
            active: true,
            tableFields: ['id', 'name', 'description'],
            displayField: 'name',
            forms: {
                read: {
                    allowed: true,
                    fields: [
                        'name',
                        'description',
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
};
