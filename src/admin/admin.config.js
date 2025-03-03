export default {
    entities: {
        users: {
            visible: true,
            indexFields: ['id', 'username', 'email', 'created_at', 'updated_at'],
        },
        services: { visible: false },
    },
};
