// 主应用程序逻辑
document.addEventListener('DOMContentLoaded', function() {
    console.log('心灵助手已启动');
    
    // ===== 全局变量 =====
    let chatHistory = [];
    let emotionStats = {
        sad: 0,
        anxious: 0,
        angry: 0,
        happy: 0,
        confused: 0,
        lonely: 0,
        tired: 0,
        general: 0
    };
    let chatCount = 0;
    let chatStartTime = new Date();
    let currentEmotion = 'general';
    let isDarkMode = false;
    let speechRecognition = null;
    
    // ===== DOM元素引用 =====
    const loadingElement = document.getElementById('loading');
    const mainContainer = document.getElementById('mainContainer');
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    const clearBtn = document.getElementById('clearBtn');
    const emergencyBtn = document.getElementById('emergencyBtn');
    const themeBtn = document.getElementById('themeBtn');
    const aboutBtn = document.getElementById('aboutBtn');
    const refreshTipBtn = document.getElementById('refreshTip');
    const helpBtn = document.getElementById('helpBtn');
    const exportBtn = document.getElementById('exportBtn');
    const emotionButtons = document.querySelectorAll('.emotion-btn');
    const currentTimeElement = document.getElementById('currentTime');
    const chatCountElement = document.getElementById('chatCount');
    const chatTimeElement = document.getElementById('chatTime');
    const emotionCountElement = document.getElementById('emotionCount');
    const currentEmotionElement = document.getElementById('currentEmotion');
    const currentEmotionIcon = document.getElementById('currentEmotionIcon');
    const tipContent = document.getElementById('tipContent');
    const emergencyModal = document.getElementById('emergencyModal');
    const aboutModal = document.getElementById('aboutModal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    // ===== 初始化函数 =====
    function init() {
        console.log('正在初始化心灵助手...');
        
        // 模拟加载过程
        setTimeout(() => {
            loadingElement.style.display = 'none';
            mainContainer.style.display = 'flex';
            console.log('界面加载完成');
            
            // 显示初始贴士
            showRandomTip();
            
            // 更新时间显示
            updateTime();
            setInterval(updateTime, 1000);
            
            // 更新聊天时长
            updateChatDuration();
            setInterval(updateChatDuration, 60000);
            
            // 加载历史数据（如果存在）
            loadFromLocalStorage();
        }, 1500);
        
        // 初始化语音识别
        initSpeechRecognition();
        
        // 设置事件监听器
        setupEventListeners();
        
        // 显示欢迎消息
        showWelcomeMessage();
    }
    
    // ===== 事件监听器设置 =====
    function setupEventListeners() {
        // 发送消息
        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // 语音输入
        voiceBtn.addEventListener('click', toggleVoiceInput);
        
        // 快速情绪按钮
        emotionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const emotion = this.getAttribute('data-emotion');
                sendQuickEmotion(emotion);
            });
        });
        
        // 清空对话
        clearBtn.addEventListener('click', clearChat);
        
        // 紧急帮助
        emergencyBtn.addEventListener('click', showEmergencyModal);
        
        // 主题切换
        themeBtn.addEventListener('click', toggleTheme);
        
        // 关于
        aboutBtn.addEventListener('click', showAboutModal);
        
        // 刷新贴士
        refreshTipBtn.addEventListener('click', showRandomTip);
        
        // 帮助
        helpBtn.addEventListener('click', showHelpInfo);
        
        // 导出记录
        exportBtn.addEventListener('click', exportChatHistory);
        
        // 关闭弹窗
        closeModalButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal');
                modal.classList.remove('active');
            });
        });
        
        // 点击弹窗外部关闭
        window.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });
        
        // 保存数据到本地存储
        window.addEventListener('beforeunload', saveToLocalStorage);
    }
    
    // ===== 消息处理函数 =====
    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // 添加用户消息
        addMessage(message, 'user');
        
        // 清空输入框
        userInput.value = '';
        
        // 分析情绪并生成回应
        setTimeout(() => {
            generateResponse(message);
        }, 500);
        
        // 更新统计
        updateStats();
    }
    
    function sendQuickEmotion(emotion) {
        const emotionInfo = getEmotionInfo(emotion);
        const message = `我感到${emotionInfo.name}`;
        
        // 添加用户消息
        addMessage(message, 'user');
        
        // 生成回应
        setTimeout(() => {
            generateResponse(message);
        }, 500);
        
        // 更新统计
        updateStats();
    }
    
    function generateResponse(userMessage) {
        // 分析情绪
        const emotion = analyzeEmotion(userMessage);
        currentEmotion = emotion;
        
        // 获取回应
        const response = getEmotionResponse(emotion);
        
        // 添加助手消息
        setTimeout(() => {
            addMessage(response, 'assistant');
            
            // 更新情绪显示
            updateEmotionDisplay();
            
            // 偶尔显示贴士
            if (Math.random() < 0.3) {
                setTimeout(showRandomTip, 1000);
            }
        }, 1000 + Math.random() * 1000); // 随机延迟，模拟思考
    }
    
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        
        const time = new Date().toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const avatar = sender === 'user' ? '👤' : '🤖';
        const senderName = sender === 'user' ? '你' : '心灵助手';
        
        messageElement.innerHTML = `
            <div class="avatar">${avatar}</div>
            <div class="message-content">
                <div class="sender">${senderName}</div>
                <div class="text">${text}</div>
                <div class="time">${time}</div>
            </div>
        `;
        
        chatMessages.appendChild(messageElement);
        
        // 滚动到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // 保存到历史
        chatHistory.push({
            sender,
            text,
            time: new Date().toISOString(),
            emotion: sender === 'user' ? currentEmotion : null
        });
        
        // 更新消息计数
        chatCount++;
        updateMessageCount();
    }
    
    // ===== 情绪处理函数 =====
    function updateEmotionDisplay() {
        const emotionInfo = getEmotionInfo(currentEmotion);
        
        currentEmotionElement.textContent = emotionInfo.name;
        currentEmotionIcon.textContent = emotionInfo.emoji;
        
        // 更新情绪统计
        emotionStats[currentEmotion]++;
        emotionCountElement.textContent = Object.values(emotionStats).reduce((a, b) => a + b, 0);
    }
    
    // ===== 贴士函数 =====
    function showRandomTip() {
        const tip = getRandomTip();
        tipContent.innerHTML = `
            <strong>${tip.title}</strong><br>
            ${tip.description}
        `;
    }
    
    // ===== 统计函数 =====
    function updateStats() {
        chatCountElement.textContent = chatCount;
    }
    
    function updateMessageCount() {
        document.getElementById('messageCount').textContent = `消息: ${chatCount}`;
    }
    
    function updateChatDuration() {
        const now = new Date();
        const duration = Math.floor((now - chatStartTime) / 60000); // 分钟
        chatTimeElement.textContent = `${duration}分钟`;
    }
    
    // ===== 时间函数 =====
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        currentTimeElement.textContent = timeString;
    }
    
    // ===== 主题切换函数 =====
    function toggleTheme() {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
        
        const icon = themeBtn.querySelector('i');
        icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        themeBtn.title = isDarkMode ? '日间模式' : '夜间模式';
    }
    
    // ===== 语音识别函数 =====
    function initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            speechRecognition = new webkitSpeechRecognition();
            speechRecognition.continuous = false;
            speechRecognition.interimResults = false;
            speechRecognition.lang = 'zh-CN';
            
            speechRecognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                userInput.value = transcript;
            };
            
            speechRecognition.onerror = function(event) {
                console.error('语音识别错误:', event.error);
            };
        } else {
            voiceBtn.style.display = 'none';
        }
    }
    
    function toggleVoiceInput() {
        if (!speechRecognition) {
            alert('您的浏览器不支持语音识别');
            return;
        }
        
        if (voiceBtn.classList.contains('listening')) {
            speechRecognition.stop();
            voiceBtn.classList.remove('listening');
            voiceBtn.querySelector('i').className = 'fas fa-microphone';
        } else {
            speechRecognition.start();
            voiceBtn.classList.add('listening');
            voiceBtn.querySelector('i').className = 'fas fa-microphone-slash';
        }
    }
    
    // ===== 弹窗函数 =====
    function showEmergencyModal() {
        emergencyModal.classList.add('active');
    }
    
    function showAboutModal() {
        aboutModal.classList.add('active');
    }
    
    function showHelpInfo() {
        const helpMessage = `
            <strong>心灵助手使用指南：</strong><br><br>
            1. 在输入框中写下你的感受<br>
            2. 点击快速情绪按钮表达常见情绪<br>
            3. 使用语音输入功能（需浏览器支持）<br>
            4. 查看右侧的情绪统计和心灵贴士<br>
            5. 紧急情况点击"紧急支持"按钮<br><br>
            <small>提示：本助手为AI工具，不能替代专业心理咨询</small>
        `;
        
        addMessage(helpMessage, 'assistant');
    }
    
    // ===== 清空对话 =====
    function clearChat() {
        if (confirm('确定要清空所有对话吗？')) {
            chatMessages.innerHTML = '';
            chatHistory = [];
            chatCount = 0;
            emotionStats = {
                sad: 0,
                anxious: 0,
                angry: 0,
                happy: 0,
                confused: 0,
                lonely: 0,
                tired: 0,
                general: 0
            };
            
            updateStats();
            updateMessageCount();
            showWelcomeMessage();
        }
    }
    
    function showWelcomeMessage() {
        setTimeout(() => {
            const welcomeMessage = `
                <strong>心灵助手：</strong><br>
                欢迎回来！我在这里倾听你的感受。<br><br>
                <small>你可以分享任何情绪，我都会认真倾听</small>
            `;
            addMessage(welcomeMessage, 'assistant');
        }, 1000);
    }
    
    // ===== 数据存储函数 =====
    function saveToLocalStorage() {
        const data = {
            chatHistory: chatHistory.slice(-50), // 保存最近50条
            emotionStats,
            chatCount,
            isDarkMode,
            lastActive: new Date().toISOString()
        };
        
        localStorage.setItem('mindAssistantData', JSON.stringify(data));
    }
    
    function loadFromLocalStorage() {
        const saved = localStorage.getItem('mindAssistantData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                
                // 恢复对话历史
                if (data.chatHistory && data.chatHistory.length > 0) {
                    data.chatHistory.forEach(msg => {
                        addMessage(msg.text, msg.sender);
                    });
                }
                
                // 恢复统计
                emotionStats = data.emotionStats || emotionStats;
                chatCount = data.chatCount || 0;
                isDarkMode = data.isDarkMode || false;
                
                // 恢复主题
                if (isDarkMode) {
                    document.body.classList.add('dark-mode');
                    const icon = themeBtn.querySelector('i');
                    icon.className = 'fas fa-sun';
                    themeBtn.title = '日间模式';
                }
                
                updateStats();
                updateMessageCount();
                updateEmotionDisplay();
                
                console.log('历史数据加载完成');
            } catch (e) {
                console.error('加载历史数据失败:', e);
            }
        }
    }
    
    // ===== 导出函数 =====
    function exportChatHistory() {
        const dataStr = JSON.stringify(chatHistory, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `心灵助手对话记录_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        addMessage('对话记录已导出为JSON文件', 'assistant');
    }
    
    // ===== 启动应用 =====
    init();
});