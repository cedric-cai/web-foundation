// ========== 数据层：所有与数据相关的操作 ==========
// 存储键名
const STORAGE_KEY = 'todoList';

// 从 localStorage 加载数据
function loadTodos() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('解析 localStorage 数据失败', e);
            return [];
        }
    }
    return [];
}

// 保存数据到 localStorage
function saveTodos(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    console.log('💾 数据已保存到 localStorage:', todos);
}

// 添加待办（使用扩展运算符，不改变原数组）
function addTodo(todos, text) {
    if (!text || text.trim() === '') {
        console.warn('⚠️ 添加失败：输入内容为空');
        return todos; // 无变化，返回原数组
    }
    const newTodo = {
        id: Date.now(), // 添加唯一 id，便于删除和切换
        text: text.trim(),
        completed: false,
        createdAt: Date.now()
    };
    // 使用扩展运算符：返回新数组，新待办放在最前面
    return [newTodo, ...todos];
}

// 删除待办（使用扩展运算符 + filter）
function deleteTodo(todos, id) {
    // 使用 filter 返回新数组，不改变原数组
    return todos.filter(todo => todo.id !== id);
}

// 切换完成状态（使用 map 返回新数组）
function toggleComplete(todos, id) {
    return todos.map(todo => {
        if (todo.id === id) {
            // 使用解构赋值和扩展运算符创建新对象
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
}

// 清空全部
function clearAllTodos() {
    return []; // 返回空数组
}

// 统计未完成数量（辅助函数）
function getStats(todos) {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const remaining = total - completed;
    return { total, completed, remaining };
}