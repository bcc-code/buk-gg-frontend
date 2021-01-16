let basePath = '';

if (process.env.NODE_ENV == 'development') {
    basePath = 'https://localhost:44328';
}

export default {
    api: {
        basePath: basePath,
    },
    authentication: {
        domain: 'login.bcc.no',
        audience: 'https://buk.gg/api',
        clientID: 'F17tny0a4z55HysZmdppNF0RCLTMiyet',
        redirectUri: '/callback',
    },
};
