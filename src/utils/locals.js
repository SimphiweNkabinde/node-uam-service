export default {
    entities: [
        {
            name: 'users',
            path: '/users',
            active: true,
            tableFields: ['id', 'username', 'email', 'created_at', 'updated_at'],
        },
    ],
};
