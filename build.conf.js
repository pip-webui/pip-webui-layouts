module.exports = {
    module: { 
        name: 'pipLayouts',
        index: 'layouts'
    },
    build: {
        js: true,
        ts: true,
        html: false,
        css: true,
        lib: true,
        images: true
    },
    samples: {
        port: 8003,
        publish: {
            bucket: 'webui.pipdevs.com',
            accessKeyId: 'AKIAJCEXE5ML6CKW4I2Q',
            secretAccessKey: 'Mtqe9QlWWgRZvS8AXaZqJXaG98BR3qq8gbJqeEk+',
            region: 'us-west-1'
        },
    }
};