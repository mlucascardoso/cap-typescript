import { readdirSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

const files = readdirSync(resolve(__dirname, '..', 'srv')).filter((file) => file.includes('.cds'));

for (const file of files) {
    const srvPath = resolve(__dirname, '..', 'srv');
    const srcPath = resolve(__dirname, '..', 'src');
    const cdsToConvert = `--cds ${srvPath}/${file}`;
    const fileWithoutExtension = file.split('.')[0];
    const outputFile = `--output ${srcPath}/entities/${fileWithoutExtension}.ts`;
    execSync(`npx cds2types ${cdsToConvert} ${outputFile} -f`);
}

execSync('cds build && cp .cdsrc.json gen/srv');
