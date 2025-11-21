// ========================================
// 画面遷移制御
// ========================================

// 画面遷移イベントの設定
function setupScreenNavigationEvents() {
    // 戻るボタンのクリックイベント
    const backBtns = document.querySelectorAll('.back-btn');
    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentPath = window.location.pathname;
            const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
            window.location.href = basePath + '/top.html';
        });
    });

    // ログアウトボタンのクリックイベント
    const logoutBtns = document.querySelectorAll('.logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentPath = window.location.pathname;
            const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
            window.location.href = basePath.replace('/plant-area', '') + '/index.html';
        });
    });

    // キャンセルボタンのクリックイベント
    const cancelBtns = document.querySelectorAll('.btn-secondary');
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent.includes('キャンセル')) {
                const currentPath = window.location.pathname;
                const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
                window.location.href = basePath + '/top.html';
            }
        });
    });

    // コンクリートオーダーボタンのクリックイベント
    const concreteOrderBtn = document.querySelector('.white-button.active');
    if (concreteOrderBtn) {
        concreteOrderBtn.addEventListener('click', () => {
            const currentPath = window.location.pathname;
            const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
            window.location.href = basePath + '/production-instruction.html';
        });
    }

    // 画面セレクターの変更イベント
    setupScreenSelectorEvents();
    
    // クリアボタンのクリックイベント
    setupClearButtonEvents();
}

// 画面セレクターのイベント設定
function setupScreenSelectorEvents() {
    const screenSelectors = document.querySelectorAll('.screen-selector');
    screenSelectors.forEach(selector => {
        selector.addEventListener('change', function() {
            const selectedValue = this.value;
            const currentPath = window.location.pathname;
            const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
            
            // 現在のページと同じページに遷移しようとした場合は選択状態を元に戻す
            if (selectedValue === 'batch-history' && currentPath.includes('batch-history.html')) {
                this.value = 'batch-history';
                return;
            }
            if (selectedValue === 'production-instruction' && currentPath.includes('production-instruction.html')) {
                this.value = 'production-instruction';
                return;
            }
            
            if (selectedValue === 'batch-history') {
                window.location.href = basePath + '/batch-history.html';
            } else if (selectedValue === 'production-instruction') {
                window.location.href = basePath + '/production-instruction.html';
            }
        });
    });
}

// クリアボタンのイベント設定
function setupClearButtonEvents() {
    const clearBtns = document.querySelectorAll('.clear-btn');
    clearBtns.forEach(btn => {
        btn.addEventListener('click', clearBatchHistorySearch);
    });
}

// バッチ履歴画面の検索条件をクリア
function clearBatchHistorySearch() {
    const batchHistoryScreen = document.getElementById('batch-history-screen');
    if (batchHistoryScreen) {
        // 日付をデフォルト値に戻す
        const startDate = document.getElementById('start-date');
        const endDate = document.getElementById('end-date');
        if (startDate) startDate.value = '2025-10-01';
        if (endDate) endDate.value = '2025-11-30';
        
        // ライン選択を「全て」に戻す
        const lineSelect = document.getElementById('line-select');
        if (lineSelect) lineSelect.value = '';
        
        // プロジェクト選択を「全て」に戻す
        const projectSelect = document.getElementById('project-select');
        if (projectSelect) projectSelect.value = '';
        
        // 製品番号をクリア
        const materialInput = document.getElementById('material-input');
        if (materialInput) materialInput.value = '';
        
        // テーブルを再描画（全データ表示）
        if (typeof renderBatchHistoryTable === 'function') {
            renderBatchHistoryTable(false);
        }
    }
}

// すべての画面セレクターを更新する関数
function updateAllScreenSelectors(value) {
    const screenSelectors = document.querySelectorAll('.screen-selector');
    screenSelectors.forEach(selector => {
        selector.value = value;
    });
}

// 画面表示制御関数
function showScreen(screenId) {
    // すべての画面を非表示
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    // 指定された画面を表示
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
    
    // 生産指示書画面に遷移した場合、date-selectorを今日の日付にリセット
    if (screenId === 'production-instruction-screen') {
        updateDateSelector();
        updateDates();
    }
}
