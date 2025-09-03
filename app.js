import express from "express";
import dotenv from "dotenv";
import { App } from "@octokit/app";
import { request } from "@octokit/request";

dotenv.config();
const app = express();
app.use(express.json());

const GITHUB_APP_ID = process.env.GITHUB_APP_ID;
const GITHUB_PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY.replace(/\\n/g, "\n");
const GITHUB_INSTALLATION_ID = process.env.GITHUB_INSTALLATION_ID;
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;

const ghApp = new App({
  appId: GITHUB_APP_ID,
  privateKey: GITHUB_PRIVATE_KEY
});

app.post("/trigger", async (req, res) => {
  try {
    const jwt = ghApp.getSignedJsonWebToken();

    const installationAuth = await ghApp.getInstallationAccessToken({
      installationId: GITHUB_INSTALLATION_ID
    });

    const { environment, image_tag, replicas, debug_mode } = req.body;

    const result = await request("POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches", {
      headers: {
        authorization: `token ${installationAuth}`,
        accept: "application/vnd.github+json"
      },
      owner: REPO_OWNER,
      repo: REPO_NAME,
      workflow_id: "deploy.yml",
      ref: "main",
      inputs: {
        environment,
        image_tag,
        replicas: replicas || "1",
        debug_mode: debug_mode || "false"
      }
    });

    res.json({ success: true, result: result.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("GitHub App running on port 3000");
});
