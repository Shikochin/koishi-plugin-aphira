import { Context, Schema, h } from "koishi";
import { ChartInfo, UserInfo } from "./types";

import puppeteer from "puppeteer-core";

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

async function renderChartInfo(chartInfo: ChartInfo) {
  const userInfo = await getUserInfo(chartInfo.uploader);
  let tags = "";
  chartInfo.tags.forEach((tag, index) => {
    if (index < 4) {
      tags += `<div class="tag glass-card">${tag}</div>`;
    }
  });
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
        margin: 0;
        display: flex;
        justify-content: center;
        color: white;
      }

      .container {
        display: flex;
        gap: 20px;
        max-width: 1200px;
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
        background-color: rgba(61, 106, 120, 0.8);
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
        padding: 0; /* 移除内边距 */
        overflow: hidden; /* 确保图片不会溢出圆角 */
        border-radius: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      /* 图片样式 */
      .illustration-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 20px; /* 与卡片相同的圆角 */
        display: block; /* 移除底部间隙 */
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
        display: flex;
        gap: 20px;
      }

      .small-card {
        flex: 1;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
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
        z-index: 2; /* 确保按钮在图片上方 */
        position: absolute; /* 绝对定位 */
      }

      .left-button {
        top: 20px;
        left: 20px;
      }

      .right-button {
        top: 20px;
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
        border-radius: 50%; /* 与卡片相同的圆角 */
        display: block; /* 移除底部间隙 */
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
          <div class="button bottom-button glass-card">${chartInfo.level}</div>
        </div>
        <div class="card name-card">${chartInfo.name}</div>
        <div class="bottom-cards">
          <div class="card small-card">${chartInfo.charter}</div>
          <div class="card small-card">${chartInfo.composer}</div>
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
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlTemplate);

  await page.setViewport({ width: 1920, height: 1080 });
  const container = await page.waitForSelector(".container");
  // 截图并保存为文件
  const image = await container.screenshot({ type: "png", encoding: "binary" });
  await browser.close();
  return image;
}

export function apply(ctx: Context) {
  ctx
    .command("chartinfo <id:number>")
    .option("origin", "-o 输出原始数据")
    .alias("谱面信息")
    .action(async ({ session, options }, id) => {
      const chartInfo = await getChartInfo(id);
      if (options.origin) {
        return JSON.stringify(chartInfo, null, 2);
      }
      const image = await renderChartInfo(chartInfo);
      session.send(h.image(image, "image/png"));
    });
}
