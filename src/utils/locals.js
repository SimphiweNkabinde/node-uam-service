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
    ],
};
