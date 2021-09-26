const archiver = require('archiver');
const fs = require('fs');
/**
 * @param {String} source
 * @param {String} out
 * @returns {Promise}
 */
export function zipDirectory(source, out) {
    const archive = archiver('zip', { zlib: { level: 9 }});
    const stream = fs.createWriteStream(out);

    return new Promise((resolve, reject) => {
        archive
            .directory(source, false)
            .on('error', err => reject(err))
            .pipe(stream)
        ;

        stream.on('close', () => resolve());
        archive.finalize();
    });
}
