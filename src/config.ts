let basePath = 'https://buk-gg-website-kn2ikckb5a-ez.a.run.app';

if (process.env.NODE_ENV === 'development') {
    basePath =
    'https://localhost:44302';
    // 'https://buk-gg-website-kn2ikckb5a-ez.a.run.app';
}

export default {
    api: {
        basePath,
    },
    authentication: {
        domain: 'login.bcc.no',
        audience: 'https://buk.gg/api',
        clientID: 'F17tny0a4z55HysZmdppNF0RCLTMiyet',
        redirectUri: '/callback',
    },
};
