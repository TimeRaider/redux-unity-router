export default [
    {
        id: 'Main',
        pattern: '/main/',
        data: {
            pageTitle: 'test'
        },
        routes: [
            {
                id: 'User',
                pattern: '/user'
            },
            {
                id: 'default',
                pattern: '*'
            }
        ]
    },
    {
        id: 'Settings',
        pattern: '/application/settings/'
    }
];