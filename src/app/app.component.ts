import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // Fixed typo here
})
export class AppComponent {
  title = 'angularCas';
  numbers: { value: number; color: string }[] = [];
  maxHistory = 100;
  darkMode = true;
  streakOrder: Array<keyof Streaks> = [
    'red',
    'black',
    'odd',
    'even',
    'm_1_18',
    'm_19_36',
    '_1_12',
    '_13_24',
    '_25_36',
    'seq_1_3x',
    'seq_2_3x',
    'seq_3_3x',
  ];

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    // Add the dark-mode class on app initialization
    const body = document.body;
    body.classList.add('dark-mode');
  }
  
  // Maps number to red or black
  getColor(num: number): string {
    return [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(num)
      ? '#c23232'
      : '#666666';
  }

  // Add number to history
  addNumber(value: number): void {
    if (isNaN(value) || value < 1 || value > 36) {
      alert('Please enter a valid number between 1 and 36.');
      return;
    }
    
    const color = this.getColor(value);
    this.numbers.unshift({ value, color });

    // Keep the list at max 100 numbers
    if (this.numbers.length > this.maxHistory) {
      this.numbers.pop();
    }

    // Clear the input field
    const inputElement = document.querySelector('input[type="number"]') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
  }

  // Toggle Dark Mode
  toggleDarkMode(): void {
    const body = document.body;
  
    if (this.darkMode) {
      body.classList.remove('dark-mode');
    } else {
      body.classList.add('dark-mode');
    }
  
    this.darkMode = !this.darkMode;
  
    console.log('Body classes:', body.classList); // Debugging
  }

  // Streak calculation helper
  calculateStreak(
    condition: (num: number) => boolean
  ): number {
    let streak = 0;
    for (const entry of this.numbers) {
      if (condition(entry.value)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  // Calculate all streaks
  getStreaks() {
    const isRed = (num: number) => this.getColor(num) === '#c23232';
    const isBlack = (num: number) => this.getColor(num) === '#666666';
  
    const streakNumbers = (condition: (num: number) => boolean) =>
      this.numbers.filter((entry) => condition(entry.value)).map((entry) => entry.value);
  
    const antiStreakCount = (condition: (num: number) => boolean): number => {
      let streak = 0;
      for (const entry of this.numbers) {
        if (!condition(entry.value)) {
          streak++;
        } else {
          break;
        }
      }
      return streak;
    };
  
    return {
      red: {
        count: this.calculateStreak(isRed),
        antiCount: antiStreakCount(isRed), // Anti-streak for red
        numbers: streakNumbers(isRed),
      },
      black: {
        count: this.calculateStreak(isBlack),
        antiCount: antiStreakCount(isBlack), // Anti-streak for black
        numbers: streakNumbers(isBlack),
      },
      odd: {
        count: this.calculateStreak((num) => num % 2 !== 0),
        antiCount: antiStreakCount((num) => num % 2 !== 0),
        numbers: streakNumbers((num) => num % 2 !== 0),
      },
      even: {
        count: this.calculateStreak((num) => num % 2 === 0),
        antiCount: antiStreakCount((num) => num % 2 === 0),
        numbers: streakNumbers((num) => num % 2 === 0),
      },
      m_1_18: {
        count: this.calculateStreak((num) => num >= 1 && num <= 18),
        antiCount: antiStreakCount((num) => num >= 1 && num <= 18),
        numbers: streakNumbers((num) => num >= 1 && num <= 18),
      },
      m_19_36: {
        count: this.calculateStreak((num) => num >= 19 && num <= 36),
        antiCount: antiStreakCount((num) => num >= 19 && num <= 36),
        numbers: streakNumbers((num) => num >= 19 && num <= 36),
      },
      _1_12: {
        count: this.calculateStreak((num) => num >= 1 && num <= 12),
        antiCount: antiStreakCount((num) => num >= 1 && num <= 12),
        numbers: streakNumbers((num) => num >= 1 && num <= 12),
      },
      _13_24: {
        count: this.calculateStreak((num) => num >= 13 && num <= 24),
        antiCount: antiStreakCount((num) => num >= 13 && num <= 24),
        numbers: streakNumbers((num) => num >= 13 && num <= 24),
      },
      _25_36: {
        count: this.calculateStreak((num) => num >= 25 && num <= 36),
        antiCount: antiStreakCount((num) => num >= 25 && num <= 36),
        numbers: streakNumbers((num) => num >= 25 && num <= 36),
      },
      seq_1_3x: {
        count: this.calculateStreak((num) => (num - 1) % 3 === 0),
        antiCount: antiStreakCount((num) => (num - 1) % 3 === 0),
        numbers: streakNumbers((num) => (num - 1) % 3 === 0),
      },
      seq_2_3x: {
        count: this.calculateStreak((num) => (num - 2) % 3 === 0),
        antiCount: antiStreakCount((num) => (num - 2) % 3 === 0),
        numbers: streakNumbers((num) => (num - 2) % 3 === 0),
      },
      seq_3_3x: {
        count: this.calculateStreak((num) => (num - 3) % 3 === 0),
        antiCount: antiStreakCount((num) => (num - 3) % 3 === 0),
        numbers: streakNumbers((num) => (num - 3) % 3 === 0),
      },
    };
  }
  
  // Add the new getter here
  get sortedStreakOrder(): Array<{ key: keyof Streaks; antiCount: number; numbers: number[] }> {
    const streaks = this.getStreaks();
    return Object.keys(streaks)
      .map((key) => ({
        key: key as keyof Streaks,
        antiCount: streaks[key as keyof Streaks].antiCount,
        numbers: streaks[key as keyof Streaks].numbers,
      }))
      .sort((a, b) => b.antiCount - a.antiCount); // Ascending by anti-streak count
  }
  
  clearHistory(): void {
    this.numbers = [];
  }
  
  ngAfterViewInit(): void {
    const inputElement = document.querySelector('input[type="number"]') as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
  }
}

type StreakData = {
  count: number;
  numbers: number[];
};

type Streaks = {
  red: StreakData;
  black: StreakData;
  odd: StreakData;
  even: StreakData;
  m_1_18: StreakData;
  m_19_36: StreakData;
  _1_12: StreakData;
  _13_24: StreakData;
  _25_36: StreakData;
  seq_1_3x: StreakData;
  seq_2_3x: StreakData;
  seq_3_3x: StreakData;
};