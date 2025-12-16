// 心灵贴士数据
const copingTips = [
    {
        id: 1,
        title: "深呼吸练习",
        description: "4-7-8呼吸法：吸气4秒，屏息7秒，呼气8秒。重复5次，能有效缓解焦虑。",
        category: "放松",
        icon: "fas fa-wind",
        color: "#4dabf7"
    },
    {
        id: 2,
        title: "正念冥想",
        description: "专注于当下，观察自己的感受但不评判。每天5分钟，提升心理韧性。",
        category: "正念",
        icon: "fas fa-spa",
        color: "#69db7c"
    },
    {
        id: 3,
        title: "情绪日记",
        description: "每天记录情绪变化和触发因素，帮助你更好地了解自己的情绪模式。",
        category: "自我认知",
        icon: "fas fa-book",
        color: "#ffa94d"
    },
    {
        id: 4,
        title: "散步运动",
        description: "户外散步30分钟，阳光和运动都能提升心情，释放压力荷尔蒙。",
        category: "运动",
        icon: "fas fa-walking",
        color: "#9775fa"
    },
    {
        id: 5,
        title: "感恩练习",
        description: "每天睡前记录3件值得感恩的事，培养积极心态。",
        category: "积极心态",
        icon: "fas fa-heart",
        color: "#ff6b6b"
    },
    {
        id: 6,
        title: "社交连接",
        description: "联系信任的朋友或家人，分享感受，获得社会支持。",
        category: "社交",
        icon: "fas fa-users",
        color: "#74c0fc"
    },
    {
        id: 7,
        title: "音乐疗法",
        description: "听舒缓的音乐，让心情平静。古典音乐或自然声音效果尤佳。",
        category: "放松",
        icon: "fas fa-music",
        color: "#ffa94d"
    },
    {
        id: 8,
        title: "渐进式肌肉放松",
        description: "从脚趾开始，依次收紧然后放松身体各部位肌肉，缓解紧张。",
        category: "放松",
        icon: "fas fa-hand-spock",
        color: "#69db7c"
    },
    {
        id: 9,
        title: "创意表达",
        description: "通过绘画、写作或手工表达情绪，让情感有出口。",
        category: "自我表达",
        icon: "fas fa-paint-brush",
        color: "#9775fa"
    },
    {
        id: 10,
        title: "自我关怀",
        description: "像对待好朋友一样对待自己，给自己鼓励和理解。",
        category: "自我认知",
        icon: "fas fa-hands-helping",
        color: "#ff6b6b"
    },
    {
        id: 11,
        title: "设定小目标",
        description: "把大任务分解成小目标，每完成一个给自己小奖励。",
        category: "目标设定",
        icon: "fas fa-flag-checkered",
        color: "#4dabf7"
    },
    {
        id: 12,
        title: "数字排毒",
        description: "每天留出1小时远离电子设备，给大脑休息时间。",
        category: "自我照顾",
        icon: "fas fa-mobile-alt",
        color: "#868e96"
    },
    {
        id: 13,
        title: "拥抱自然",
        description: "接触大自然，呼吸新鲜空气，观察植物生长。",
        category: "放松",
        icon: "fas fa-tree",
        color: "#69db7c"
    },
    {
        id: 14,
        title: "肯定自语",
        description: "每天对自己说积极的话，如'我能处理好这件事'。",
        category: "积极心态",
        icon: "fas fa-comment-alt",
        color: "#ffa94d"
    },
    {
        id: 15,
        title: "帮助他人",
        description: "小的善举能带来满足感，提升自我价值感。",
        category: "社交",
        icon: "fas fa-hands",
        color: "#9775fa"
    }
];

// 按分类获取贴士
function getTipsByCategory(category) {
    if (category === 'all') {
        return copingTips;
    }
    return copingTips.filter(tip => tip.category === category);
}

// 随机获取一个贴士
function getRandomTip() {
    const randomIndex = Math.floor(Math.random() * copingTips.length);
    return copingTips[randomIndex];
}

// 获取所有分类
function getAllCategories() {
    const categories = new Set(copingTips.map(tip => tip.category));
    return Array.from(categories);
}