export default {
    entities: [
        {
            name: 'users',
            path: '/admin/entity/users',
            active: true,
            tableFields: ['id', 'username', 'email', 'created_at', 'updated_at'],
            displayField: 'username',
            detailFields: [
                'username',
                'email',
                'created_at',
                'updated_at',
            ],
        },
        {
            name: 'services',
            path: '/admin/entity/services',
            active: true,
            tableFields: ['id', 'name', 'created_at', 'updated_at'],
            displayField: 'name',
            detailFields: [
                'name',
                'api_key',
                'description',
                'created_at',
                'updated_at',
            ],
        },
    ],
};
