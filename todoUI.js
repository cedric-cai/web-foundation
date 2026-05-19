// ========== 视图层：所有 DOM 操作和事件绑定 ==========
// DOM 元素引用
const container = document.getElementById('todoListContainer');
const inputEl = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const clearBtn = document.getElementById('clearAllBtn');
const totalSpan = document.getElementById('totalCount');
const completedSpan = document.getElementById('completedCount');

// 全局数据引用（由主控脚本管理）
let currentTodos = [];

// 更新统计数据（接收 stats 对象，使用解构）
function updateStatsDisplay(stats) {
    // 使用解构赋值提取属性
    const { total, completed } = stats;
    if (totalSpan) totalSpan.innerText = total;
    if (completedSpan) completedSpan.innerText = completed;
}

// 渲染待办列表（视图核心）
function renderTodoList(todos) {
    currentTodos = todos; // 保存最新数据供事件处理使用

    if (!container) return;

    // 清空容器
    container.innerHTML = '';

    if (todos.length === 0) {
        // 显示空状态
        const emptyItem = document.createElement('li');
        emptyItem.className = 'empty-tip';
        emptyItem.innerText = '✨ 暂无待办，添加一条吧～';
        container.appendChild(emptyItem);
    } else {
        // 遍历生成列表项
        todos.forEach(todo => {
            // 使用解构赋值提取 todo 属性
            const { id, text, completed } = todo;

            const li = document.createElement('li');
            li.className = 'todo-item';
            li.setAttribute('data-id', id);

            // 待办文本
            const textSpan = document.createElement('span');
            textSpan.className = 'todo-text';
            if (completed) {
                textSpan.classList.add('todo-text--completed');
            }
            textSpan.innerText = text;

            // 删除按钮
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '✕';
            deleteBtn.setAttribute('aria-label', '删除');

            li.appendChild(textSpan);
            li.appendChild(deleteBtn);
            container.appendChild(li);
        });
    }
}

// 显示临时错误提示（输入框抖动）
function showInputError() {
    if (!inputEl) return;
    inputEl.classList.add('todo-input--error');
    setTimeout(() => {
        inputEl.classList.remove('todo-input--error');
    }, 300);
}

// 清空输入框并聚焦
function clearInputAndFocus() {
    if (inputEl) {
        inputEl.value = '';
        inputEl.focus();
    }
}

// 绑定事件委托（删除按钮 + 标记完成）
function bindEvents(handlers) {
    // handlers 包含 onDelete, onToggle
    if (!container) return;

    container.addEventListener('click', (e) => {
        // 删除按钮
        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) {
            const li = deleteBtn.closest('.todo-item');
            if (li && handlers.onDelete) {
                const id = parseInt(li.getAttribute('data-id'), 10);
                if (!isNaN(id)) {
                    handlers.onDelete(id);
                }
            }
            return;
        }

        // 点击待办文本切换完成状态
        const textSpan = e.target.closest('.todo-text');
        if (textSpan && handlers.onToggle) {
            const li = textSpan.closest('.todo-item');
            if (li) {
                const id = parseInt(li.getAttribute('data-id'), 10);
                if (!isNaN(id)) {
                    handlers.onToggle(id);
                }
            }
        }
    });
}

// 绑定输入框回车和添加按钮事件
function bindControlEvents(onAdd) {
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (onAdd) onAdd();
        });
    }
    if (inputEl) {
        inputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (onAdd) onAdd();
            }
        });
    }
}

// 绑定清空按钮事件
function bindClearEvent(onClear) {
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('⚠️ 确定要清空所有待办事项吗？此操作不可撤销。')) {
                if (onClear) onClear();
            }
        });
    }
}

// 获取当前输入框内容
function getInputValue() {
    return inputEl ? inputEl.value : '';
}