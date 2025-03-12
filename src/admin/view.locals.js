export default {
    sidebar: {
        title: 'Nexgro',
        menu: {
            items: [
                { name: 'users', path: '/admin/users' },
                { name: 'services', path: '/admin/services' },
                { name: 'groups', path: '/admin/groups' },
            ],
        },
    },
    helpers: {
        formattedDate: (dateString) => {
            const date = new Date(dateString);
            const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} ${date.toLocaleTimeString()}`;
        },
        navigateTo: (route) => {
            window.location.href = route;
        },
    },
};
