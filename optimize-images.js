const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'public/images');

fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    
    files.forEach(function (file) {
        if(path.extname(file).toLowerCase() === '.png') {
            const inputFile = path.join(directoryPath, file);
            const outputFile = path.join(directoryPath, file.replace('.png', '.webp'));
            
            sharp(inputFile)
                .webp({ quality: 75 })
                .toFile(outputFile)
                .then(info => {
                    console.log(`Optimized ${file} to WebP:`, info);
                    fs.unlinkSync(inputFile);
                    console.log(`Deleted original ${file}`);
                })
                .catch(err => {
                    console.error(`Error optimizing ${file}:`, err);
                });
        }
    });
});
