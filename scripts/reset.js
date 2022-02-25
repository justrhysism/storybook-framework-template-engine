import fs from 'fs';
import { remove } from 'fs-extra';
import { spawn } from 'child_process';
import trash from 'trash';

const logger = console;

fs.writeFileSync('reset.log', '');

const cleaningProcess = spawn('git', [
  'clean',
  '-xdf',
  '-n',
  '--exclude=".vscode"',
  '--exclude=".idea"',
]);

cleaningProcess.stdout.on('data', (data) => {
  if (data && data.toString()) {
    const l = data
      .toString()
      .split(/\n/)
      .forEach((i) => {
        const [, uri] = i.match(/Would remove (.*)$/) || [];

        if (uri) {
          if (
            uri.match(/node_modules/) ||
            uri.match(/dist/) ||
            uri.match(/ts3\.4/) ||
            uri.match(/\.cache/) ||
            uri.match(/dll/)
          ) {
            remove(uri).then(() => {
              logger.log(`deleted ${uri}`);
            });
          } else {
            trash(uri)
              .then(() => {
                logger.log(`trashed ${uri}`);
              })
              .catch((e) => {
                logger.log('failed to trash, will try permanent delete');
                remove(uri);
              });
          }
        }
      });
  }
  fs.appendFile('reset.log', data, (err) => {
    if (err) {
      throw err;
    }
  });
});
cleaningProcess.on('exit', (code) => {
  if (code === 0) {
    logger.log('all went well, files are being trashed now');
  } else {
    logger.error(code);
  }
});
