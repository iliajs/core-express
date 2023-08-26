import chalk from "chalk";

export const LANG = {
  serverStarted: (serverPort) =>
    `\n${"=".repeat(44)}\n${"=".repeat(5)} ${chalk.whiteBright(
      "EXPRESS"
    )} has started on port ` +
    `${chalk.whiteBright(serverPort)} ${"=".repeat(5)}\n${"=".repeat(44)}`,
};
