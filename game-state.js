/* ===== 全局状态管理系统 =====
 * 所有页面通过 localStorage 共享游戏进度
 * "捡到了对皮的手机？" 专用版
 */

window.GameState = {
  // ===== 基础读写 =====
  get(key) {
    try {
      return JSON.parse(localStorage.getItem('game2_' + key));
    } catch {
      return null;
    }
  },

  set(key, value) {
    localStorage.setItem('game2_' + key, JSON.stringify(value));
  },

  // ===== 进度管理 =====
  init() {
    if (!this.get('clues')) this.set('clues', []);
    if (!this.get('unlockedPages')) this.set('unlockedPages', ['index']);
    if (!this.get('gameStarted')) this.set('gameStarted', false);
    if (!this.get('systemUnlocked')) this.set('systemUnlocked', false);
    if (!this.get('desktopped')) this.set('desktopped', false);
  },

  // ===== 线索系统 =====
  addClue(clueId) {
    const clues = this.get('clues') || [];
    if (!clues.includes(clueId)) {
      clues.push(clueId);
      this.set('clues', clues);
    }
  },

  hasClue(clueId) {
    return (this.get('clues') || []).includes(clueId);
  },

  getClueCount() {
    return (this.get('clues') || []).length;
  },

  // ===== 页面解锁 =====
  unlockPage(pageId) {
    const unlocked = this.get('unlockedPages') || [];
    if (!unlocked.includes(pageId)) {
      unlocked.push(pageId);
      this.set('unlockedPages', unlocked);
    }
  },

  isPageUnlocked(pageId) {
    if (pageId === 'index') return true;
    return (this.get('unlockedPages') || []).includes(pageId);
  },

  // ===== 解锁正常系统 =====
  unlockNormalSystem(password) {
    const correct = this.get('correctPassword') || '0421';
    if (password === correct) {
      this.set('systemUnlocked', true);
      this.unlockPage('wechat');
      this.unlockPage('ending');
      return true;
    }
    return false;
  },

  // ===== 重置 =====
  reset() {
    const keys = Object.keys(localStorage);
    keys.forEach(k => {
      if (k.startsWith('game2_')) localStorage.removeItem(k);
    });
  },

  // ===== 监听其他窗口的变化 =====
  onChange(callback) {
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('game2_')) {
        const stateKey = e.key.replace('game2_', '');
        try {
          callback(stateKey, JSON.parse(e.newValue), JSON.parse(e.oldValue));
        } catch {}
      }
    });
  },

  // ===== 设置通关密码 =====
  setCorrectPassword(pwd) {
    this.set('correctPassword', pwd);
  }
};
