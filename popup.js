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
    this.finishedTasks = document.getElementById('finished-tasks');
    this.toggleFinishedTasksButton = document.getElementById('toggle-finished-tasks');
    this.todos = JSON.parse(localStorage.getItem('todos') || '[]');
    this.finishedTodos = JSON.parse(localStorage.getItem('finishedTodos') || '[]');
    this.taskLengthLimit = 40; // Set the task length limit here
    this.initializeTodoList();
  }

  initializeTodoList() {
    this.renderTodos();
    this.todoInput.addEventListener('keypress', (e) => this.handleNewTodoKeyPress(e));
    document.querySelector('.add-todo').addEventListener('click', () => this.handleNewTodoClick());
    this.todoList.addEventListener('click', (e) => this.handleTodoClick(e));
    this.toggleFinishedTasksButton.addEventListener('click', () => this.toggleFinishedTasks());
    this.finishedTasks.style.display = 'none'; // Ensure initial state is hidden
  }

  handleNewTodoKeyPress(e) {
    if (e.key === 'Enter' && this.todoInput.value.trim()) {
      this.addNewTodo();
    }
  }

  handleNewTodoClick() {
    if (this.todoInput.value.trim()) {
      this.addNewTodo();
    }
  }

  addNewTodo() {
    const taskText = this.todoInput.value.trim();
    if (taskText.length > this.taskLengthLimit) {
      alert(`Task length should not exceed ${this.taskLengthLimit} characters.`);
      return;
    }
    const todo = {
      text: taskText,
      completed: false,
      id: Date.now()
    };
    this.todos.push(todo);
    this.saveTodos();
    this.renderTodos();
    this.todoInput.value = '';
  }

  handleTodoClick(e) {
    if (e.target.classList.contains('tick-button')) {
      const taskItem = e.target.closest('li');
      const taskId = parseInt(taskItem.dataset.id, 10);
      this.completeTodoTask(taskId);
    }
  }

  completeTodoTask(taskId) {
    const todoIndex = this.todos.findIndex(todo => todo.id === taskId);
    if (todoIndex > -1) {
      const [completedTodo] = this.todos.splice(todoIndex, 1);
      completedTodo.completed = true;
      completedTodo.finishedDate = new Date().toLocaleString();
      this.finishedTodos.push(completedTodo);
      this.saveTodos();
      this.renderTodos();
    }
  }

  toggleFinishedTasks() {
    if (this.finishedTasks.style.display === 'none') {
      this.finishedTasks.style.display = 'block';
      this.toggleFinishedTasksButton.textContent = 'Hide Finished Tasks';
    } else {
      this.finishedTasks.style.display = 'none';
      this.toggleFinishedTasksButton.textContent = 'Show Finished Tasks';
    }
  }

  saveTodos() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
    localStorage.setItem('finishedTodos', JSON.stringify(this.finishedTodos));
  }

  renderTodos() {
    this.todoList.innerHTML = '';
    this.finishedTasks.innerHTML = '';

    this.todos.forEach(todo => {
      const todoItem = document.createElement('li');
      todoItem.dataset.id = todo.id;
      todoItem.innerHTML = `${todo.text} <button class="tick-button">✔</button>`;
      this.todoList.appendChild(todoItem);
    });

    this.finishedTodos.forEach(todo => {
      const finishedItem = document.createElement('li');
      finishedItem.dataset.id = todo.id;
      finishedItem.innerHTML = `${todo.text} <span class="finished-date">(${todo.finishedDate})</span>`;
      this.finishedTasks.appendChild(finishedItem);
    });
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
    
    // Add keyboard support with active section check
    document.addEventListener('keydown', (e) => {
      const calcSection = document.getElementById('calc');
      // Only handle calculator keys if calculator section is active
      if (calcSection.classList.contains('active')) {
        this.handleKeyPress(e);
      }
    });
  }

  handleKeyPress(e) {
    // Prevent default behavior for calculator keys only when calculator is active
    if (this.isCalculatorKey(e.key)) {
      e.preventDefault();
    }

    // Map keyboard inputs to calculator functions
    switch (e.key) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '.':
        this.inputNumber(e.key);
        break;
      case '+':
      case 'Add':
        this.handleOperator('+');
        break;
      case '-':
      case 'Subtract':
        this.handleOperator('-');
        break;
      case '*':
      case 'Multiply':
        this.handleOperator('×');
        break;
      case '/':
      case 'Divide':
        this.handleOperator('÷');
        break;
      case 'Enter':
      case '=':
        this.calculate();
        break;
      case 'Escape':
        this.clear();
        break;
      case 'Backspace':
        this.deleteLastDigit();
        break;
      case '%':
        this.percentage();
        break;
    }
  }

  isCalculatorKey(key) {
    const validKeys = [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      '+', '-', '*', '/', '=', 'Enter', 'Escape', 'Backspace', '%', '.',
      'Add', 'Subtract', 'Multiply', 'Divide'
    ];
    return validKeys.includes(key);
  }

  deleteLastDigit() {
    if (this.newNumber) return;
    this.currentValue = this.currentValue.slice(0, -1) || '0';
    this.updateDisplay();
  }

  // Keep all existing methods
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
    this.display = document.querySelector('.timer-display .time');
    this.millisecondsDisplay = document.querySelector('.timer-display .milliseconds');
    this.startButton = document.getElementById('start');
    this.resetButton = document.getElementById('reset');
    this.seconds = 0;
    this.milliseconds = 0;
    this.interval = null;
    this.initializeTimer();
  }

  initializeTimer() {
    this.startButton.addEventListener('click', () => this.toggleTimer());
    this.resetButton.addEventListener('click', () => this.resetTimer());
  }

  toggleTimer() {
    if (this.interval) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.milliseconds += 10;
      if (this.milliseconds >= 1000) {
        this.seconds++;
        this.milliseconds = 0;
      }
      this.updateDisplay();
    }, 10);
    this.startButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
  }

  pauseTimer() {
    clearInterval(this.interval);
    this.interval = null;
    this.startButton.innerHTML = '<i class="fas fa-play"></i> Start';
  }

  resetTimer() {
    this.pauseTimer();
    this.seconds = 0;
    this.milliseconds = 0;
    this.updateDisplay();
  }

  updateDisplay() {
    const hrs = Math.floor(this.seconds / 3600);
    const mins = Math.floor((this.seconds % 3600) / 60);
    const secs = this.seconds % 60;
    const millis = this.milliseconds / 10;
    this.display.textContent = 
      `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    this.millisecondsDisplay.textContent = `.${millis.toString().padStart(2, '0')}`;
  }
}

// Notes Manager
class NotesManager {
  constructor() {
    this.notesInput = document.getElementById('notes-input');
    this.notesList = document.getElementById('notes-list');
    this.notes = JSON.parse(localStorage.getItem('notes') || '[]');
    this.initializeNotes();
  }

  initializeNotes() {
    this.renderNotes();
    document.querySelector('.add-note').addEventListener('click', () => this.addNote());
    
    // Auto-resize functionality
    this.notesInput.addEventListener('input', () => this.autoResize());
    
    // Handle Enter key
    this.notesInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.addNote();
      }
    });

    this.notesList.addEventListener('click', (e) => this.handleNoteClick(e));
    
    this.notesList.addEventListener('click', (e) => {
      if (e.target.closest('.export-dropdown')) {
        const format = e.target.dataset.format;
        const noteId = e.target.closest('li').dataset.id;
        if (format) this.exportNote(noteId, format);
      }
    });
  }

  autoResize() {
    // Reset height to allow proper calculation
    this.notesInput.style.height = 'auto';
    // Set new height based on content
    this.notesInput.style.height = Math.min(this.notesInput.scrollHeight, 200) + 'px';
  }

  addNote() {
    const text = this.notesInput.value.trim();
    if (!text) return;

    const note = {
      id: Date.now(),
      text: text,
      date: new Date().toLocaleString()
    };

    this.notes.push(note);
    this.saveNotes();
    this.renderNotes();
    
    // Reset input and height
    this.notesInput.value = '';
    this.notesInput.style.height = 'auto';
  }

  handleNoteClick(e) {
    if (e.target.classList.contains('delete-note')) {
      const noteId = parseInt(e.target.closest('li').dataset.id);
      this.deleteNote(noteId);
    }
  }

  deleteNote(id) {
    this.notes = this.notes.filter(note => note.id !== id);
    this.saveNotes();
    this.renderNotes();
  }

  saveNotes() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  renderNotes() {
    this.notesList.innerHTML = '';
    const sortedNotes = [...this.notes].sort((a, b) => b.id - a.id);
    
    sortedNotes.forEach(note => {
      // Create elements
      const noteElement = document.createElement('li');
      const noteContent = document.createElement('div');
      const noteText = document.createElement('p');
      const noteDate = document.createElement('span');
      const noteActions = document.createElement('div');
      
      // Set classes
      noteContent.className = 'note-content';
      noteDate.className = 'note-date';
      noteActions.className = 'note-actions';
      noteElement.dataset.id = note.id;
      
      // Set content
      noteText.textContent = note.text;
      noteDate.textContent = note.date;
      
      // Create buttons
      noteActions.innerHTML = `
        <button class="delete-note"><i class="fas fa-trash"></i></button>
        <div class="export-wrapper">
          <button class="export-note"><i class="fas fa-file-export"></i></button>
          <div class="export-dropdown">
            <button data-format="txt">Text (.txt)</button>
            <button data-format="md">Markdown (.md)</button>
            <button data-format="json">JSON (.json)</button>
          </div>
        </div>
      `;
      
      // Build structure
      noteContent.appendChild(noteText);
      noteContent.appendChild(noteDate);
      noteElement.appendChild(noteContent);
      noteElement.appendChild(noteActions);
      
      // Add to list
      this.notesList.appendChild(noteElement);
    });
  }

  exportNote(id, format) {
    const note = this.notes.find(n => n.id === parseInt(id));
    if (!note) return;

    let content = '';
    let filename = `note_${note.id}`;
    
    switch (format) {
      case 'txt':
        content = `${note.text}\n\nCreated: ${note.date}`;
        filename += '.txt';
        break;
      case 'md':
        content = `# Note\n\n${note.text}\n\n_Created: ${note.date}_`;
        filename += '.md';
        break;
      case 'json':
        content = JSON.stringify(note, null, 2);
        filename += '.json';
        break;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}


// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
  const nav = new NavigationManager();
  const todo = new TodoManager();
  const calc = new Calculator();
  const timer = new TimerManager();
  const notes = new NotesManager();
});