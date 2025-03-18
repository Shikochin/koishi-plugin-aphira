import { Context, Schema } from "koishi";
import { ChartInfo, UserInfo } from "./types";

import {} from "koishi-plugin-puppeteer";
export const using = ["puppeteer"] as const;
import outdent from "outdent";

export const name = "aphira";

export interface Config {}

export const Config: Schema<Config> = Schema.object({});

const API_URL = "https://phira.5wyxi.com";

async function getChartInfo(id: number): Promise<ChartInfo> {
  const url = new URL(`chart/${id}`, API_URL);
  const res = await fetch(url.toString());
  return await res.json();
}

async function getUserInfo(id: number): Promise<UserInfo> {
  const url = new URL(`user/${id}`, API_URL);
  const res = await fetch(url.toString());
  return await res.json();
}

async function generateChartInfoHtml(chartInfo: ChartInfo) {
  const userInfo = await getUserInfo(chartInfo.uploader);
  let tags = "";
  chartInfo.tags.forEach((tag, index) => {
    if (index < 4) {
      tags += outdent`<div class="tag glass-card">${tag}</div>`;
    }
  });
  const htmlTemplate = outdent`
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&family=Noto+Sans+SC:wght@100..900&family=Poppins:ital@0;1&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: Poppins, Noto Sans SC,Noto Sans JP, serif;
        padding: 20px;
        margin: 0;
        display: flex;
        justify-content: center;
        color: white;
      }

      .container {
        display: flex;
        gap: 20px;
        max-width: 1300px;
        width: 100%;
        padding: 30px;
      }

      .left-column {
        flex: 2;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .right-column {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .card {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px) saturate(180%);
        -webkit-backdrop-filter: blur(10px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        background-color: rgba(100, 135, 148, 0.8);
        border-radius: 20px;
        padding: 20px;
        position: relative;
        font-size: 18px;
        justify-content: center;
      }

      .glass-card {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px) saturate(180%);
        -webkit-backdrop-filter: blur(10px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .main-card {
        height: 400px;
        position: relative;
        padding: 0;
        overflow: hidden;
        border-radius: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .illustration-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 20px;
        display: block;
        filter: blur(2px);
        overflow: auto;
      }

      .name-card {
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .bottom-cards {
        display: grid;
        grid-template-rows: 1fr 1fr;
        gap: 20px;
      }

      .small-card {
        flex: 1;
        height: 100px;
        display: flex;
        justify-content: center;
        align-content: center;
        flex-wrap: wrap;
        font-size: 25px;
      }

      .profile-card {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .button {
        background-color: rgba(42, 42, 42, 0.8);
        border-radius: 15px;
        padding: 10px 20px;
        display: inline-block;
        text-align: center;
        z-index: 2;
        position: absolute;
      }

      .left-button {
        top: 20px;
        left: 20px;
      }

      .right-button {
        top: 20px;
        right: 20px;
      }

      .left-bottom-button {
        bottom: 20px;
        left: 20px;
      }
      .right-bottom-button {
        bottom: 20px;
        right: 20px;
      }

      .bottom-button {
        bottom: 20px;
        right: 20px;
      }

      .uploader-section {
        display: flex;
        align-items: center;
        background-color: rgba(42, 42, 42, 0.8);
        border-radius: 20px;
        padding: 10px;
        margin-bottom: 20px;
      }

      .avatar {
        background-color: white;
        color: black;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
      }

      .avatar-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        display: block;
      }

      .uploader-name {
        flex: 1;
        text-align: center;
      }

      .description-section {
        flex: 1;
        background-color: rgba(218, 240, 247, 0.9);
        border-radius: 20px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-content: flex-start;
        color: black;
        margin-bottom: 20px;
        padding: 20px;
      }

      .tags-section {
        display: flex;
        justify-content: space-between;
        gap: 10px;
      }

      .tag {
        background-color: rgba(42, 42, 42, 0.8);
        border-radius: 15px;
        padding: 10px 20px;
        flex: 1;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="left-column">
        <div class="main-card">
          <img
            src="${chartInfo.illustration}"
            alt="Illustration"
            class="illustration-image"
          />

          <div class="button left-button glass-card">${
            chartInfo.stable ? "Stable" : "Unstable"
          }</div>
          <div class="button right-button glass-card">Rating: ${(
            chartInfo.rating * 5
          ).toFixed(2)}</div>
          <div class="button left-bottom-button glass-card">${
            chartInfo.name
          }</div>
          <div class="button right-bottom-button glass-card">${
            chartInfo.level
          }</div>
        </div>
        <div class="bottom-cards">
          <div class="card small-card">
            ${chartInfo.charter}
          </div>
          <div class="card small-card">
            ${chartInfo.composer}
          </div>
        </div>
      </div>
      <div class="right-column">
        <div class="card profile-card">
          <div class="uploader-section glass-card">
            <div class="avatar">
              <img
                src="${userInfo.avatar}"
                alt=""
                class="avatar-image"
              />
            </div>
            <div class="uploader-name">${userInfo.name}</div>
          </div>
          <div class="description-section glass-card">
            <h2>Description</h2>
            <br />
            ${chartInfo.description}
          </div>
          <div class="tags-section">
            ${tags}
          </div>
        </div>
      </div>
    </div>
  </body>
</html>

`;
  return htmlTemplate;
}

export function apply(ctx: Context) {
  ctx
    .command("chartinfo <id:number>")
    .option("origin", "-o 输出原始数据")
    .example("chartinfo 23232")
    .usage("chartinfo 谱面id")
    .alias("谱面信息")
    .action(async ({ options }, id) => {
      const chartInfo = await getChartInfo(id);
      if (options.origin) {
        return JSON.stringify(chartInfo, null, 2);
      }
      const htmlTemplate = await generateChartInfoHtml(chartInfo);
      return await ctx.puppeteer.render(htmlTemplate);
    });
}
