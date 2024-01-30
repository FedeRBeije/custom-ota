const fs = require("fs-extra");
const path = require("path");
const { promisify } = require("util");

const exec = promisify(require("child_process").exec);

async function exportAndCommit(directory) {
  try {
    // Check if the export was successful
    const distPath = path.join(process.cwd(), "dist");
    console.log("Checking if the export was successful...", distPath);
    if (!fs.existsSync(distPath)) {
      throw new Error('Exported "dist" folder not found.');
    }

    //create a clone of second repo
    const tempCloneDir = path.join(process.cwd(), "temp-clone");
    await exec(
      `git clone git@github.com:FedeRBeije/expo-updates.git ${tempCloneDir}`,
    );

    // Construct the source directory path (dist) and the destination directory path (updateDir)
    const destinationDir = path.join(tempCloneDir, "updates", directory);

    // Ensure that the source directory (dist) exists
    if (!fs.existsSync(distPath)) {
      console.error("Source directory does not exist:", distPath);
      process.exit(1);
    }

    // Create the destination directory if it doesn't exist
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }

    // Copy the contents of the source directory (dist) to the destination directory (updateDir)
    try {
      fs.copySync(distPath, destinationDir);
      console.log("Contents of dist directory copied successfully.");
    } catch (err) {
      console.error("Error copying contents:", err);
      process.exit(1);
    }

    // Change directory to the `dist` folder
    process.chdir(tempCloneDir);

    await exec(
      "node ./scripts/exportClientExpoConfig.js > " +
        destinationDir +
        "/expo-config.json",
    );

    // Add all files to the repository
    await exec("git add .");

    // Commit the changes
    await exec(`git commit -m "Exported client app ${directory}"`);

    // Push the changes to the remote repository
    await exec("git push  origin main");

    console.log("Export and commit successful.");

    // Remove the temporary clone
    await exec("cd ../");
    await exec("rm -rf temp-clone");

    // Return the directory name for further processing
    return directory;
  } catch (error) {
    console.error("Error during export and commit:", error);
  }
}

// Read the directory flag from the command line arguments
const args = process.argv.slice(2);
const directoryFlagIndex = args.indexOf("--directory");
const directory =
  directoryFlagIndex !== -1 ? args[directoryFlagIndex + 1] : null;

if (!directory) {
  console.error(
    "Please provide a directory flag (--directory) specifying where to publish the dist folder in the second repository.",
  );
  process.exit(1);
}

// Execute the functions
exportAndCommit(directory);
