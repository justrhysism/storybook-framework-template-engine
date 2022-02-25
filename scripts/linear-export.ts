import program from 'commander';
import { LinearClient, Issue as LinearIssue, IssueLabel } from '@linear/sdk';

import { githubClient } from './utils/githubClient';

const logger = console;

const OWNER = 'storybookjs';
const REPO = 'storybook';

const { GH_TOKEN, LINEAR_API_KEY } = process.env;

const linear = new LinearClient({ apiKey: LINEAR_API_KEY });
const github = githubClient(GH_TOKEN);

type GHIssue = {
  id: number;
  url: string;
  title: string;
  body: string;
  isPr: boolean;
};

const getGHIssue = async (issueId: number): Promise<GHIssue> => {
  const data = await github(
    `
    query($owner: String!, $repo: String!, $issue: Int!) {
      repository(owner:$owner, name:$repo) {
        issueOrPullRequest(number: $issue) {
          __typename
          ... on Issue {
            title
            body
            url
          }
          ... on PullRequest {
            title
            body
            url
          }
        }
      }
    }`,
    {
      owner: OWNER,
      repo: REPO,
      issue: issueId,
    }
  );
  const { title, body, url, __typename } = data.repository.issueOrPullRequest;
  return { id: issueId, title, body, url, isPr: __typename === 'PullRequest' };
};

const findLinearIssue = async (issueKey: string): Promise<LinearIssue | undefined> => {
  const existing = await linear.issueSearch(issueKey);
  return existing.nodes.length > 0 ? existing.nodes[0] : undefined;
};

const getLabelId = (labelName: string, labels: IssueLabel[]) => {
  const found = labels.find((label) => label.name === labelName);
  if (!found) throw new Error(`Couldn't find label ${labelName}`);
  return found.id;
};

const exportToLinear = async (issueId: number) => {
  logger.log('Linear export SB', issueId.toString());

  const issue = await getGHIssue(issueId);

  const issueKey = `SB${issueId}`;
  const existingIssue = await findLinearIssue(issueKey);
  if (existingIssue) {
    logger.log('Existing linear issue, skipping', existingIssue.url);
    return;
  }

  const teamId = 'CH';
  const team = await linear.team(teamId);
  if (!team) throw new Error(`Couldn't find team ${teamId}`);
  const issueLabels = (await team.labels()).nodes;

  const labelIds = [getLabelId('Storybook', issueLabels)];
  if (issue.isPr) labelIds.push(getLabelId('PR', issueLabels));

  const created = await linear.issueCreate({
    teamId: team.id,
    title: `${issueKey} ${issue.title}`,
    description: `${issue.url}\n\n${issue.body}`,
    labelIds,
  });

  const linearIssue = await created.issue;
  logger.log(`Created ${linearIssue.url}`);

  await linear.attachmentCreate({
    issueId: linearIssue.id,
    title: issue.title,
    url: issue.url,
  });

  logger.log('Created GH URL attachment');
};

program
  .arguments('<issueId>')
  .action((issueId: string) =>
    exportToLinear(parseInt(issueId, 10)).catch((e) => {
      logger.error(e);
      process.exit(1);
    })
  )
  .parse();
