import { $ } from "zx";

/**
 * Git add everything in the directory this method is called and commit all the files
 *
 * @param {string} commitMessage
 * @return {Promise<void>}
 */
export async function commitEverythingInDirectory(commitMessage) {
  await $`git add .`;

  try {
    await $`git commit -m ${commitMessage}`;
  } catch (e) {
    console.log(`Nothing to commit 🤷`);
  }
}

/**
 * Init a Git repository with initial branch named with input string
 *
 * @param {string} branch
 * @return {Promise<void>}
 */
export async function initRepo(branch) {
  await $`git init --initial-branch ${branch}`;
}
