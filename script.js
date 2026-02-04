// ======================
// 模拟Gitee提交数据
// 实际使用时应替换为真实API数据
// ======================
const mockCommitData = {
    labels: ['1月1日', '1月5日', '1月10日', '1月15日', '1月20日', '1月25日', '1月30日', 
             '2月1日', '2月5日', '2月10日', '2月15日', '2月20日', '2月25日', '2月28日'],
    datasets: [{
        label: '每日代码提交次数',
         [5, 12, 8, 20, 15, 25, 18, 30, 22, 28, 35, 40, 38, 45],
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 7,
        pointBackgroundColor: '#0f172a',
        pointBorderColor: '#38bdf8',
        pointHoverRadius: 9,
        pointHoverBackgroundColor: '#38bdf8',
        pointHoverBorderColor: '#0f172a',
        pointHoverBorderWidth: 3,
        borderCapStyle: 'round',
        borderJoinStyle: 'round',
        cubicInterpolationMode: 'monotone'
    }]
};

// ======================
// 创建折线图
// ======================
const ctx = document.getElementById('commitChart').getContext('2d');
const commitChart = new Chart(ctx, {
    type: 'line',
    data: mockCommitData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Gitee代码提交趋势图',
                font: {
                    size: 22,
                    weight: 'bold',
                    family: "'Segoe UI', 'Microsoft YaHei', sans-serif"
                },
                color: '#38bdf8',
                padding: {
                    top: 10,
                    bottom: 20
                }
            },
            legend: {
                labels: {
                    color: '#cbd5e1',
                    font: {
                        size: 15,
                        family: "'Segoe UI', 'Microsoft YaHei', sans-serif"
                    }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(30, 58, 138, 0.95)',
                titleColor: '#38bdf8',
                bodyColor: '#cbd5e1',
                borderColor: '#38bdf8',
                borderWidth: 1,
                padding: 14,
                displayColors: true,
                callbacks: {
                    label: function(context) {
                        return ` ${context.parsed.y} 次提交`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(56, 189, 248, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: '#cbd5e1',
                    font: {
                        size: 13,
                        family: "'Segoe UI', 'Microsoft YaHei', sans-serif"
                    }
                },
                title: {
                    display: true,
                    text: '日期',
                    color: '#94a3b8',
                    font: {
                        size: 14
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(56, 189, 248, 0.08)',
                    drawBorder: false
                },
                ticks: {
                    color: '#cbd5e1',
                    stepSize: 10,
                    font: {
                        size: 13,
                        family: "'Segoe UI', 'Microsoft YaHei', sans-serif"
                    }
                },
                title: {
                    display: true,
                    text: '提交次数',
                    color: '#94a3b8',
                    font: {
                        size: 14
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'nearest'
        },
        animation: {
            duration: 2000,
            easing: 'easeOutQuart'
        },
        hover: {
            mode: 'nearest',
            intersect: false
        }
    }
});

// ======================
// 更新统计卡片数据
// ======================
function updateStats() {
    const totalCommits = mockCommitData.datasets[0].data.reduce((a, b) => a + b, 0);
    const contributors = 8;
    const linesChanged = totalCommits * 150;
    const activeDays = mockCommitData.labels.length;

    document.getElementById('totalCommits').textContent = totalCommits;
    document.getElementById('contributors').textContent = contributors;
    document.getElementById('linesChanged').textContent = linesChanged.toLocaleString();
    document.getElementById('activeDays').textContent = activeDays;
}

// ======================
// 导航栏高亮
// ======================
function setActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// ======================
// 页面加载完成后执行
// ======================
window.addEventListener('DOMContentLoaded', () => {
    updateStats();
    setActiveNav();
    
    console.log('🚀 物联网技能大赛页面已加载');
    console.log('💡 提示：如需连接真实Gitee数据，请修改script.js中的mockCommitData');
});

// ======================
// 模拟实时更新效果（可选）
// ======================
// 每5秒随机更新一次数据（演示用）
setInterval(() => {
    const newData = mockCommitData.datasets[0].data.map(() => 
        Math.floor(Math.random() * 50) + 5
    );
    
    commitChart.data.datasets[0].data = newData;
    commitChart.update();
    
    updateStats();
}, 5000);

// ======================
// 如需连接真实Gitee API，取消注释以下代码：
// ======================
/*
async function fetchGiteeCommits(owner, repo, token) {
    try {
        const response = await fetch(
            `https://gitee.com/api/v5/repos/${owner}/${repo}/commits?access_token=${token}&page=1&per_page=100`
        );
        
        if (!response.ok) {
            throw new Error('API请求失败');
        }
        
        const commits = await response.json();
        
        // 按日期聚合提交次数
        const dateMap = {};
        commits.forEach(commit => {
            const date = new Date(commit.commit.author.date);
            const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;
            dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;
        });
        
        // 转换为图表数据
        const labels = Object.keys(dateMap);
        const data = labels.map(date => dateMap[date]);
        
        return { labels, data };
        
    } catch (error) {
        console.error('获取Gitee数据失败:', error);
        return null;
    }
}

// 使用示例：
// fetchGiteeCommits('your_owner', 'your_repo', 'your_token')
//     .then(result => {
//         if (result) {
//             commitChart.data.labels = result.labels;
//             commitChart.data.datasets[0].data = result.data;
//             commitChart.update();
//             updateStats();
//         }
//     });
*/
