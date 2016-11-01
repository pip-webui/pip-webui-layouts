module.exports = {
    module: {
        name: 'pipLayouts',
        styles: 'index',
        export: 'pip.layouts',
        standalone: 'pip.layouts'
    },

    build: {
        js: false,
        ts: false,
        tsd: true,
        bundle: true,
        html: true,
        less: true,
        lib: true,
        images: true,
        dist: false
    },

    file: {
        lib: [
            '../pip-webui-lib/dist/**/*'
        ]
    },

    // browserify: {
    //     entries: [ './src/index.ts' ]
    // },

    samples: {
        port: 8080
    },
    api: {
        port: 8081
    }
};
