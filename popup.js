// Utility Navigation Manager
class NavigationManager {
  constructor() {
    this.initializeNavigation();
  }

  initializeNavigation() {
    document.querySelectorAll('.menu-btn:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('disabled')) return;
        this.switchUtility(btn);
      });
    });
  }

  switchUtility(btn) {
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.utility').forEach(u => u.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.utility).classList.add('active');
  }
}

// Todo List Manager
class TodoManager {
  constructor() {
    this.todoInput = document.getElementById('todo-input');
    this.todoList = document.getElementById('todo-list');
    this.todos = JSON.parse(localStorage.getItem('todos') || '[]');
    this.initializeTodoList();
  }

  initializeTodoList() {
    this.renderTodos();
    this.todoInput.addEventListener('keypress', (e) => this.handleNewTodo(e));
    document.querySelector('.add-todo').addEventListener('click', () => this.handleNewTodo());
  }

  handleNewTodo(e = null) {
    if ((e && e.key === 'Enter' && this.todoInput.value.trim()) || 
        (!e && this.todoInput.value.trim())) {
      const todo = {
        text: this.todoInput.value.trim(),
        completed: false,
        id: Date.now()
      };
      this.todos.push(todo);
      this.todoList.appendChild(this.createTodoElement(todo));
      this.todoInput.value = '';
      this.saveTodos();
    }
  }

  createTodoElement(todo) {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
      <div class="todo-actions">
        <button class="todo-toggle"><i class="fas fa-check"></i></button>
        <button class="todo-delete"><i class="fas fa-trash"></i></button>
      </div>
    `;

    li.querySelector('.todo-toggle').addEventListener('click', () => {
      todo.completed = !todo.completed;
      li.querySelector('.todo-text').classList.toggle('completed');
      this.saveTodos();
    });

    li.querySelector('.todo-delete').addEventListener('click', () => {
      this.todos = this.todos.filter(t => t.id !== todo.id);
      li.remove();
      this.saveTodos();
    });

    return li;
  }

  renderTodos() {
    this.todoList.innerHTML = '';
    this.todos.forEach(todo => {
      this.todoList.appendChild(this.createTodoElement(todo));
    });
  }

  saveTodos() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }
}

// Calculator Manager
class Calculator {
  constructor() {
    this.display = document.getElementById('calc-display');
    this.currentValue = '0';
    this.previousValue = null;
    this.operator = null;
    this.newNumber = true;
    this.initializeCalculator();
  }

  initializeCalculator() {
    document.querySelector('.calc-buttons').addEventListener('click', (e) => {
      if (e.target.matches('button')) this.handleInput(e.target.textContent);
    });
  }

  handleInput(value) {
    if (value >= '0' && value <= '9' || value === '.') {
      this.inputNumber(value);
    } else if (['+', '-', '×', '÷'].includes(value)) {
      this.handleOperator(value);
    } else if (value === '=') {
      this.calculate();
    } else if (value === 'AC') {
      this.clear();
    } else if (value === '±') {
      this.toggleSign();
    } else if (value === '%') {
      this.percentage();
    }
  }

  inputNumber(num) {
    if (this.newNumber) {
      this.currentValue = num === '.' ? '0.' : num;
      this.newNumber = false;
    } else {
      if (num === '.' && this.currentValue.includes('.')) return;
      this.currentValue += num;
    }
    this.updateDisplay();
  }

  handleOperator(op) {
    if (this.previousValue === null) {
      this.previousValue = parseFloat(this.currentValue);
    } else if (!this.newNumber) {
      this.calculate();
    }
    this.operator = op;
    this.newNumber = true;
  }

  calculate() {
    if (this.operator === null || this.newNumber) return;
    
    const curr = parseFloat(this.currentValue);
    const prev = this.previousValue;
    let result;

    switch (this.operator) {
      case '+': result = prev + curr; break;
      case '-': result = prev - curr; break;
      case '×': result = prev * curr; break;
      case '÷': result = curr !== 0 ? prev / curr : 'Error'; break;
    }

    if (result === 'Error') {
      this.clear();
      this.currentValue = 'Error';
    } else {
      this.currentValue = result.toString();
      this.previousValue = null;
      this.operator = null;
    }
    this.newNumber = true;
    this.updateDisplay();
  }

  clear() {
    this.currentValue = '0';
    this.previousValue = null;
    this.operator = null;
    this.newNumber = true;
    this.updateDisplay();
  }

  toggleSign() {
    this.currentValue = (-parseFloat(this.currentValue)).toString();
    this.updateDisplay();
  }

  percentage() {
    this.currentValue = (parseFloat(this.currentValue) / 100).toString();
    this.updateDisplay();
  }

  updateDisplay() {
    this.display.value = this.currentValue;
  }
}

// Timer Manager
class TimerManager {
  constructor() {
    this.display = document.querySelector('.timer-display');
    this.seconds = 0;
    this.interval = null;
    this.isRunning = false;
    this.initializeTimer();
  }

  initializeTimer() {
    document.getElementById('start').addEventListener('click', () => this.toggleTimer());
    document.getElementById('stop').addEventListener('click', () => this.stopTimer());
    document.getElementById('reset').addEventListener('click', () => this.resetTimer());
  }

  toggleTimer() {
    if (!this.isRunning) {
      this.startTimer();
    } else {
      this.pauseTimer();
    }
  }

  startTimer() {
    this.isRunning = true;
    this.interval = setInterval(() => {
      this.seconds++;
      this.updateDisplay();
    }, 1000);
    document.getElementById('start').innerHTML = '<i class="fas fa-pause"></i> Pause';
  }

  pauseTimer() {
    this.isRunning = false;
    clearInterval(this.interval);
    document.getElementById('start').innerHTML = '<i class="fas fa-play"></i> Start';
  }

  stopTimer() {
    this.pauseTimer();
  }

  resetTimer() {
    this.pauseTimer();
    this.seconds = 0;
    this.updateDisplay();
  }

  updateDisplay() {
    const hrs = Math.floor(this.seconds / 3600);
    const mins = Math.floor((this.seconds % 3600) / 60);
    const secs = this.seconds % 60;
    this.display.textContent = 
      `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
  const nav = new NavigationManager();
  const todo = new TodoManager();
  const calc = new Calculator();
  const timer = new TimerManager();
});