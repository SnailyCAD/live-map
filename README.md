# [@snailycad/live-map](https://docs.snailycad.org/docs/fivem-integrations/live-map)

SnailyCAD Live Map integration for FiveM.

## Credits

- https://github.com/TGRHavoc/live_map
- https://vespura.com/fivem/weapons/

## Developer Docs

### Source code installation

> **Warning**
> This is only for developers who want to contribute to the project.

1. Clone the repository: `git clone https://github.com/SnailyCAD/live-map.git`.
2. Install dependencies: `pnpm install`.
3. Copy `.env.example` to `.env` and enter your FXServer path.
4. Run the dev command `pnpm run dev`. This will listen for changes and automatically update the files in your FXServer.
5. Manually run `restart <resource>` in your FXServer console to restart the resource.

### Publishing

1. Run the bump releases script: `node scripts/bump-version.mjs <version-here>`.
2. Commit the changes: `git commit -am "chore(release): <version-here>`.
3. Push the changes: `git push`.
