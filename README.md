Introduction:
Welcome to the Wiki page of our repository! This page serves as a guide to ensure smooth collaboration and effective development practices within our team.

1. **Linking Pull Requests to Assigned Issues:**
When working on a feature or fixing a bug, it's important to link your Pull Requests (PRs) to the corresponding GitHub issue that is assigned to you. This helps in tracking progress, providing context, and ensuring that every issue is properly addressed.

Instructions:

    When creating a PR, make sure to select the option to link it to an issue.
    Choose the issue that is assigned to you from the dropdown list.
    Provide a brief description or summary of the changes made in the PR to give reviewers context.

2**. Avoiding Direct Work on Master:**
Directly working on the master branch can lead to conflicts and difficulties in managing changes, especially in a collaborative environment. Therefore, it's best to refrain from making direct commits to the master branch.

Instructions:

    Always create a new feature branch based on the master branch when starting work on a new feature or fixing a bug.
    Make your changes within your feature branch and then create a Pull Request (PR) to merge those changes into the master branch.

Example Workflow:

    Create a new branch from the master branch: git checkout -b feature-branch-name
    Make your changes, commit them, and push the branch to the remote repository: git push origin feature-branch-name
    Create a Pull Request (PR) from your feature branch to the master branch.
    Link the PR to the corresponding GitHub issue that is assigned to you.
    Request reviews from team members and address any feedback received.
    Once approved, merge the PR into the master branch.
