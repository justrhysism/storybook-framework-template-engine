import { $, cd } from 'zx';
import { commitEverythingInDirectory, initRepo } from './git-helper.mjs';
import { copy, createTmpDir } from './fs-helper.mjs';

export const frameworks = [
  'cra',
  'cra_typescript',
  'react',
  // "react_typescript",
  // "webpack_react",
  // "react_in_yarn_workspace",
  // "angular10",
  // "angular11",
  'angular',
  // "web_components",
  'web_components_typescript',
  'web_components_lit2',
  'vue',
  'vue3',
  'html',
  'preact',
  // "sfcVue",
  'svelte',
];

const logger = console;
const tmpFolder = await createTmpDir();
const scriptPath = __dirname;
const templatesFolderPath = `${scriptPath}/templates`;

const useNextVersion = argv.next;
const remote = argv.remote;
const push = argv.push;
const forcePush = argv['force-push'];
const gitBranch = useNextVersion ? 'next' : 'main';
const sbCliVersion = useNextVersion ? 'next' : 'latest';

cd(tmpFolder);

await initRepo(gitBranch);
await copy(`${templatesFolderPath}/${gitBranch}/README.md`, tmpFolder);

for (const framework of frameworks) {
  await $`npx sb@${sbCliVersion} repro --template ${framework} ${framework}`;
  await $`rm -rf ${framework}/.git`;
  await copy(`${templatesFolderPath}/${gitBranch}/.stackblitzrc`, `${tmpFolder}/${framework}`);
}

let commitMessage = `Storybook Examples - ${new Date().toDateString()}`;
await commitEverythingInDirectory(commitMessage);

logger.info(`
 All the examples were bootstrapped:
    - in ${tmpFolder}
    - using the '${sbCliVersion}' version of Storybook CLI
    - and committed on the '${gitBranch}' branch of a local Git repository 
 
 Also all the files in the 'templates' folder were copied at the root of the Git repository.
`);

try {
  if (remote) {
    await $`git remote add origin ${remote}`;

    if (push) {
      await $`git push --set-upstream origin ${gitBranch} ${forcePush ? '--force' : ''}`;
      const remoteRepoUrl = `${remote.replace('.git', '')}/tree/${gitBranch}`;
      logger.info(`🚀 Everything was pushed on ${remoteRepoUrl}`);
    } else {
      logger.info(`
   To publish these examples you just need to:
      - push the branch: 'git push --set-upstream origin ${gitBranch}' (you might need '--force' option ;))
  `);
    }
  } else {
    logger.info(`
   To publish these examples you just need to:
      - add a remote Git repository: 'git remote add origin XXXXXXX'
      - push the branch: 'git push --set-upstream origin ${gitBranch}' (you might need '--force' option ;))
  `);
  }
} catch (e) {
  logger.error(e);
}
