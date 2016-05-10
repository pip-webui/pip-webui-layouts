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
            accessKeyId: 'AKIAIEXTTAEEHYPHS3OQ',
            secretAccessKey: 'otMg2vQLZjF4Nkb90j1prtugoUCNm3XqLS/KkHyc',
            region: 'us-west-1'
        }
    }
};