import { Era, EraType, Article, GlobalTag } from './types';

// Helper for the detailed mock article content matching the user's screenshot
const detailedArticleContent = `
<div class="article-body">
  <p class="mb-6">
    永光四年九 （削衣） <span class="slip-tag">Ⅱ90DXT0214S: 116</span>
  </p>
  <p class="mb-6">
    □月己酉朔丙寅敦煌□□ <span class="slip-tag">Ⅱ90DXT0214S: 160</span>
  </p>
  <p class="mb-4">我们把两简拼合后，截取碴口部分图版如下：</p>
  
  <div class="my-8 border border-gray-400 max-w-md mx-auto">
    <div class="grid grid-cols-2 text-center text-sm border-b border-gray-400 bg-gray-50">
      <div class="p-2 border-r border-gray-400">红外</div>
      <div class="p-2">彩图</div>
    </div>
    <div class="grid grid-cols-2">
      <div class="border-r border-gray-400">
        <img src="https://picsum.photos/seed/infrared1/200/400?grayscale" alt="红外影像" class="w-full h-auto block" />
      </div>
      <div>
        <img src="https://picsum.photos/seed/color1/200/400" alt="彩色影像" class="w-full h-auto block" />
      </div>
    </div>
  </div>

  <p class="mb-6 indent-8 leading-loose">
    对比可知两简是同一探方，两简碴口吻合，松木材质，<sup>[1]</sup>字形、形制以及书写风格等较为一致，文意通畅，碴口处文字可以复原，纹路可以贯通。查核《悬泉汉简》提供的两简尺寸规格，Ⅱ90DXT0214S：116号简2.3×1.0×0.2cm，Ⅱ90DXT0214S：160号简3.8×1.0×0.15cm，两简厚度趋同、宽度相同，长度适宜。
  </p>
  
  <p class="mb-4 indent-8">由此，两简当可缀合，释文作：</p>
  
  <p class="mb-8 p-4 bg-gray-50 border-l-4 border-gray-300">
    永光四年六月己酉朔丙寅敦煌□□ <span class="slip-tag">Ⅱ90DXT0214S：116+160</span>
  </p>
  
  <div class="text-center my-8 text-lg font-serif italic text-gray-400">— 2 —</div>

  <p class="mb-4">
    □□日未□□ <span class="slip-tag">Ⅱ90DXT0214S：137</span>
  </p>
  <p class="mb-4">
    十一月廿二□ <span class="slip-tag">Ⅱ90DXT0214S：144A</span>
  </p>
  <p class="mb-6">
    日□ <span class="slip-tag">Ⅱ90DXT0214S：144B</span>
  </p>
  
  <p class="mb-4">我们把两简拼合后，截取碴口部分图版如下：</p>

  <div class="my-8 border border-gray-400 max-w-md mx-auto">
    <div class="grid grid-cols-2 text-center text-sm border-b border-gray-400 bg-gray-50">
      <div class="p-2 border-r border-gray-400">红外</div>
      <div class="p-2">彩图</div>
    </div>
    <div class="grid grid-cols-2">
      <div class="border-r border-gray-400">
        <img src="https://picsum.photos/seed/infrared2/200/400?grayscale" alt="红外影像" class="w-full h-auto block" />
      </div>
      <div>
        <img src="https://picsum.photos/seed/color2/200/400" alt="彩色影像" class="w-full h-auto block" />
      </div>
    </div>
  </div>
  
  <div class="mt-12 pt-6 border-t border-gray-300 text-sm text-gray-600">
    <p class="mb-2"><strong>参考文献：</strong></p>
    <p>[1] 简牍整理小组：《悬泉汉简（壹）》，上海古籍出版社，2019年，第12页。</p>
    <p>[2] 胡平生、李天虹：《长江流域出土简牍与研究》，湖北教育出版社，2004年。</p>
  </div>
</div>
`;

// Helper to generate generic articles with SAFE IDs
const generateArticles = (idPrefix: string, categoryName: string, count: number): Article[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${idPrefix}-art-${i + 1}`,
    title: `${categoryName}释文研究与考证之（${i + 1}）`,
    author: '简牍研究中心',
    publishDate: '2023-05-12',
    views: 100 + i * 23,
    summary: `本文对${categoryName}中的第${i+1}组简牍进行了重新缀合与释读，发现了关于当时...`,
    content: `<div class="p-4"><p>此处为文章正文内容。关于<strong>${categoryName}</strong>的详细学术研究...</p><p class="mt-4">简牍作为出土文献，具有极其重要的史料价值。</p></div>`,
    tags: ['释文', '考证']
  }));
};

export const COLLECTIONS: Era[] = [
  {
    id: 'warring-states',
    name: EraType.WARRING_STATES,
    categories: [
      {
        id: 'yangtianhu',
        name: '长沙仰天湖楚简',
        articles: [
            ...generateArticles('yangtianhu', '长沙仰天湖楚简', 5),
            {
                id: 'demo-article-1',
                title: '《悬泉汉简（五）》缀合札记（十）',
                author: '姚磊',
                publishDate: '2025-11-21 10:19:23',
                views: 116,
                content: detailedArticleContent,
                summary: '本文对悬泉汉简（五）中的若干残简进行了缀合复原，并考证了其释文。',
                tags: ['缀合', '悬泉汉简', '姚磊']
            }
        ]
      },
      { id: 'wulipai', name: '五里牌楚简', articles: generateArticles('wulipai', '五里牌楚简', 3) },
      { id: 'yangjiawan', name: '杨家湾楚简', articles: generateArticles('yangjiawan', '杨家湾楚简', 2) }
    ]
  },
  {
    id: 'qin',
    name: EraType.QIN,
    categories: [
      { id: 'chaoyangxiang', name: '朝阳巷秦简', articles: generateArticles('chaoyangxiang', '朝阳巷秦简', 4) },
      { id: 'pozijie-qin', name: '坡子街秦简', articles: generateArticles('pozijie-qin', '坡子街秦简', 3) }
    ]
  },
  {
    id: 'western-han',
    name: EraType.WESTERN_HAN,
    categories: [
      { id: 'mawangdui', name: '马王堆医简', articles: generateArticles('mawangdui', '马王堆医简', 8) },
      { id: 'qiance', name: '遣策', articles: generateArticles('qiance', '遣策', 4) },
      { id: 'zoumalou-han', name: '走马楼西汉简', articles: generateArticles('zoumalou-han', '走马楼西汉简', 5) },
      { id: 'yuyangmu', name: '长沙渔阳墓木楬', articles: generateArticles('yuyangmu', '长沙渔阳墓木楬', 2) },
      { id: 'qingshaoniangong', name: '长沙青少年宫西汉简', articles: generateArticles('qingshaoniangong', '长沙青少年宫西汉简', 3) },
      { id: 'sanjian', name: '长沙散见出土汉简', articles: generateArticles('sanjian', '长沙散见出土汉简', 6) }
    ]
  },
  {
    id: 'eastern-han',
    name: EraType.EASTERN_HAN,
    categories: [
      { id: 'dongpailou', name: '东牌楼汉简', articles: generateArticles('dongpailou', '东牌楼汉简', 5) },
      { id: 'shangdejie', name: '尚德街东汉简', articles: generateArticles('shangdejie', '尚德街东汉简', 3) },
      { id: 'wuyiguangchang', name: '五一广场东汉简', articles: generateArticles('wuyiguangchang', '五一广场东汉简', 10) },
      { id: 'pozijie-dong', name: '坡子街东汉简', articles: generateArticles('pozijie-dong', '坡子街东汉简', 2) },
      { id: 'jiuruzhai', name: '九如斋东汉简', articles: generateArticles('jiuruzhai', '九如斋东汉简', 3) }
    ]
  },
  {
    id: 'wu',
    name: EraType.THREE_KINGDOMS_WU,
    categories: [
      { id: 'zoumalou-wu', name: '走马楼吴简', articles: generateArticles('zoumalou-wu', '走马楼吴简', 12) }
    ]
  }
];

export const INITIAL_TAGS: GlobalTag[] = [
  { id: '1', name: '释文' },
  { id: '2', name: '考证' },
  { id: '3', name: '缀合' },
  { id: '4', name: '文字学' },
  { id: '5', name: '历史' },
  { id: '6', name: '考古报告' }
];

export const APP_TITLE = "长沙出土简牍文库";