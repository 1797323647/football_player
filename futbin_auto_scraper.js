/**
 * Futbin 自动化球员卡片抓取器
 * 流程: 首次手动验证 -> 保存状态 -> 自动遍历抓取
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// ============ 配置 ============
const CONFIG = {
  userDataDir: path.join(__dirname, 'browser_data'),
  outputBaseDir: path.join('C:', 'Users', 'HouCong', 'Desktop', 'test', 'list'),
  headless: false,
  viewport: { width: 1920, height: 1080 }
};

// 待抓取的俱乐部列表 (从 SCRAPER_KNOWLEDGE.md)
const CLUBS = [
  { name: 'Arsenal', id: 1, league: 'premier-league', chinese: '阿森纳' },
  { name: 'Aston_Villa', id: 2, league: 'premier-league', chinese: '阿斯顿维拉' },
  { name: 'Bournemouth', id: 3, league: 'premier-league', chinese: '伯恩茅斯' },
  { name: 'Brentford', id: 4, league: 'premier-league', chinese: '布伦特福德' },
  { name: 'Brighton', id: 5, league: 'premier-league', chinese: '布莱顿' },
  { name: 'Burnley', id: 6, league: 'premier-league', chinese: '伯恩利' },
  { name: 'Chelsea', id: 5, league: 'premier-league', chinese: '切尔西' },
  { name: 'Crystal_Palace', id: 7, league: 'premier-league', chinese: '水晶宫' },
  { name: 'Everton', id: 8, league: 'premier-league', chinese: '埃弗顿' },
  { name: 'Fulham', id: 144, league: 'premier-league', chinese: '富勒姆' },
  { name: 'Liverpool', id: 9, league: 'premier-league', chinese: '利物浦' },
  { name: 'Manchester_City', id: 10, league: 'premier-league', chinese: '曼城' },
  { name: 'Manchester_United', id: 11, league: 'premier-league', chinese: '曼联' },
  { name: 'Newcastle', id: 13, league: 'premier-league', chinese: '纽卡斯尔' },
  { name: 'Nottingham_Forest', id: 14, league: 'premier-league', chinese: '诺丁汉森林' },
  { name: 'Tottenham', id: 18, league: 'premier-league', chinese: '热刺' },
  { name: 'West_Ham', id: 19, league: 'premier-league', chinese: '西汉姆' },
  { name: 'Wolves', id: 20, league: 'premier-league', chinese: '狼队' },
  // 西甲
  { name: 'Real_Madrid', id: 243, league: 'la-liga', chinese: '皇家马德里' },
  { name: 'Barcelona', id: 241, league: 'la-liga', chinese: '巴塞罗那' },
  { name: 'Atletico_Madrid', id: 240, league: 'la-liga', chinese: '马德里竞技' },
  { name: 'Sevilla', id: 481, league: 'la-liga', chinese: '塞维利亚' },
  { name: 'Valencia', id: 461, league: 'la-liga', chinese: '瓦伦西亚' },
  { name: 'Real_Sociedad', id: 457, league: 'la-liga', chinese: '皇家社会' },
  { name: 'Athletic_Bilbao', id: 448, league: 'la-liga', chinese: '毕尔巴鄂竞技' },
  { name: 'Villarreal', id: 483, league: 'la-liga', chinese: '比利亚雷亚尔' },
  { name: 'Real_Betis', id: 449, league: 'la-liga', chinese: '贝蒂斯' },
  { name: 'Getafe', id: 519, league: 'la-liga', chinese: '赫塔菲' },
  { name: 'Celta_Vigo', id: 450, league: 'la-liga', chinese: '塞尔塔' },
];

// 状态文件
const STATE_FILE = path.join(__dirname, 'scraper_state.json');

// ============ 工具函数 ============
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay(min = 2000, max = 4000) {
  const ms = Math.floor(min + Math.random() * (max - min));
  return delay(ms);
}

function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    }
  } catch (e) {
    console.log('⚠️ 无法加载状态文件，将创建新状态');
  }
  return {
    verified: false,
    completedClubs: [],
    failedPlayers: {},
    lastRun: null
  };
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 下载图片
async function downloadImage(url, filepath) {
  const https = require('https');
  const http = require('http');

  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.futbin.com/'
      }
    };

    const request = protocol.get(url, options, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filepath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(filepath);
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    });

    request.on('error', reject);
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// ============ 主程序 ============
async function main() {
  console.log('='.repeat(70));
  console.log('🎮 Futbin 自动化球员卡片抓取器');
  console.log('='.repeat(70));

  // 加载状态
  const state = loadState();
  console.log(`\n📊 当前状态:`);
  console.log(`   已通过验证: ${state.verified ? '✅' : '❌'}`);
  console.log(`   已完成俱乐部: ${state.completedClubs.length} 个`);
  console.log(`   上次运行: ${state.lastRun || '从未'}\n`);

  // 启动浏览器
  console.log('🚀 启动浏览器...');
  ensureDir(CONFIG.userDataDir);

  const browser = await chromium.launchPersistentContext(CONFIG.userDataDir, {
    headless: CONFIG.headless,
    viewport: CONFIG.viewport,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    bypassCSP: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });

  const page = await browser.newPage();

  try {
    // ========== 首次验证 ==========
    if (!state.verified) {
      console.log('\n' + '='.repeat(70));
      console.log('🔐 首次验证模式');
      console.log('='.repeat(70));
      console.log('\n⚠️  请手动通过 Cloudflare 验证');
      console.log('   正在打开阿森纳页面 (英超第一个俱乐部)...\n');

      const firstClub = CLUBS[0];
      const url = `https://www.futbin.com/26/players?page=1&club=${firstClub.id}`;

      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

      console.log('⏳ 等待页面加载...');
      await delay(5000);

      // 检查是否需要验证
      let needsVerify = await page.evaluate(() => {
        return document.body.innerText.includes('Just a moment') ||
               document.body.innerText.includes('Checking your browser') ||
               document.body.innerText.includes('Cloudflare');
      });

      if (needsVerify) {
        console.log('\n🛑 检测到 Cloudflare 验证页面');
        console.log('   请在浏览器中完成验证 (可能需要点击"我是人类")');
        console.log('   完成后请按回车键继续...\n');

        // 等待用户按回车
        await waitForEnter();

        // 再次检查
        await delay(3000);
        needsVerify = await page.evaluate(() => {
          return document.body.innerText.includes('Just a moment') ||
                 document.body.innerText.includes('Checking your browser');
        });

        if (needsVerify) {
          console.log('❌ 验证似乎还未完成，请重新运行脚本');
          await browser.close();
          return;
        }
      }

      // 检查是否在正确的页面
      const hasTable = await page.$('table#PlayersTable') !== null;
      const hasPlayers = await page.$('a[href*="/player/"]') !== null;

      if (!hasTable && !hasPlayers) {
        console.log('⚠️ 未检测到球员列表，请确认页面已正确加载');
        console.log('   当前 URL:', await page.url());
        await browser.close();
        return;
      }

      console.log('✅ 验证通过！已确认球员列表页');
      state.verified = true;
      state.lastRun = new Date().toISOString();
      saveState(state);

      // 抓取第一个俱乐部
      await scrapeClub(page, firstClub, state);
    }

    // ========== 自动遍历剩余俱乐部 ==========
    console.log('\n' + '='.repeat(70));
    console.log('🤖 自动抓取模式');
    console.log('='.repeat(70));

    const remainingClubs = CLUBS.filter(c => !state.completedClubs.includes(c.name));
    console.log(`\n📋 剩余 ${remainingClubs.length} 个俱乐部待抓取\n`);

    for (let i = 0; i < remainingClubs.length; i++) {
      const club = remainingClubs[i];
      console.log(`\n[${i + 1}/${remainingClubs.length}] 🏟️  ${club.chinese} (${club.name})`);
      console.log('-'.repeat(50));

      try {
        await scrapeClub(page, club, state);

        // 保存进度
        if (!state.completedClubs.includes(club.name)) {
          state.completedClubs.push(club.name);
        }
        saveState(state);

      } catch (e) {
        console.log(`❌ 抓取失败: ${e.message}`);

        // 检查是否需要重新验证
        const needsVerify = await page.evaluate(() => {
          return document.body.innerText.includes('Just a moment') ||
                 document.body.innerText.includes('Checking your browser');
        });

        if (needsVerify) {
          console.log('\n🛑 检测到需要重新验证');
          console.log('   请在浏览器中完成验证，然后按回车键继续...');
          await waitForEnter();

          // 重试当前俱乐部
          i--;
          continue;
        }
      }

      // 俱乐部间隔 5-8 秒
      if (i < remainingClubs.length - 1) {
        console.log('\n⏳ 等待 5-8 秒后进入下一个俱乐部...');
        await randomDelay(5000, 8000);
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('🎉 所有俱乐部抓取完成！');
    console.log('='.repeat(70));
    console.log(`\n✅ 成功完成: ${state.completedClubs.length} 个俱乐部`);

  } catch (e) {
    console.log(`\n❌ 错误: ${e.message}`);
    console.log(e.stack);
  } finally {
    await browser.close();
    saveState(state);
    console.log('\n👋 浏览器已关闭，状态已保存');
  }
}

// 抓取单个俱乐部
async function scrapeClub(page, club, state) {
  const outputDir = path.join(CONFIG.outputBaseDir, `${club.name}_2526_Cards`);
  ensureDir(outputDir);

  const url = `https://www.futbin.com/26/players?page=1&club=${club.id}`;
  console.log(`   🌐 导航到: ${url}`);

  // 导航到俱乐部页面
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await delay(4000);

  // 检查是否需要验证
  const needsVerify = await page.evaluate(() => {
    return document.body.innerText.includes('Just a moment') ||
           document.body.innerText.includes('Checking your browser');
  });

  if (needsVerify) {
    throw new Error('需要 Cloudflare 验证');
  }

  // 获取总页数
  let totalPages = 1;
  try {
    const pagination = await page.$('.pagination');
    if (pagination) {
      const pageLinks = await page.$$eval('.pagination a.page-link', links =>
        links.map(l => parseInt(l.textContent)).filter(n => !isNaN(n))
      );
      if (pageLinks.length > 0) {
        totalPages = Math.max(...pageLinks);
      }
    }
  } catch (e) {}

  console.log(`   📄 发现 ${totalPages} 页球员数据`);

  const playersData = [];
  const failedPlayers = [];

  // 遍历所有页面
  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    if (currentPage > 1) {
      const pageUrl = `https://www.futbin.com/26/players?page=${currentPage}&club=${club.id}`;
      await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await delay(3000);
    }

    // 获取球员列表
    const players = await page.evaluate(() => {
      const data = [];
      const rows = document.querySelectorAll('table#PlayersTable tbody tr');

      rows.forEach(row => {
        // 检查是否有女足图标
        const hasWomenIcon = row.querySelector('img[src*="women"], img[alt*="Women"], .women-icon, [class*="women"]');
        if (hasWomenIcon) return;

        const nameLink = row.querySelector('td.player-name a');
        const ratingCell = row.querySelector('td.rating');

        if (nameLink) {
          const name = nameLink.textContent.trim();
          const href = nameLink.getAttribute('href') || '';
          const rating = ratingCell ? ratingCell.textContent.trim() : '0';

          let playerId = '';
          const match = href.match(/\/player\/(\d+)\//);
          if (match) playerId = match[1];

          if (name && playerId) {
            data.push({ name, href, rating: parseInt(rating) || 0, playerId });
          }
        }
      });

      return data;
    });

    console.log(`   第 ${currentPage} 页找到 ${players.length} 名球员`);

    // 去重 - 保留最高评分
    const playerMap = new Map();
    players.forEach(p => {
      const existing = playerMap.get(p.name);
      if (!existing || p.rating > existing.rating) {
        playerMap.set(p.name, p);
      }
    });
    const uniquePlayers = Array.from(playerMap.values());

    // 按评分排序
    uniquePlayers.sort((a, b) => b.rating - a.rating);

    // 处理每个球员
    for (let i = 0; i < uniquePlayers.length; i++) {
      const player = uniquePlayers[i];

      // 生成文件名
      const safeName = player.name.replace(/[\\/:*?"<>|]/g, '_');
      const filename = `${player.rating}_${safeName}.png`;
      const filepath = path.join(outputDir, filename);

      // 检查是否已存在
      if (fs.existsSync(filepath)) {
        console.log(`      [${i + 1}/${uniquePlayers.length}] ⏭️  ${player.name} (${player.rating}) - 已存在`);
        playersData.push({ ...player, skipped: true });
        continue;
      }

      try {
        console.log(`      [${i + 1}/${uniquePlayers.length}] 🎯 ${player.name} (${player.rating})`);

        // 打开球员页面
        const playerUrl = `https://www.futbin.com${player.href}`;
        const playerPage = await page.context().newPage();
        await playerPage.goto(playerUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await delay(3000);

        // 查找卡片元素
        const cardSelectors = [
          '.player-card-wrapper',
          '.pcdisplay',
          '.player-card',
          '.pcdisplay-easy',
          '.card-wrapper',
          '.player-card-container',
          '.player-header-card-section'
        ];

        let cardElement = null;
        for (const selector of cardSelectors) {
          cardElement = await playerPage.$(selector);
          if (cardElement) break;
        }

        if (!cardElement) {
          console.log(`         ⚠️ 未找到卡片元素`);
          await playerPage.close();
          failedPlayers.push(player.name);
          continue;
        }

        // 截图卡片
        const box = await cardElement.boundingBox();
        if (box) {
          // 调整截图区域
          const adjustedClip = {
            x: box.x,
            y: box.y + 35,
            width: box.width,
            height: box.height - 35
          };

          await playerPage.screenshot({
            path: filepath,
            clip: adjustedClip,
            timeout: 10000
          });

          console.log(`         ✅ 已保存: ${filename}`);
          playersData.push({ ...player, skipped: false });
        }

        await playerPage.close();

        // 随机延迟
        await randomDelay(2000, 4000);

      } catch (e) {
        console.log(`         ❌ 失败: ${e.message}`);
        failedPlayers.push(player.name);
      }
    }
  }

  // 输出简报
  const successCount = playersData.filter(p => !p.skipped).length;
  const skipCount = playersData.filter(p => p.skipped).length;

  console.log(`\n   📊 ${club.chinese} 完成:`);
  console.log(`      新下载: ${successCount} 张`);
  console.log(`      已存在: ${skipCount} 张`);
  console.log(`      失败: ${failedPlayers.length} 张`);
}

// 等待用户按回车
function waitForEnter() {
  return new Promise(resolve => {
    const rl = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('', () => {
      rl.close();
      resolve();
    });
  });
}

// 运行
main().catch(console.error);
