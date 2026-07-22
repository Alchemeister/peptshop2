# Publishing and private-app sync

This is the UI-only PeptShop repository. It contains no private application code or credentials.
Its canonical private remote is `https://github.com/Alchemeister/peptshop2.git`.

## Repository ownership

- The frontend owner controls this repository and authors its commits.
- The private application consumes only reviewed, pinned revisions.
- The private backend owner's GitHub identity is not required as a collaborator or commit author.
- Keep the repository private unless the frontend owner deliberately decides otherwise.

For a fresh clone:

```bash
git clone https://github.com/Alchemeister/peptshop2.git
cd peptshop2
npm install
npm run build
```

The repository starts with a clean frontend-owner history. It does not inherit the private
application's commits, authors, usernames, emails, or remotes.

## Sync it into the private application

The repository does not need to be public. The private application should pin a reviewed frontend
commit as a Git submodule, subtree, or source package. The preferred production sequence is:

1. The frontend owner pushes a design commit.
2. The private application updates its pinned frontend revision.
3. Boundary checks, adapter tests, and the production build run against that exact revision.
4. The verified private application is deployed.

The frontend repository never needs access to the private application repository. For a private
frontend repository, give the private application's build environment read-only access with one of
these machine identities:

1. A repository-scoped read-only deploy key. This is the simplest option for one frontend repo.
2. A GitHub App installed only on the frontend repo with read-only Contents permission. This is the
   better option when automated token rotation is needed.

Do not add the private backend owner's personal GitHub account as a collaborator. Do not commit or
push to the frontend repository from a machine configured with that personal Git author. The
frontend owner creates every frontend commit under their own identity, while the private app only
reads and pins an approved commit SHA.

The frontend owner's standalone deployment remains a mock design workspace. Operational routes
such as `/admin`, `/admin/pricing`, `/panel`, and `/local/admin/*` become live only when the reviewed
frontend source is consumed by the private application. Authorized operators use those routes on
the private application, not on the standalone preview.

The frontend owner's repository can change presentation code freely. A frontend change reaches
production only after the private application pins that revision, passes its boundary checks, and
deploys. This keeps the backend private and makes every design update reviewable and reversible.

## Environment safety

Never copy or send the private application's `.env.local`. This repository does not need one.
The frontend preview uses mock data, and the production application supplies sanitized view models
and callbacks at the private boundary.
